const express = require('express');
const router = express.Router({ strict: true });
const userCtrl = require('../controllers/userController')
const upload = require('../config/multer')
const handleError = require('../middlewares/multerError')
const auth = require('../middlewares/authJwt')
const checkRole = require('../middlewares/checkRole')

router.post('/add', userCtrl.addUser)
router.post('/login', userCtrl.login)

// router.use(auth)

router.get('/all', userCtrl.getAllUsers)
router.get('/:id', userCtrl.getUser)

router.put('/update_status/:status', checkRole(['admin']), userCtrl.updateStatus)

router.put('/:id', userCtrl.updateUser)

router.delete('/:id', checkRole(['admin']), userCtrl.deleteUser)

module.exports = router;
