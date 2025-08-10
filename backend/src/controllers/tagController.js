const Tag = require('../models/Tag');
const logger = require('../utils/logger');

class TagController {
    async getAllTags(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 100;
            const offset = (page - 1) * limit;
            
            const options = {
                limit,
                offset,
                search: req.query.search || ''
            };

            const tags = await Tag.findAll(options);

            res.json({
                success: true,
                data: tags
            });
        } catch (error) {
            next(error);
        }
    }

    async getPopularTags(req, res, next) {
        try {
            const limit = parseInt(req.query.limit) || 20;
            const tags = await Tag.getPopularTags(limit);

            res.json({
                success: true,
                data: tags
            });
        } catch (error) {
            next(error);
        }
    }

    async getTagById(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            const tag = await Tag.findById(id);
            
            if (!tag) {
                return res.status(404).json({
                    success: false,
                    error: 'Tag not found'
                });
            }

            res.json({
                success: true,
                data: tag
            });
        } catch (error) {
            next(error);
        }
    }

    async createTag(req, res, next) {
        try {
            const tagData = req.body;
            const tag = await Tag.create(tagData);

            logger.info('Tag created', { tagId: tag.id, name: tag.name });

            res.status(201).json({
                success: true,
                data: tag
            });
        } catch (error) {
            if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
                return res.status(409).json({
                    success: false,
                    error: 'Tag name already exists'
                });
            }
            next(error);
        }
    }

    async updateTag(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            const tagData = req.body;
            
            const tag = await Tag.update(id, tagData);
            
            if (!tag) {
                return res.status(404).json({
                    success: false,
                    error: 'Tag not found'
                });
            }

            logger.info('Tag updated', { tagId: id, name: tag.name });

            res.json({
                success: true,
                data: tag
            });
        } catch (error) {
            if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
                return res.status(409).json({
                    success: false,
                    error: 'Tag name already exists'
                });
            }
            next(error);
        }
    }

    async deleteTag(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            const deleted = await Tag.delete(id);
            
            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    error: 'Tag not found'
                });
            }

            logger.info('Tag deleted', { tagId: id });

            res.json({
                success: true,
                message: 'Tag deleted successfully'
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new TagController();