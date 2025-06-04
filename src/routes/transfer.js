const express = require('express');
const router = express.Router();
const transferController = require('../controllers/transferController');
const auth = require('../middlewares/authJwt')
const checkRole = require('../middlewares/checkRole')

router.use(auth)
router.post('/add', checkRole(['Admin', 'General Manager']), transferController.add);
router.get('/all', transferController.getAll);
router.put('/:id', checkRole(['Admin', 'General Manager']), transferController.update);
router.delete('/:id', checkRole(['Admin', 'General Manager']), transferController.delete);

module.exports = router;
