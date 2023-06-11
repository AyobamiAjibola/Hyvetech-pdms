'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('account_activation_request', 'nin', { type: Sequelize.STRING });
    await queryInterface.addColumn('partner_account', 'nin', { type: Sequelize.STRING });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('account_activation_request', 'nin');
    await queryInterface.removeColumn('partner_account', 'nin');
  },
};
