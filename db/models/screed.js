'use strict';
module.exports = (sequelize, DataTypes) => {
  const Screed = sequelize.define('Screed', {
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    title: {
      allowNull: false,
      type: DataTypes.STRING(50)
    },
    authorId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    text: DataTypes.TEXT,
    imgLink: DataTypes.STRING
  }, {});
  Screed.associate = function(models) {
    // associations can be defined here
    Screed.hasMany(models.UserNote, { foreignKey: 'screedId' });

    Screed.belongsTo(models.Author, {
      foreignKey: 'authorId',
      onDelete: 'cascade'
    });


    const shelfMapping = {
      through: 'ScreedShelf',
      otherKey: 'shelfId',
      foreignKey: 'screedId'
    };
    Screed.belongsToMany(models.Shelf, shelfMapping);


    const tagMapping = {
      through: 'ScreedTag',
      otherKey: 'tagId',
      foreignKey: 'screedId'
    };
    Screed.belongsToMany(models.Tag, tagMapping);


  };
  return Screed;
};
