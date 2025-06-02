const express = require('express');
const router = express.Router();
const productStockController = require('../controllers/productStockController');
const auth = require('../middlewares/authJwt')
const checkRole = require('../middlewares/checkRole')

router.use(auth)

router.get('/all', productStockController.getAll);

module.exports = router;
