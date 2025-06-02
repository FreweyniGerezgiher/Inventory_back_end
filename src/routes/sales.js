const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');
const auth = require('../middlewares/authJwt')
const checkRole = require('../middlewares/checkRole')

router.use(auth)
router.post('/add', checkRole(['Admin']), salesController.add);

router.get('/all', checkRole(['Admin']), salesController.getAll);

router.get('/:id', checkRole(['Admin']), salesController.getById);
router.put('/:id', checkRole(['Admin']), salesController.update);
router.delete('/:id', checkRole(['Admin']), salesController.delete);

module.exports = router;
