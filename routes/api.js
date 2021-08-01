const express = require('express')
const router = express.Router()

const userController = require('../controllers/userController')
const followshipController = require('../controllers/followshipController')
const tweetController = require('../controllers/tweetController')

// 登入 & 註冊
router.post('/login', userController.login)
router.post('/regist', userController.register)

// 操作使用者資料
router.get('/users/:id', userController.getUser)
router.put('/users/:id', userController.putUser)

module.exports = router