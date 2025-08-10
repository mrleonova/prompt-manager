const logger = require('../utils/logger');

const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            const errorMessage = error.details.map(detail => detail.message).join(', ');
            logger.warn(`Validation error: ${errorMessage}`, { 
                body: req.body, 
                path: req.path 
            });
            return res.status(400).json({
                success: false,
                error: 'Validation error',
                details: errorMessage
            });
        }
        next();
    };
};

const validateQuery = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.query);
        if (error) {
            const errorMessage = error.details.map(detail => detail.message).join(', ');
            logger.warn(`Query validation error: ${errorMessage}`, { 
                query: req.query, 
                path: req.path 
            });
            return res.status(400).json({
                success: false,
                error: 'Query validation error',
                details: errorMessage
            });
        }
        next();
    };
};

module.exports = {
    validate,
    validateQuery
};