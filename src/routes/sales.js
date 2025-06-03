const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');
const auth = require('../middlewares/authJwt')

router.use(auth)
router.post('/add', salesController.add);

router.get('/all', salesController.getAll);
router.get('/stats', salesController.getSalesStats);
router.put('/:id', salesController.update);
router.delete('/:id', salesController.delete);

module.exports = router;
