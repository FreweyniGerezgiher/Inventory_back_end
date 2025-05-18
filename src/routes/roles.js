const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');

router.get('/all', roleController.getAllRoles);
module.exports = router;
