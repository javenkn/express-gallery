'use strict';

module.exports = function(sequelize, DataTypes) {
  var Photo = sequelize.define('Photo', {
    url: DataTypes.TEXT,
    description: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.Photo.belongsTo(models.User, {
          foreignKey: 'user_id',
          targetKey: 'id'
        });
      }
    }
  });
  return Photo;
};