const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply
const Like = db.Like
const helpers = require('../_helpers')

const tweetController = {
  // 查看所有貼文
  getTweets: async (req, res, next) => {
    try {
      const userId = helpers.getUser(req).id
      let tweets = await Tweet.findAll({
        order: [['updatedAt', 'DESC']],
        include: [User, Reply, Like]
      })

      if (tweets.length === 0) {
        return res.status(401).json({ status: 'error', message: '此帳戶並無推文，請重新查詢！' })
      }

      tweets = tweets.map(tweet => {
        const likes = tweet.Likes.map(Like => {
          if (Like.UserId === userId) {
            return true
          }
        })

        return {
          id: tweet.id,
          UserId: tweet.UserId,
          description: tweet.description,
          createdAt: tweet.createdAt,
          updatedAt: tweet.updatedAt,
          likedCount: tweet.Likes.length,
          repliedCount: tweet.Replies.length,
          isLiked: likes ? likes.includes(true) : null,
          user: {
            avatar: tweet.User.avatar,
            name: tweet.User.name,
            account: tweet.User.account
          }
        }
      })

      return res.status(200).json(tweets)
    } catch (error) {
      console.log(error)
      return next(error)
    }
  },

  // 查看單一貼文
  getTweet: async (req, res, next) => {
    try {
      const tweetId = req.params.tweet_id
      const userId = helpers.getUser(req).id
      let tweet = await Tweet.findByPk(tweetId, {
        include: [User, Like, { model: Reply, include: [User] }],
        order: [
          [{ model: Reply }, 'updatedAt', 'DESC']
        ]
      })

      if (tweet === null) {
        return res.status(404).json({ status: 'error', message: '此推文不存在，請重新查詢！' })
      }

      const tweetReplies = tweet.Replies.map(reply => ({
        id: reply.id,
        tweetId: reply.TweetId,
        comment: reply.comment,
        updatedAt: reply.updatedAt,
        User: {
          id: reply.User.id,
          avatar: reply.User.avatar,
          name: reply.User.name,
          account: reply.User.account,
        }
      }))

      const likes = tweet.Likes.map(Like => {
        if (Like.UserId === userId) {
          return true
        }
      })

      tweet = {
        id: tweet.id,
        UserId: tweet.UserId,
        description: tweet.description,
        createdAt: tweet.createdAt,
        updatedAt: tweet.updatedAt,
        likedCount: tweet.Likes.length,
        repliedCount: tweet.Replies.length,
        isLiked: likes ? likes.includes(true) : null,
        user: {
          avatar: tweet.User.avatar,
          name: tweet.User.name,
          account: tweet.User.account
        },
        tweetReplies: tweetReplies
      }

      return res.status(200).json(tweet)
    } catch (error) {
      console.log(error)
      return next(error)
    }
  },

  // 新增貼文
  postTweet: async (req, res, next) => {
    try {
      const { description } = req.body
      const UserId = helpers.getUser(req).id

      if (!description) {
        return res.status(400).json({ status: 'error', message: '輸入框為空，請重新輸入！' })
      } else if (description.length > 140) {
        return res.status(413).json({ status: 'error', message: '字數超出限制，請重新輸入！' })
      }

      await Tweet.create({ UserId, description })
      return res.status(201).json({ status: 'success', message: '新增推文成功！' })
    } catch (error) {
      console.log(error)
      return next(error)
    }
  },

  // 編輯貼文
  putTweet: async (req, res, next) => {
    try {
      const { description } = req.body

      if (!description) {
        return res.status(400).json({ status: 'error', message: '輸入框為空，請重新輸入！' })
      } else if (description.length > 140) {
        return res.status(413).json({ status: 'error', message: '字數超出限制，請重新輸入！' })
      }

      await Tweet.findByPk(req.params.tweet_id)
        .then(tweet => {
          tweet.update({ description })
          return res.status(200).json({ status: 'success', message: '推文編輯成功！' })
        })
    } catch (error) {
      console.log(error)
      return next(error)
    }
  },

  // 刪除貼文
  deleteTweet: async (req, res, next) => {
    try {
      let tweet = await Tweet.findByPk(req.params.tweet_id)

      if (tweet === null) {
        return res.status(404).json({ status: 'error', message: '推文不存在，請重新確認！' })
      } else {
        tweet.destroy()
        return res.status(201).json({ status: 'success', message: '推文刪除成功！' })
      }
    } catch (error) {
      console.log(error)
      return next(error)
    }
  },

  // 貼文按讚
  tweetLike: async (req, res, next) => {
    try {
      const tweet = await Tweet.findByPk(req.params.tweet_id)

      if (tweet === null) {
        return res.status(404).json({ status: 'error', message: '此推文不存在，請重新確認！' })
      } else {
        await Like.create({
          UserId: helpers.getUser(req).id,
          TweetId: tweet.id
        })

        return res.status(201).json({ status: 'success', message: '按讚成功！' })
      }
    } catch (error) {
      console.log(error)
      return next(error)
    }
  },

  tweetUnlike: async (req, res, next) => {
    try {
      let like = await Like.findOne({
        where: {
          UserId: helpers.getUser(req).id,
          TweetId: req.params.tweet_id
        }
      })

      if (like === null) {
        return res.status(404).json({ status: 'error', message: '無效的動作，請重新確認！' })
      } else {
        await like.destroy()
        return res.status(201).json({ status: 'success', message: '刪除成功！' })
      }

    } catch (error) {
      console.log(error)
      return next(error)
    }
  },

  getReplies: async (req, res, next) => {
    try {
      let userId = req.params.user_id
      let replies = await Reply.findAll({
        where: { UserId: userId },
        order: [['updatedAt', 'DESC']],
        include: [
          User,
          { model: Tweet, include: [User] }
        ]
      })

      if (replies.length === 0) {
        return res.status(401).json({ status: 'error', message: '無相關資料，請重新確認！' })
      }

      replies = replies.map(reply => {
        return {
          id: reply.id,
          UserId: reply.UserId,
          description: reply.comment,
          createdAt: reply.createdAt,
          updatedAt: reply.updatedAt,
          user: {
            account: reply.User.account,
            name: reply.User.name,
            avatar: reply.User.avatar
          },
          repliedUserAccount: reply.Tweet.User.account,
          repliedUserId: reply.Tweet.User.id
        }
      })

      return res.status(200).json(replies)
    } catch (error) {
      console.log(error)
      return next(error)
    }
  }
}

module.exports = tweetController