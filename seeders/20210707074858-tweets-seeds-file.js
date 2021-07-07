'use strict';
const faker = require('faker')
const db = require('../models')
const User = db.User

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await User.findAll({ raw: true, nest: true })

    await queryInterface.bulkInsert('Tweets',
      Array.from({ length: 30 }).map((d, i) =>
      ({
        UserId: users[Math.floor(i * 0.1)].id,
        description: faker.lorem.paragraph(),
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
  }
};
