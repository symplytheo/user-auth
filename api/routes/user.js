const express = require('express')
const router = express.Router()
const userController = require('../controllers/user')

router.get('/', userController.getAllUsers)
router.get('/me', userController.getUser)
router.post('/', userController.createUser)
router.post('/login', userController.loginUser)
router.put('/', userController.updateUser)
router.delete('/:id', userController.removeUser)

module.exports = router
