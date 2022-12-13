'use strict';
module.exports = (sequelize, DataTypes) => {
  const ScreedTag = sequelize.define('ScreedTag', {
    screedId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      onDelete: 'cascade'
    },
    tagId:  {
      allowNull: false,
      type: DataTypes.INTEGER,
      onDelete: 'cascade'
    },
  }, {});
  ScreedTag.associate = function(models) {
    // associations can be defined here
  };
  return ScreedTag;
};
