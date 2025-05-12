const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');

// Add a new sale with items
router.post('/add', salesController.add);

// Get all sales with items
router.get('/all', salesController.getAll);

// Get a single sale by ID
router.get('/:id', salesController.getById);

// Delete a sale
router.delete('/:id', salesController.delete);

module.exports = router;
