const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

const auth = require('../middlewares/authJwt')
const checkRole = require('../middlewares/checkRole')

router.use(auth)
router.post('/add', checkRole(['Admin']), productController.add);

router.get('/all', productController.getAll);

router.get('/outofstock', productController.getOutOfStock);
router.put('/:id', checkRole(['Admin']), productController.update);

router.delete('/:id', checkRole(['Admin']), productController.delete);

module.exports = router;
