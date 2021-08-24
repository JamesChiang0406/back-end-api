const express = require('express')
const router = express.Router()
const adminController = require('../controllers/adminController')
const { authenticated, authenticatedAdmin } = require('../middleware/auth')

// 管理者登入
router.post('/login', adminController.login)

// 操作使用者資料
router.get('/users', authenticated, authenticatedAdmin, adminController.getUsers)

// 操作推文資料
router.delete('/tweets/:tweet_id', authenticated, authenticatedAdmin, adminController.deleteTweet)

module.exports = router