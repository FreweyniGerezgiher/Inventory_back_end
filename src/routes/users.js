const express = require('express');
const router = express.Router({ strict: true });
const userCtrl = require('../controllers/userController')
const auth = require('../middlewares/authJwt')
const checkRole = require('../middlewares/checkRole')

router.post('/login', userCtrl.login)

router.use(auth)

router.post('/add', checkRole(['Admin']), userCtrl.addUser)
router.get('/all', checkRole(['Admin']), userCtrl.getAllUsers)
router.get('/:id', checkRole(['Admin']), userCtrl.getUser)

router.put('/update_status/:status', checkRole(['Admin']), userCtrl.updateStatus)

router.put('/:id', checkRole(['Admin']), userCtrl.updateUser)

router.delete('/:id', checkRole(['Admin']), userCtrl.deleteUser)

module.exports = router;
