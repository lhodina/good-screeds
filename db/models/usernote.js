'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserNote = sequelize.define('UserNote', {
    userId:  {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    screedId:  {
      allowNull: false,
      type: DataTypes.INTEGER,
      onDelete: 'cascade'
    },
    review: DataTypes.TEXT,
    readStatus: DataTypes.BOOLEAN
  }, {});
  UserNote.associate = function(models) {
    // associations can be defined here
  };
  return UserNote;
};
