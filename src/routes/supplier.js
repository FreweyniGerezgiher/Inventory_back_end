const express = require('express');
const router = express.Router();
const suppliersController = require('../controllers/supplierController');

router.post('/add', suppliersController.addSupplier);
router.get('/all', suppliersController.getAllSuppliers);
router.get('/:id', suppliersController.getSupplier);
router.put('/:id', suppliersController.updateSupplier);
router.delete('/:id', suppliersController.deleteSupplier);

module.exports = router;
