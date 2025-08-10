const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { validate, validateQuery } = require('../middleware/validation');
const schemas = require('../utils/validation');

// Get all categories
router.get('/', 
    validateQuery(schemas.category.query), 
    categoryController.getAllCategories
);

// Get specific category by ID
router.get('/:id', categoryController.getCategoryById);

// Create new category
router.post('/', 
    validate(schemas.category.create), 
    categoryController.createCategory
);

// Update category
router.put('/:id', 
    validate(schemas.category.update), 
    categoryController.updateCategory
);

// Delete category
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;