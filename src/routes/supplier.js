const express = require('express');
const router = express.Router();
const suppliersController = require('../controllers/supplierController');
const auth = require('../middlewares/authJwt')
const checkRole = require('../middlewares/checkRole')

router.use(auth)
router.post('/add', checkRole(['Admin']), suppliersController.addSupplier);
router.get('/all', suppliersController.getAllSuppliers);
router.get('/:id', checkRole(['Admin']), suppliersController.getSupplier);
router.put('/:id', checkRole(['Admin']), suppliersController.updateSupplier);
router.delete('/:id', checkRole(['Admin']), suppliersController.deleteSupplier);

module.exports = router;
