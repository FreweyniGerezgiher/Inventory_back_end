const express = require('express');
const router = express.Router();
const productStockController = require('../controllers/productStockController');

router.post('/add', productStockController.add);

router.get('/all', productStockController.getAll);

router.get('/:id', productStockController.getById);

router.put('/:id', productStockController.update);

router.delete('/:id', productStockController.delete);

module.exports = router;
