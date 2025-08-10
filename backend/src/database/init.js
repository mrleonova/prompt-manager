const db = require('./connection');

async function initializeDatabase() {
    try {
        await db.initialize();
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Database initialization failed:', error);
        process.exit(1);
    }
}

// Run initialization if this file is called directly
if (require.main === module) {
    initializeDatabase();
}

module.exports = { initializeDatabase };