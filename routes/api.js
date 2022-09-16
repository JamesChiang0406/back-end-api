const express = require('express')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const router = express.Router()
const userController = require('../controllers/userController')
const followshipController = require('../controllers/followshipController')
const tweetController = require('../controllers/tweetController')
const chatController = require('../controllers/chatController')
const { authenticated } = require('../middleware/auth')

// 登入 & 註冊
router.post('/login', userController.login)
router.post('/regist', userController.register)

// 操作使用者資料
router.get('/users/current_user', authenticated, userController.getCurrentUser)
router.get('/users/:user_id', authenticated, userController.getUser)
router.put('/users/image/cover', authenticated, upload.single('image'), userController.putCoverImg)
router.put('/users/image/avatar', authenticated, upload.single('image'), userController.putAvatarImg)
router.put('/users/:user_id', authenticated, userController.putUser)

// 操作貼文資料
router.get('/tweets', authenticated, tweetController.getTweets)
router.get('/tweets/replies/:user_id', authenticated, tweetController.getReplies)
router.post('/tweets/reply', authenticated, tweetController.postReply)
router.delete('/tweets/reply/:reply_id', authenticated, tweetController.deleteReply)
router.get('/tweets/others/:user_id', authenticated, tweetController.getUserTweets)
router.get('/tweets/:tweet_id', authenticated, tweetController.getTweet)
router.post('/tweets/', authenticated, tweetController.postTweet)
router.put('/tweets/:tweet_id', authenticated, tweetController.putTweet)
router.delete('/tweets/:tweet_id', authenticated, tweetController.deleteTweet)
router.post('/tweets/:tweet_id/like', authenticated, tweetController.tweetLike)
router.delete('/tweets/:tweet_id/like', authenticated, tweetController.tweetUnlike)

// 操作跟隨者資料
router.get('/recommends', authenticated, followshipController.getRecommendList)
router.post('/followships', authenticated, followshipController.addFollowing)
router.delete('/followships/:id', authenticated, followshipController.removeFollowing)
router.get('/followers/:user_id', authenticated, followshipController.getFollowers)
router.get('/followings/:user_id', authenticated, followshipController.getFollowings)

// 操作聊天室資料
router.get('/chatroom/:chatter_id', authenticated, chatController.getChats)
router.post('/chatroom/:chatter_id', authenticated, chatController.postChat)


module.exports = router