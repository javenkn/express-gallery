'use strict';

module.exports = function(sequelize, DataTypes) {
  var Photo = sequelize.define('Photo', {
    url: DataTypes.TEXT,
    author: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.Photo.belongsTo(models.User, {
          foreignKey: 'user_id'
        });
      }
    }
  });
  return Photo;
};