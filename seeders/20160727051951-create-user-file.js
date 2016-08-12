'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    var db = require('../models');
    var secret = require('../config/secret.json');
    return queryInterface.bulkInsert('Users', [
    {
      username: 'J',
      password : db.User.hashPassword(secret.Salt + 'password'),
      createdAt : new Date(),
      updatedAt : new Date()
    },
    {
      username: 'lol',
      password: db.User.hashPassword(secret.Salt + 'lololol'),
      createdAt : new Date(),
      updatedAt : new Date()
    },
    {
      username: 'Photographer',
      password: db.User.hashPassword(secret.Salt + 'photo'),
      createdAt : new Date(),
      updatedAt : new Date()
    }
    ], {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users');
  }
};
