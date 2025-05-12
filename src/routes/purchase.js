const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');

// Add a new purchase with items
router.post('/add', purchaseController.add);

// Get all purchases with items
router.get('/all', purchaseController.getAll);

// Get a purchase by ID
router.get('/:id', purchaseController.getById);

// Delete a purchase
router.delete('/:id', purchaseController.delete);

module.exports = router;
