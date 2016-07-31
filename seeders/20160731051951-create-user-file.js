'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Users', [
    {
      username: 'j',
      password : 'password',
      createdAt : new Date(),
      updatedAt : new Date()
    },
    {
      username: 'lol',
      password: 'lololol',
      createdAt : new Date(),
      updatedAt : new Date()
    }
    ], {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users');
  }
};
