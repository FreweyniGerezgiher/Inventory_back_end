const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const auth = require('../middlewares/authJwt')
const checkRole = require('../middlewares/checkRole')

router.use(auth)
router.post('/add', checkRole(['Admin']), locationController.Add);

router.get('/all', checkRole(['Admin']), locationController.getAll);

router.get('/:id', checkRole(['Admin']), locationController.getLocation);

router.put('/:id', checkRole(['Admin']), locationController.update);

router.delete('/:id', checkRole(['Admin']), locationController.delete);

module.exports = router;
