const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');

router.post('/add', locationController.Add);

router.get('/all', locationController.getAll);

router.get('/:id', locationController.getLocation);

router.put('/:id', locationController.update);

router.delete('/:id', locationController.delete);

module.exports = router;
