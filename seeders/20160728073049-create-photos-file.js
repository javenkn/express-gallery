'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Photos', [
    {
      url : 'https://scholar.google.com/intl/en/scholar/images/1x/googlelogo_color_270x104dp.png',
      author :'Google Person',
      description :'Google gallery!!!!',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      url : 'http://lorempixel.com/output/city-q-c-250-250-3.jpg',
      author :'CityPerson',
      description :'City during the day',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      url :'http://lorempixel.com/output/city-q-c-250-250-4.jpg',
      author : 'CityPerson',
      description : 'City at night!!!!!',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      url : 'http://lorempixel.com/output/abstract-q-c-250-250-2.jpg',
      author : 'Abstract',
      description : 'abstract pic',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      url : 'http://lorempixel.com/output/abstract-q-c-250-250-6.jpg',
      author : 'Abstract',
      description :'Purple',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      url :'http://lorempixel.com/output/sports-q-c-100-100-4.jpg',
      author : 'Star',
      description :'Stars',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      url : 'http://lorempixel.com/output/animals-q-c-100-100-4.jpg',
      author : 'giraffeman',
      description : 'giraffe',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      url : 'http://lorempixel.com/output/transport-q-c-100-100-3.jpg',
      author : 'LamboMan',
      description : 'Lambo wow!',
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      url : 'http://lorempixel.com/output/food-q-c-250-250-2.jpg',
      author : 'Foodman',
      description : 'Good lookin food!',
      createdAt : new Date(),
      updatedAt : new Date(),
    }
    ], {});
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.bulkDelete('Photos', [{
      author :'Google Person'
    },
    {
      author : 'CityPerson'
    },
    {
      author: 'CityPerson'
    },
    {
      author: 'Abstract'
    },
    {
      author: 'Star'
    },
    {
      author: 'giraffeman'
    },
    {
      author: 'LamboMan'
    },
    {
      author: 'Foodman'
    }
    ]);
  }
};
