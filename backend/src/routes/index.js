const express = require('express');
const router = express.Router();

// Import route modules
const promptRoutes = require('./prompts');
const categoryRoutes = require('./categories');
const tagRoutes = require('./tags');

// Use route modules
router.use('/prompts', promptRoutes);
router.use('/categories', categoryRoutes);
router.use('/tags', tagRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'API is healthy',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;