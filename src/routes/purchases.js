const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');
const auth = require('../middlewares/authJwt')
const checkRole = require('../middlewares/checkRole')

router.use(auth)
router.post('/add', checkRole(['Admin']), purchaseController.add);

router.get('/all', checkRole(['Admin']), purchaseController.getAll);

router.get('/:id', checkRole(['Admin']), purchaseController.getById);
router.put('/:id', checkRole(['Admin']), purchaseController.update);
router.delete('/:id', checkRole(['Admin']), purchaseController.delete);

module.exports = router;
