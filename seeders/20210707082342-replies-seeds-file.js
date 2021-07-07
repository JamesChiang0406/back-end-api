'use strict';
const faker = require('faker')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await User.findAll({ raw: true, nest: true })
    const tweets = await Tweet.findAll({ raw: true, nest: true })

    await queryInterface.bulkInsert('Replies',
      Array.from({ length: 50 }).map((d, i) => (
        {
          UserId: users[Math.floor(Math.random() * 3)].id,
          TweetId: tweets[Math.floor(i * 0.6)].id,
          comment: faker.lorem.sentences(),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ))
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {})
  }
};
