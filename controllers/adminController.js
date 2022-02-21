const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Like = db.Like
const Reply = db.Reply
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { sequelize } = require('../models')

const adminController = {
  login: async (req, res, next) => {
    try {
      const { account, password } = req.body
      const user = await User.findOne({ where: { account } })

      // 錯誤處理
      if (!account || !password) {
        return res.status(400).json({ status: 'error', message: '欄位為空，請重新登入！' })
      }
      if (!user) {
        return res.status(401).json({ status: 'error', message: '使用者不存在，請重新登入！' })
      }
      if (user.role !== 'admin') {
        return res.status(403).json({ status: 'error', message: '未授權的動作，請重新登入！' })
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ status: 'error', message: '密碼錯誤，請重新確認！' })
      }

      const payload = { id: user.id }
      const token = jwt.sign(payload, process.env.JWT_SECRET)
      return res.status(200).json({
        status: 'success',
        message: '登入成功！',
        token: token,
        user: {
          id: user.id,
          account: user.account,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          cover: user.cover,
          introduction: user.introduction,
          role: user.role
        }
      })
    } catch (error) {
      console.log(error)
      return next(error)
    }
  },

  getUsers: async (req, res, next) => {
    try {
      let users = await User.findAll({
        where: { role: 'user' },
        include: [
          { model: Tweet, include: [Like] },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ],
        attributes: {
          include: [
            [
              sequelize.literal('(SELECT COUNT(*) FROM Tweets WHERE Tweets.UserId = User.id)'), 'tweetCount'
            ]
          ]
        },
        order: [
          [
            sequelize.literal('tweetCount'), 'DESC'
          ]
        ]
      })

      if (!users.length) {
        return res.status(200).json({ status: 'success', message: '無使用者資料，請重新確認！' })
      }

      users = users.map(user => {
        let tweetLikedCount = 0
        user.Tweets.forEach(tweet => {
          tweetLikedCount += tweet.Likes.length
        })

        return {
          id: user.id,
          account: user.account,
          name: user.name,
          avatar: user.avatar,
          cover: user.cover,
          tweetNumbers: user.Tweets.length,
          likeNumbers: tweetLikedCount,
          followingNumbers: user.Followings.length,
          followerNumbers: user.Followers.length,
        }
      })

      return res.status(200).json(users)
    } catch (error) {
      console.log(error)
      return next(error)
    }
  },

  deleteTweet: async (req, res, next) => {
    try {
      const tweetId = req.params.tweet_id
      const tweet = await Tweet.findByPk(tweetId)
      const replies = await Reply.findAll({ where: { TweetId: tweetId } })

      if (!tweet) {
        return res.status(401).json({ status: 'error', message: '推文不存在，請重新確認！' })
      }

      await replies.forEach(reply => {
        reply.destroy()
      })
      await tweet.destroy()
      return res.status(200).json({ status: 'success', message: '刪除成功！' })
    } catch (error) {
      console.log(error)
      return next(error)
    }
  }
}

module.exports = adminController