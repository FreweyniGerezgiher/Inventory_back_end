const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Create product
router.post('/add', productController.add);

// Get all products
router.get('/all', productController.getAll);

// Get product by ID
router.get('/:id', productController.getById);

// Update product
router.put('/:id', productController.update);

// Delete product
router.delete('/:id', productController.delete);

module.exports = router;
