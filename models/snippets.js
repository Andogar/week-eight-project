'use strict';
module.exports = function (sequelize, DataTypes) {
  var snippets = sequelize.define('snippets', {
    name: DataTypes.STRING,
    content: DataTypes.TEXT,
    notes: DataTypes.STRING,
    language: DataTypes.STRING,
    tags: DataTypes.TEXT,
    dateAdded: DataTypes.STRING,
    userId: DataTypes.INTEGER
  });

  snippets.associate = function (models) {
    snippets.belongsTo(models.users, { foreignKey: 'userId' });
  }

  return snippets;
};