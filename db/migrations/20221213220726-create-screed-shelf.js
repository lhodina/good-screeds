'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ScreedShelves', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      screedId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'Screeds' },
        onDelete: 'cascade'
      },
      shelfId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'Shelves' },
        onDelete: 'cascade'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('ScreedShelves');
  }
};
