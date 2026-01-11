const { Sequelize } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDesc = await queryInterface.describeTable('ventas');
    if (!tableDesc.deletedAt) {
      await queryInterface.addColumn('ventas', 'deletedAt', {
        type: Sequelize.DATE,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDesc = await queryInterface.describeTable('ventas');
    if (tableDesc.deletedAt) {
      await queryInterface.removeColumn('ventas', 'deletedAt');
    }
  },
};
