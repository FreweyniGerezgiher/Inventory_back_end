const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');

// Add a new location
router.post('/add', locationController.Add);

// Get all locations
router.get('/all', locationController.getAll);

// Get a location by ID
router.get('/:id', locationController.getLocation);

// Update a location
router.put('/:id', locationController.update);

// Delete a location
router.delete('/:id', locationController.delete);

module.exports = router;
