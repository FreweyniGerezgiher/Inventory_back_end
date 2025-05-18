const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');

router.post('/add', salesController.add);

router.get('/all', salesController.getAll);

router.get('/:id', salesController.getById);

router.delete('/:id', salesController.delete);

module.exports = router;
