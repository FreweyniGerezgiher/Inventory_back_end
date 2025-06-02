const express = require('express');
const router = express.Router();
const productCategoryController = require('../controllers/productCatController');
const auth = require('../middlewares/authJwt')
const checkRole = require('../middlewares/checkRole')

router.use(auth)
router.post('/add', checkRole(['Admin']), productCategoryController.add);

router.get('/all', checkRole(['Admin']), productCategoryController.getAll);

router.get('/:id', checkRole(['Admin']), productCategoryController.getById);

router.put('/:id', checkRole(['Admin']), productCategoryController.update);

router.delete('/:id', checkRole(['Admin']), productCategoryController.delete);

module.exports = router;
