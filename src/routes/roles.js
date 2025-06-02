const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const auth = require('../middlewares/authJwt')
const checkRole = require('../middlewares/checkRole')

router.use(auth)
router.get('/all', checkRole(['Admin']), roleController.getAllRoles);
module.exports = router;
