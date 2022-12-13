'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define('Tag', {
    name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});
  Tag.associate = function(models) {
    // associations can be defined here
    Tag.belongsTo(models.User, { foreignKey: 'userId' });

    const tagMapping = {
      through: 'ScreedTag',
      otherKey: 'screedId',
      foreignKey: 'tagId'
    };

    Tag.belongsToMany(models.Screed, tagMapping);
  };
  return Tag;
};
