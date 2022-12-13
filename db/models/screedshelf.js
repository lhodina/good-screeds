'use strict';
module.exports = (sequelize, DataTypes) => {
  const ScreedShelf = sequelize.define('ScreedShelf', {
    screedId: {
      type:DataTypes.INTEGER,
      allowNull: false,
      onDelete: 'cascade'
    },
    shelfId: {
      type:DataTypes.INTEGER,
      allowNull: false,
      onDelete: 'cascade'
    }
  }, {});
  ScreedShelf.associate = function(models) {
    // associations can be defined here
  };
  return ScreedShelf;
};
