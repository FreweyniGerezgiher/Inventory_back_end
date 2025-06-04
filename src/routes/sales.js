const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');
const auth = require('../middlewares/authJwt')
const checkRole = require('../middlewares/checkRole')

router.use(auth)
router.post('/add', checkRole(['Admin', 'Sales Officer', 'General Manager']),  salesController.add);

router.get('/all', salesController.getAll);
router.get('/stats', salesController.getSalesStats);
router.put('/:id', checkRole(['Admin', 'Sales Officer', 'General Manager']), salesController.update);
router.delete('/:id', checkRole(['Admin', 'Sales Officer', 'General Manager']), salesController.delete);

module.exports = router;
