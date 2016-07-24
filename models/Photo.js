module.exports = function(sequelize, DataTypes) {
  var Photo = sequelize.define("Photo", {
    url: DataTypes.TEXT,
    author: DataTypes.STRING,
    description: DataTypes.TEXT
  });

  return Photo;
};