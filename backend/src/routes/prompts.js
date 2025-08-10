const express = require('express');
const router = express.Router();
const promptController = require('../controllers/promptController');
const { validate, validateQuery } = require('../middleware/validation');
const schemas = require('../utils/validation');

// Get all prompts with pagination and filtering
router.get('/', 
    validateQuery(schemas.prompt.query), 
    promptController.getAllPrompts
);

// Get specific prompt by ID
router.get('/:id', promptController.getPromptById);

// Get prompt versions
router.get('/:id/versions', promptController.getPromptVersions);

// Get specific version of a prompt
router.get('/:id/versions/:version', promptController.getPromptVersion);

// Create new prompt
router.post('/', 
    validate(schemas.prompt.create), 
    promptController.createPrompt
);

// Update prompt
router.put('/:id', 
    validate(schemas.prompt.update), 
    promptController.updatePrompt
);

// Delete prompt
router.delete('/:id', promptController.deletePrompt);

// Batch operations
router.post('/batch/delete', promptController.batchDelete);

// Export prompts
router.get('/export/json', promptController.exportPrompts);

module.exports = router;