'use strict';
var faker = require('faker');
var arrayOfPictures = [];

for(var i = 0; i < 1; i++){
  var picObj = {};
  picObj.url = faker.image.imageUrl(700, 700, 'cats');
  picObj.author = faker.name.firstName();
  picObj.description = 'cats';
  picObj.createdAt = new Date();
  picObj.updatedAt = new Date();
  picObj.user_id = 2;
  arrayOfPictures.push(picObj);
}

console.log(arrayOfPictures);

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Photos', arrayOfPictures, {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Photos');
  }
};
