const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const config = require('./config');
const logger = require('./utils/logger');
const db = require('./database/connection');
const routes = require('./routes');
const { errorHandler, notFound } = require('./middleware/errorHandler');

class Server {
    constructor() {
        this.app = express();
        this.port = config.port;
    }

    async initialize() {
        await this.connectDatabase();
        this.setupMiddleware();
        this.setupRoutes();
        this.setupErrorHandling();
    }

    async connectDatabase() {
        try {
            await db.initialize();
            logger.info('Database connected successfully');
        } catch (error) {
            logger.error('Database connection failed:', error);
            process.exit(1);
        }
    }

    setupMiddleware() {
        // Security middleware
        this.app.use(helmet());
        
        // Rate limiting
        const limiter = rateLimit({
            windowMs: config.rateLimit.windowMs,
            max: config.rateLimit.max,
            message: {
                success: false,
                error: 'Too many requests from this IP, please try again later.'
            }
        });
        this.app.use('/api', limiter);

        // CORS
        this.app.use(cors({
            origin: config.corsOrigin,
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization']
        }));

        // Logging
        this.app.use(morgan('combined', { 
            stream: { write: message => logger.info(message.trim()) }
        }));

        // Body parsing
        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.urlencoded({ extended: true }));
    }

    setupRoutes() {
        // API routes
        this.app.use('/api', routes);

        // Root endpoint
        this.app.get('/', (req, res) => {
            res.json({
                success: true,
                message: 'Prompt Manager API',
                version: '1.0.0',
                endpoints: {
                    prompts: '/api/prompts',
                    categories: '/api/categories',
                    tags: '/api/tags',
                    health: '/api/health'
                }
            });
        });
    }

    setupErrorHandling() {
        // 404 handler
        this.app.use('*', notFound);

        // Global error handler
        this.app.use(errorHandler);
    }

    async start() {
        try {
            await this.initialize();
            
            this.server = this.app.listen(this.port, () => {
                logger.info(`Server started on port ${this.port}`);
                console.log(`🚀 Server running on http://localhost:${this.port}`);
                console.log(`📚 API documentation available at http://localhost:${this.port}/api`);
            });

            // Graceful shutdown
            process.on('SIGTERM', () => this.shutdown('SIGTERM'));
            process.on('SIGINT', () => this.shutdown('SIGINT'));

        } catch (error) {
            logger.error('Failed to start server:', error);
            process.exit(1);
        }
    }

    async shutdown(signal) {
        logger.info(`Received ${signal}. Shutting down gracefully...`);
        
        if (this.server) {
            this.server.close(async () => {
                logger.info('HTTP server closed');
                
                try {
                    await db.close();
                    logger.info('Database connection closed');
                } catch (error) {
                    logger.error('Error closing database:', error);
                }
                
                process.exit(0);
            });
        }
    }
}

// Start server if this file is run directly
if (require.main === module) {
    const server = new Server();
    server.start();
}

module.exports = Server;