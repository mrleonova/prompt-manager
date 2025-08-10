const Category = require('../models/Category');
const logger = require('../utils/logger');

class CategoryController {
    async getAllCategories(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 50;
            const offset = (page - 1) * limit;
            
            const options = {
                limit,
                offset,
                search: req.query.search || ''
            };

            const categories = await Category.findAll(options);
            const total = await Category.count(options.search);
            const totalPages = Math.ceil(total / limit);

            res.json({
                success: true,
                data: {
                    categories,
                    pagination: {
                        current: page,
                        pages: totalPages,
                        total,
                        limit
                    }
                }
            });
        } catch (error) {
            next(error);
        }
    }

    async getCategoryById(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            const category = await Category.findById(id);
            
            if (!category) {
                return res.status(404).json({
                    success: false,
                    error: 'Category not found'
                });
            }

            res.json({
                success: true,
                data: category
            });
        } catch (error) {
            next(error);
        }
    }

    async createCategory(req, res, next) {
        try {
            const categoryData = req.body;
            const category = await Category.create(categoryData);

            logger.info('Category created', { categoryId: category.id, name: category.name });

            res.status(201).json({
                success: true,
                data: category
            });
        } catch (error) {
            if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
                return res.status(409).json({
                    success: false,
                    error: 'Category name already exists'
                });
            }
            next(error);
        }
    }

    async updateCategory(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            const categoryData = req.body;
            
            const category = await Category.update(id, categoryData);
            
            if (!category) {
                return res.status(404).json({
                    success: false,
                    error: 'Category not found'
                });
            }

            logger.info('Category updated', { categoryId: id, name: category.name });

            res.json({
                success: true,
                data: category
            });
        } catch (error) {
            if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
                return res.status(409).json({
                    success: false,
                    error: 'Category name already exists'
                });
            }
            next(error);
        }
    }

    async deleteCategory(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            const deleted = await Category.delete(id);
            
            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    error: 'Category not found'
                });
            }

            logger.info('Category deleted', { categoryId: id });

            res.json({
                success: true,
                message: 'Category deleted successfully'
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new CategoryController();