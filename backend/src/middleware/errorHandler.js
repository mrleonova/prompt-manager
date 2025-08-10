const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
    logger.error('Unhandled error:', {
        error: err.message,
        stack: err.stack,
        method: req.method,
        url: req.url,
        body: req.body,
        query: req.query
    });

    // Default error response
    let status = 500;
    let message = 'Internal server error';

    // Handle specific error types
    if (err.name === 'ValidationError') {
        status = 400;
        message = err.message;
    } else if (err.name === 'CastError') {
        status = 400;
        message = 'Invalid ID format';
    } else if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        status = 409;
        message = 'Resource already exists';
    } else if (err.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
        status = 400;
        message = 'Invalid reference to related resource';
    }

    res.status(status).json({
        success: false,
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

const notFound = (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Resource not found'
    });
};

module.exports = {
    errorHandler,
    notFound
};