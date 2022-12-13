'use strict';
module.exports = (sequelize, DataTypes) => {
  const Author = sequelize.define('Author', {
    name: {
      allowNull: false,
      type: DataTypes.STRING(100)
    }
  }, {});
  Author.associate = function(models) {
    // associations can be defined here
    Author.hasMany(models.Screed, { foreignKey: 'authorId' });
  };
  return Author;
};
