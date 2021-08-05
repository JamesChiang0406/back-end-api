const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply
const Like = db.Like

const tweetController = {
  // 查看所有貼文
  getTweets: async (req, res, next) => {
    try {

    } catch (error) {
      console.log(error)
      next(error)
    }
  }
}

module.exports = tweetController