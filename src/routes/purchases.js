const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');
const auth = require('../middlewares/authJwt')
const checkRole = require('../middlewares/checkRole')

router.use(auth)
router.post('/add', checkRole(['Admin', 'Purchase Officer', 'General Manager']), purchaseController.add);

router.get('/all', purchaseController.getAll);
router.get('/stats', purchaseController.getPurchaseStats);

router.put('/:id', checkRole(['Admin', 'Purchase Officer', 'General Manager']), purchaseController.update);
router.delete('/:id', checkRole(['Admin', 'Purchase Officer', 'General Manager']), purchaseController.delete);

module.exports = router;
