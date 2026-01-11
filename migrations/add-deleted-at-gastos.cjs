const { Sequelize } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDesc = await queryInterface.describeTable('gastos');
    if (!tableDesc.deletedAt) {
      await queryInterface.addColumn('gastos', 'deletedAt', {
        type: Sequelize.DATE,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDesc = await queryInterface.describeTable('gastos');
    if (tableDesc.deletedAt) {
      await queryInterface.removeColumn('gastos', 'deletedAt');
    }
  },
};
