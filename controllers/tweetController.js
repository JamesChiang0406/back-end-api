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
        where: { userId },
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
  }
}

module.exports = tweetController