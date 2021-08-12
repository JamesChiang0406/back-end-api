const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const followshipController = require('../controllers/followshipController')
const tweetController = require('../controllers/tweetController')
const { authenticated } = require('../middleware/auth')

// 登入 & 註冊
router.post('/login', userController.login)
router.post('/regist', userController.register)

// 操作使用者資料
router.get('/users/:user_id', authenticated, userController.getUser)
router.put('/users/:user_id', authenticated, userController.putUser)

// 操作貼文資料
router.get('/tweets', authenticated, tweetController.getTweets)
router.get('/tweets/:tweet_id', authenticated, tweetController.getTweet)
router.post('/tweets/', authenticated, tweetController.postTweet)

module.exports = router