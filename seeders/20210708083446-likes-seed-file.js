'use strict';
const db = require('../models')
const User = db.User
const Tweet = db.Tweet

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await User.findAll({ raw: true, nest: true })
    const tweets = await Tweet.findAll({ raw: true, nest: true })

    queryInterface.bulkInsert('Likes',
      Array.from({ length: 50 }).map((d, i) => (
        {
          UserId: users[Math.floor(Math.random() * 3)].id,
          TweetId: tweets[Math.floor(Math.random() * tweets.length)].id,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ))
    )
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.bulkDelete('Likes', null, {})
  }
};
