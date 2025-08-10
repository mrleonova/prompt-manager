const Prompt = require('../models/Prompt');
const logger = require('../utils/logger');

class PromptController {
    async getAllPrompts(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;
            const offset = (page - 1) * limit;
            
            // Parse tags from query string
            let tags = [];
            if (req.query.tags) {
                if (Array.isArray(req.query.tags)) {
                    tags = req.query.tags;
                } else {
                    tags = req.query.tags.split(',').map(tag => tag.trim());
                }
            }

            const options = {
                limit,
                offset,
                search: req.query.search || '',
                categoryId: req.query.categoryId ? parseInt(req.query.categoryId) : undefined,
                tags,
                isTemplate: req.query.isTemplate !== undefined ? req.query.isTemplate === 'true' : undefined,
                isFavorite: req.query.isFavorite !== undefined ? req.query.isFavorite === 'true' : undefined,
                sortBy: req.query.sortBy || 'updated_at',
                sortOrder: req.query.sortOrder || 'DESC'
            };

            const prompts = await Prompt.findAll(options);
            const total = await Prompt.count(options);
            const totalPages = Math.ceil(total / limit);

            res.json({
                success: true,
                data: {
                    prompts,
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

    async getPromptById(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            const prompt = await Prompt.findById(id);
            
            if (!prompt) {
                return res.status(404).json({
                    success: false,
                    error: 'Prompt not found'
                });
            }

            // Increment usage count
            await Prompt.incrementUsageCount(id);

            res.json({
                success: true,
                data: prompt
            });
        } catch (error) {
            next(error);
        }
    }

    async createPrompt(req, res, next) {
        try {
            const promptData = req.body;
            const prompt = await Prompt.create(promptData);

            logger.info('Prompt created', { promptId: prompt.id, title: prompt.title });

            res.status(201).json({
                success: true,
                data: prompt
            });
        } catch (error) {
            next(error);
        }
    }

    async updatePrompt(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            const promptData = req.body;
            
            const prompt = await Prompt.update(id, promptData);
            
            if (!prompt) {
                return res.status(404).json({
                    success: false,
                    error: 'Prompt not found'
                });
            }

            logger.info('Prompt updated', { promptId: id, title: prompt.title });

            res.json({
                success: true,
                data: prompt
            });
        } catch (error) {
            next(error);
        }
    }

    async deletePrompt(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            const deleted = await Prompt.delete(id);
            
            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    error: 'Prompt not found'
                });
            }

            logger.info('Prompt deleted', { promptId: id });

            res.json({
                success: true,
                message: 'Prompt deleted successfully'
            });
        } catch (error) {
            next(error);
        }
    }

    async getPromptVersions(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            const versions = await Prompt.getVersions(id);
            
            res.json({
                success: true,
                data: versions
            });
        } catch (error) {
            next(error);
        }
    }

    async getPromptVersion(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            const version = parseInt(req.params.version);
            const versionData = await Prompt.getVersion(id, version);
            
            if (!versionData) {
                return res.status(404).json({
                    success: false,
                    error: 'Version not found'
                });
            }

            res.json({
                success: true,
                data: versionData
            });
        } catch (error) {
            next(error);
        }
    }

    async batchDelete(req, res, next) {
        try {
            const { ids } = req.body;
            
            if (!Array.isArray(ids) || ids.length === 0) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid or empty IDs array'
                });
            }

            let deletedCount = 0;
            for (const id of ids) {
                const deleted = await Prompt.delete(parseInt(id));
                if (deleted) deletedCount++;
            }

            logger.info('Batch delete completed', { requestedCount: ids.length, deletedCount });

            res.json({
                success: true,
                data: {
                    requested: ids.length,
                    deleted: deletedCount
                }
            });
        } catch (error) {
            next(error);
        }
    }

    async exportPrompts(req, res, next) {
        try {
            const options = {
                categoryId: req.query.categoryId ? parseInt(req.query.categoryId) : undefined,
                tags: req.query.tags ? req.query.tags.split(',').map(tag => tag.trim()) : [],
                isTemplate: req.query.isTemplate !== undefined ? req.query.isTemplate === 'true' : undefined
            };

            const prompts = await Prompt.findAll({ ...options, limit: 1000 }); // Export up to 1000 prompts
            
            const exportData = {
                exportDate: new Date().toISOString(),
                version: '1.0',
                prompts: prompts.map(prompt => ({
                    title: prompt.title,
                    content: prompt.content,
                    description: prompt.description,
                    category: prompt.category_name,
                    tags: prompt.tags.map(tag => tag.name),
                    isTemplate: prompt.is_template,
                    variables: prompt.variables,
                    createdAt: prompt.created_at,
                    updatedAt: prompt.updated_at
                }))
            };

            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Content-Disposition', 'attachment; filename=prompts-export.json');
            res.json(exportData);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new PromptController();