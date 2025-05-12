const express = require('express');
const router = express.Router();
const productCategoryController = require('../controllers/productCatController');

// Create a new category
router.post('/add', productCategoryController.add);

// Get all categories
router.get('/all', productCategoryController.getAll);

// Get category by ID
router.get('/:id', productCategoryController.getById);

// Update a category
router.put('/:id', productCategoryController.update);

// Delete a category
router.delete('/:id', productCategoryController.delete);

module.exports = router;
