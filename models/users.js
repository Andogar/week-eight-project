'use strict';
module.exports = function (sequelize, DataTypes) {
  var users = sequelize.define('users', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.TEXT
  });

  users.associate = function (models) {
    users.hasMany(models.snippets);
  }

  return users;
};