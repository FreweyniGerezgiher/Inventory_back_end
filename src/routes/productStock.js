const express = require('express');
const router = express.Router();
const productStockController = require('../controllers/productStockController');

// Add a new product stock entry
router.post('/add', productStockController.add);

// Get all product stock entries
router.get('/all', productStockController.getAll);

// Get a specific product stock by ID
router.get('/:id', productStockController.getById);

// Update a product stock entry
router.put('/:id', productStockController.update);

// Delete a product stock entry
router.delete('/:id', productStockController.delete);

module.exports = router;
