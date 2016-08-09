'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Photos', [
    {
      url : 'http://wallpapercave.com/wp/JL842k9.jpg',
      description :'24',
      createdAt : new Date(),
      updatedAt : new Date(),
      user_id : 1
    },
    {
      url : 'http://www.hdbloggers.net/wp-content/uploads/2016/07/Michael-Jordan-HD-Wallpapers-Backgrounds.jpg',
      description :'23',
      createdAt : new Date(),
      updatedAt : new Date(),
      user_id : 1
    },
    {
      url :'https://i.ytimg.com/vi/qNRq2-Wk4Gc/maxresdefault.jpg',
      description : 'Mamba',
      createdAt : new Date(),
      updatedAt : new Date(),
      user_id : 1
    },
    {
      url : 'http://wallpaper95.com/w/download/random-color-HD.jpg',
      description : 'Colorful',
      createdAt : new Date(),
      updatedAt : new Date(),
      user_id : 2
    },
    {
      url : 'https://skylinefocus.files.wordpress.com/2009/01/cubus-wallpaper.jpg',
      description :'Cube',
      createdAt : new Date(),
      updatedAt : new Date(),
      user_id : 2
    },
    {
      url :'http://k33.kn3.net/7/4/D/A/7/D/AB4.png',
      description :'Mountains',
      createdAt : new Date(),
      updatedAt : new Date(),
      user_id : 3
    },
    {
      url : 'http://wallpapercave.com/wp/QlF13TB.jpg',
      description : 'SF bridge',
      createdAt : new Date(),
      updatedAt : new Date(),
      user_id : 3
    },
    {
      url : 'https://images.alphacoders.com/301/301503.jpg',
      description : 'Streets',
      createdAt : new Date(),
      updatedAt : new Date(),
      user_id : 3
    },
    {
      url : 'http://freewallpaperspictures.com/wp-content/uploads/2016/02/Wallpapers-Full-HD-random-35881387-1920-1080.jpg',
      description : 'Eclipse',
      createdAt : new Date(),
      updatedAt : new Date(),
      user_id : 3
    },
    {
      url : 'http://4.bp.blogspot.com/-4PT2fNAEbIQ/UAU-SSOt-TI/AAAAAAAADLY/6IXkTate7Hc/s1600/Random+HD+Wallpapers+(22).jpg',
      description : 'Sunset',
      createdAt : new Date(),
      updatedAt : new Date(),
      user_id : 3
    }
    ], {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Photos');
  }
};
