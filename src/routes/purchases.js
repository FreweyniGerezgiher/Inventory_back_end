const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');

router.post('/add', purchaseController.add);

router.get('/all', purchaseController.getAll);

router.get('/:id', purchaseController.getById);
router.put('/:id', purchaseController.update);
router.delete('/:id', purchaseController.delete);

module.exports = router;
