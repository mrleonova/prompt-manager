const db = require('../database/connection');
const Tag = require('./Tag');

class Prompt {
    static async findAll(options = {}) {
        const { 
            limit = 20, 
            offset = 0, 
            search = '', 
            categoryId, 
            tags = [], 
            isTemplate, 
            isFavorite,
            sortBy = 'updated_at',
            sortOrder = 'DESC'
        } = options;

        let query = `
            SELECT p.*, c.name as category_name, c.color as category_color
            FROM prompts p
            LEFT JOIN categories c ON p.category_id = c.id
        `;
        let params = [];
        let whereConditions = [];

        if (search) {
            whereConditions.push('(p.title LIKE ? OR p.description LIKE ? OR p.content LIKE ?)');
            params.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }

        if (categoryId) {
            whereConditions.push('p.category_id = ?');
            params.push(categoryId);
        }

        if (tags.length > 0) {
            const tagPlaceholders = tags.map(() => '?').join(',');
            whereConditions.push(`p.id IN (
                SELECT pt.prompt_id FROM prompt_tags pt
                JOIN tags t ON pt.tag_id = t.id
                WHERE t.name IN (${tagPlaceholders})
                GROUP BY pt.prompt_id
                HAVING COUNT(DISTINCT t.id) = ?
            )`);
            params.push(...tags, tags.length);
        }

        if (isTemplate !== undefined) {
            whereConditions.push('p.is_template = ?');
            params.push(isTemplate ? 1 : 0);
        }

        if (isFavorite !== undefined) {
            whereConditions.push('p.is_favorite = ?');
            params.push(isFavorite ? 1 : 0);
        }

        if (whereConditions.length > 0) {
            query += ' WHERE ' + whereConditions.join(' AND ');
        }

        const validSortColumns = ['title', 'created_at', 'updated_at', 'usage_count'];
        const validSortOrders = ['ASC', 'DESC'];
        
        const safeSortBy = validSortColumns.includes(sortBy) ? sortBy : 'updated_at';
        const safeSortOrder = validSortOrders.includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'DESC';

        query += ` ORDER BY p.${safeSortBy} ${safeSortOrder} LIMIT ? OFFSET ?`;
        params.push(limit, offset);

        const prompts = await db.all(query, params);
        
        // Get tags for each prompt
        for (let prompt of prompts) {
            prompt.tags = await this.getTags(prompt.id);
            prompt.variables = await this.getTemplateVariables(prompt.id);
        }

        return prompts;
    }

    static async findById(id) {
        const prompt = await db.get(`
            SELECT p.*, c.name as category_name, c.color as category_color
            FROM prompts p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.id = ?
        `, [id]);

        if (prompt) {
            prompt.tags = await this.getTags(id);
            prompt.variables = await this.getTemplateVariables(id);
        }

        return prompt;
    }

    static async create(promptData) {
        const { 
            title, 
            content, 
            description, 
            categoryId, 
            tags = [], 
            isTemplate = false, 
            isFavorite = false,
            variables = []
        } = promptData;

        const result = await db.run(
            'INSERT INTO prompts (title, content, description, category_id, is_template, is_favorite) VALUES (?, ?, ?, ?, ?, ?)',
            [title, content, description, categoryId, isTemplate ? 1 : 0, isFavorite ? 1 : 0]
        );

        const promptId = result.id;

        // Create initial version
        await db.run(
            'INSERT INTO prompt_versions (prompt_id, version, title, content, description, change_log) VALUES (?, ?, ?, ?, ?, ?)',
            [promptId, 1, title, content, description, 'Initial version']
        );

        // Add tags
        await this.updateTags(promptId, tags);

        // Add template variables
        if (isTemplate && variables.length > 0) {
            await this.updateTemplateVariables(promptId, variables);
        }

        return await this.findById(promptId);
    }

    static async update(id, promptData) {
        const currentPrompt = await this.findById(id);
        if (!currentPrompt) return null;

        const { 
            title, 
            content, 
            description, 
            categoryId, 
            tags = [], 
            isTemplate = false, 
            isFavorite = false,
            variables = [],
            changeLog = ''
        } = promptData;

        // Check if content has changed to create new version
        const contentChanged = currentPrompt.content !== content || currentPrompt.title !== title;
        let newVersion = currentPrompt.version;

        if (contentChanged) {
            newVersion = currentPrompt.version + 1;
            // Create new version
            await db.run(
                'INSERT INTO prompt_versions (prompt_id, version, title, content, description, change_log) VALUES (?, ?, ?, ?, ?, ?)',
                [id, newVersion, title, content, description, changeLog || 'Updated content']
            );
        }

        await db.run(
            'UPDATE prompts SET title = ?, content = ?, description = ?, category_id = ?, is_template = ?, is_favorite = ?, version = ? WHERE id = ?',
            [title, content, description, categoryId, isTemplate ? 1 : 0, isFavorite ? 1 : 0, newVersion, id]
        );

        // Update tags
        await this.updateTags(id, tags);

        // Update template variables
        await this.updateTemplateVariables(id, variables);

        return await this.findById(id);
    }

    static async delete(id) {
        const result = await db.run('DELETE FROM prompts WHERE id = ?', [id]);
        return result.changes > 0;
    }

    static async incrementUsageCount(id) {
        await db.run('UPDATE prompts SET usage_count = usage_count + 1 WHERE id = ?', [id]);
    }

    static async getTags(promptId) {
        return await db.all(`
            SELECT t.* FROM tags t
            JOIN prompt_tags pt ON t.id = pt.tag_id
            WHERE pt.prompt_id = ?
            ORDER BY t.name
        `, [promptId]);
    }

    static async getTemplateVariables(promptId) {
        return await db.all(
            'SELECT * FROM template_variables WHERE prompt_id = ? ORDER BY name',
            [promptId]
        );
    }

    static async updateTags(promptId, tagNames) {
        // Remove existing tags
        await db.run('DELETE FROM prompt_tags WHERE prompt_id = ?', [promptId]);

        // Add new tags
        for (let tagName of tagNames) {
            if (tagName.trim()) {
                const tag = await Tag.findOrCreate(tagName.trim());
                await db.run(
                    'INSERT INTO prompt_tags (prompt_id, tag_id) VALUES (?, ?)',
                    [promptId, tag.id]
                );
            }
        }
    }

    static async updateTemplateVariables(promptId, variables) {
        // Remove existing variables
        await db.run('DELETE FROM template_variables WHERE prompt_id = ?', [promptId]);

        // Add new variables
        for (let variable of variables) {
            const { name, description, defaultValue, variableType, options, required } = variable;
            await db.run(
                'INSERT INTO template_variables (prompt_id, name, description, default_value, variable_type, options, required) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [promptId, name, description, defaultValue, variableType || 'text', JSON.stringify(options || []), required ? 1 : 0]
            );
        }
    }

    static async getVersions(promptId) {
        return await db.all(
            'SELECT * FROM prompt_versions WHERE prompt_id = ? ORDER BY version DESC',
            [promptId]
        );
    }

    static async getVersion(promptId, version) {
        return await db.get(
            'SELECT * FROM prompt_versions WHERE prompt_id = ? AND version = ?',
            [promptId, version]
        );
    }

    static async count(options = {}) {
        const { search = '', categoryId, tags = [], isTemplate, isFavorite } = options;

        let query = 'SELECT COUNT(*) as total FROM prompts p';
        let params = [];
        let whereConditions = [];

        if (search) {
            whereConditions.push('(p.title LIKE ? OR p.description LIKE ? OR p.content LIKE ?)');
            params.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }

        if (categoryId) {
            whereConditions.push('p.category_id = ?');
            params.push(categoryId);
        }

        if (tags.length > 0) {
            const tagPlaceholders = tags.map(() => '?').join(',');
            whereConditions.push(`p.id IN (
                SELECT pt.prompt_id FROM prompt_tags pt
                JOIN tags t ON pt.tag_id = t.id
                WHERE t.name IN (${tagPlaceholders})
                GROUP BY pt.prompt_id
                HAVING COUNT(DISTINCT t.id) = ?
            )`);
            params.push(...tags, tags.length);
        }

        if (isTemplate !== undefined) {
            whereConditions.push('p.is_template = ?');
            params.push(isTemplate ? 1 : 0);
        }

        if (isFavorite !== undefined) {
            whereConditions.push('p.is_favorite = ?');
            params.push(isFavorite ? 1 : 0);
        }

        if (whereConditions.length > 0) {
            query += ' WHERE ' + whereConditions.join(' AND ');
        }

        const result = await db.get(query, params);
        return result.total;
    }
}

module.exports = Prompt;