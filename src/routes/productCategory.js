const express = require('express');
const router = express.Router();
const productCategoryController = require('../controllers/productCatController');

router.post('/add', productCategoryController.add);

router.get('/all', productCategoryController.getAll);

router.get('/:id', productCategoryController.getById);

router.put('/:id', productCategoryController.update);

router.delete('/:id', productCategoryController.delete);

module.exports = router;
