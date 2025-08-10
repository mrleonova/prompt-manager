const db = require('../database/connection');

class Category {
    static async findAll(options = {}) {
        const { limit = 50, offset = 0, search = '' } = options;
        let query = 'SELECT * FROM categories';
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
        return await db.get('SELECT * FROM categories WHERE id = ?', [id]);
    }

    static async create(categoryData) {
        const { name, description, color } = categoryData;
        const result = await db.run(
            'INSERT INTO categories (name, description, color) VALUES (?, ?, ?)',
            [name, description, color]
        );
        return await this.findById(result.id);
    }

    static async update(id, categoryData) {
        const { name, description, color } = categoryData;
        await db.run(
            'UPDATE categories SET name = ?, description = ?, color = ? WHERE id = ?',
            [name, description, color, id]
        );
        return await this.findById(id);
    }

    static async delete(id) {
        const result = await db.run('DELETE FROM categories WHERE id = ?', [id]);
        return result.changes > 0;
    }

    static async count(search = '') {
        let query = 'SELECT COUNT(*) as total FROM categories';
        let params = [];

        if (search) {
            query += ' WHERE name LIKE ? OR description LIKE ?';
            params.push(`%${search}%`, `%${search}%`);
        }

        const result = await db.get(query, params);
        return result.total;
    }
}

module.exports = Category;