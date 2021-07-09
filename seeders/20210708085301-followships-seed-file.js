'use strict';
const db = require('../models')
const User = db.User

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await User.findAll({ raw: true, nest: true })

    await queryInterface.bulkInsert('Followships',
      Array.from({ length: 2 }).map((d, i) => (
        {
          followerId: users[0].id,
          followingId: users[i + 1].id,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ))
    )

    await queryInterface.bulkInsert('Followships',
      Array.from({ length: 2 }).map((d, i) => (
        {
          followerId: users[1].id,
          followingId: users[i * (users.length - 1)].id,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ))
    )

    await queryInterface.bulkInsert('Followships',
      Array.from({ length: 2 }).map((d, i) => (
        {
          followerId: users[2].id,
          followingId: users[i].id,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ))
    )
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.bulkDelete('Followships', null, {})
  }
};
