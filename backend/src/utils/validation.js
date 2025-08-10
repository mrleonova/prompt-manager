const Joi = require('joi');

const schemas = {
    prompt: {
        create: Joi.object({
            title: Joi.string().min(1).max(255).required(),
            content: Joi.string().min(1).required(),
            description: Joi.string().max(1000).optional().allow(''),
            categoryId: Joi.number().integer().positive().optional().allow(null),
            tags: Joi.array().items(Joi.string().trim().min(1).max(50)).optional(),
            isTemplate: Joi.boolean().optional(),
            isFavorite: Joi.boolean().optional(),
            variables: Joi.array().items(Joi.object({
                name: Joi.string().min(1).max(255).required(),
                description: Joi.string().max(500).optional().allow(''),
                defaultValue: Joi.string().optional().allow(''),
                variableType: Joi.string().valid('text', 'number', 'boolean', 'select').optional(),
                options: Joi.array().items(Joi.string()).optional(),
                required: Joi.boolean().optional()
            })).optional()
        }),
        update: Joi.object({
            title: Joi.string().min(1).max(255).optional(),
            content: Joi.string().min(1).optional(),
            description: Joi.string().max(1000).optional().allow(''),
            categoryId: Joi.number().integer().positive().optional().allow(null),
            tags: Joi.array().items(Joi.string().trim().min(1).max(50)).optional(),
            isTemplate: Joi.boolean().optional(),
            isFavorite: Joi.boolean().optional(),
            variables: Joi.array().items(Joi.object({
                name: Joi.string().min(1).max(255).required(),
                description: Joi.string().max(500).optional().allow(''),
                defaultValue: Joi.string().optional().allow(''),
                variableType: Joi.string().valid('text', 'number', 'boolean', 'select').optional(),
                options: Joi.array().items(Joi.string()).optional(),
                required: Joi.boolean().optional()
            })).optional(),
            changeLog: Joi.string().max(500).optional().allow('')
        }),
        query: Joi.object({
            page: Joi.number().integer().min(1).optional(),
            limit: Joi.number().integer().min(1).max(100).optional(),
            search: Joi.string().max(255).optional().allow(''),
            categoryId: Joi.number().integer().positive().optional(),
            tags: Joi.alternatives().try(
                Joi.string(),
                Joi.array().items(Joi.string())
            ).optional(),
            isTemplate: Joi.boolean().optional(),
            isFavorite: Joi.boolean().optional(),
            sortBy: Joi.string().valid('title', 'created_at', 'updated_at', 'usage_count').optional(),
            sortOrder: Joi.string().valid('ASC', 'DESC').optional()
        })
    },
    category: {
        create: Joi.object({
            name: Joi.string().min(1).max(255).required(),
            description: Joi.string().max(1000).optional().allow(''),
            color: Joi.string().pattern(/^#([0-9A-F]{3}){1,2}$/i).optional()
        }),
        update: Joi.object({
            name: Joi.string().min(1).max(255).optional(),
            description: Joi.string().max(1000).optional().allow(''),
            color: Joi.string().pattern(/^#([0-9A-F]{3}){1,2}$/i).optional()
        }),
        query: Joi.object({
            page: Joi.number().integer().min(1).optional(),
            limit: Joi.number().integer().min(1).max(100).optional(),
            search: Joi.string().max(255).optional().allow('')
        })
    },
    tag: {
        create: Joi.object({
            name: Joi.string().min(1).max(255).required(),
            description: Joi.string().max(1000).optional().allow('')
        }),
        update: Joi.object({
            name: Joi.string().min(1).max(255).optional(),
            description: Joi.string().max(1000).optional().allow('')
        }),
        query: Joi.object({
            page: Joi.number().integer().min(1).optional(),
            limit: Joi.number().integer().min(1).max(100).optional(),
            search: Joi.string().max(255).optional().allow('')
        })
    }
};

module.exports = schemas;