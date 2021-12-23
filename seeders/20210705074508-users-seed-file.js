'use strict';
const bcrypt = require('bcryptjs')
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [
      {
        account: 'root',
        email: 'root@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        name: 'root',
        avatar: `https://picsum.photos/320/240`,
        cover: `https://picsum.photos/800/300`,
        introduction: faker.lorem.sentences(),
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])

    await queryInterface.bulkInsert('Users',
      Array.from({ length: 2 }).map((d, i) => ({
        account: `user${i + 1}`,
        email: `user${i + 1}@example.com`,
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        name: `user${i + 1}`,
        avatar: `https://picsum.photos/${320 + i}/240`,
        cover: `https://picsum.photos/${800 + i}/300`,
        introduction: faker.lorem.sentences(),
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
};
