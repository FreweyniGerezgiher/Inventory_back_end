const express = require('express');
const router = express.Router();
const transferController = require('../controllers/transferController');
const auth = require('../middlewares/authJwt')
const checkRole = require('../middlewares/checkRole')

router.use(auth)
router.post('/add', checkRole(['Admin']), transferController.add);
router.get('/all', checkRole(['Admin']), transferController.getAll);
router.put('/:id', checkRole(['Admin']), transferController.update);
router.delete('/:id', checkRole(['Admin']), transferController.delete);

module.exports = router;
