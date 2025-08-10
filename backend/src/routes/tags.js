const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tagController');
const { validate, validateQuery } = require('../middleware/validation');
const schemas = require('../utils/validation');

// Get all tags
router.get('/', 
    validateQuery(schemas.tag.query), 
    tagController.getAllTags
);

// Get popular tags
router.get('/popular', tagController.getPopularTags);

// Get specific tag by ID
router.get('/:id', tagController.getTagById);

// Create new tag
router.post('/', 
    validate(schemas.tag.create), 
    tagController.createTag
);

// Update tag
router.put('/:id', 
    validate(schemas.tag.update), 
    tagController.updateTag
);

// Delete tag
router.delete('/:id', tagController.deleteTag);

module.exports = router;