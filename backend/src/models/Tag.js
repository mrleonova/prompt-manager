const db = require('../database/connection');

class Tag {
    static async findAll(options = {}) {
        const { limit = 100, offset = 0, search = '' } = options;
        let query = 'SELECT * FROM tags';
        let params = [];

        if (search) {
            query += ' WHERE name LIKE ? OR description LIKE ?';
            params.push(`%${search}%`, `%${search}%`);
        }

        query += ' ORDER BY name ASC LIMIT ? OFFSET ?';
        params.push(limit, offset);

        return await db.all(query, params);
    }

    static async findById(id) {
        return await db.get('SELECT * FROM tags WHERE id = ?', [id]);
    }

    static async findByName(name) {
        return await db.get('SELECT * FROM tags WHERE name = ?', [name]);
    }

    static async create(tagData) {
        const { name, description } = tagData;
        const result = await db.run(
            'INSERT INTO tags (name, description) VALUES (?, ?)',
            [name, description]
        );
        return await this.findById(result.id);
    }

    static async update(id, tagData) {
        const { name, description } = tagData;
        await db.run(
            'UPDATE tags SET name = ?, description = ? WHERE id = ?',
            [name, description, id]
        );
        return await this.findById(id);
    }

    static async delete(id) {
        const result = await db.run('DELETE FROM tags WHERE id = ?', [id]);
        return result.changes > 0;
    }

    static async findOrCreate(name) {
        let tag = await this.findByName(name);
        if (!tag) {
            tag = await this.create({ name, description: null });
        }
        return tag;
    }

    static async getPopularTags(limit = 20) {
        return await db.all(`
            SELECT t.*, COUNT(pt.tag_id) as usage_count
            FROM tags t
            LEFT JOIN prompt_tags pt ON t.id = pt.tag_id
            GROUP BY t.id
            ORDER BY usage_count DESC, t.name ASC
            LIMIT ?
        `, [limit]);
    }
}

module.exports = Tag;