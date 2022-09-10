'use strict';
const faker = require('faker')
const db = require('../models')
const User = db.User

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await User.findAll({ raw: true, nest: true })

    await queryInterface.bulkInsert('Chats',
      Array.from({ length: 30 }).map((d, i) => ({
        userId: users[Math.floor(i * 0.1)].id,
        chatDetail: faker.lorem.sentence(),
        chattingTo: users[Math.ceil(i * 0.1)].id,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Chats', null, {})
  }
};
