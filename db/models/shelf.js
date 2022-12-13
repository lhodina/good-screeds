'use strict';
module.exports = (sequelize, DataTypes) => {
  const Shelf = sequelize.define('Shelf', {
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});
  Shelf.associate = function(models) {
    // associations can be defined here
    Shelf.belongsTo(models.User, { foreignKey: 'userId' });

    const shelfMapping = {
      through: 'ScreedShelf',
      otherKey: 'screedId',
      foreignKey: 'shelfId'
    };

    Shelf.belongsToMany(models.Screed, shelfMapping);
  };
  return Shelf;
};
