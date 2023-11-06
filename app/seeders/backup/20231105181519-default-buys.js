'use strict';
const { uuid } = require('uuidv4');
const tableName = 'buys';
module.exports = {
  up: async (queryInterface, Sequelize) => {

    const examples = [];
    examples.push({
      buyGuid: uuid(),
      sellGuid: 'd83fc52b-5e45-43fa-9eae-d343e1c76242',
      buyerGuid: '011cac48-ec14-4875-af30-78f591affdfb',
      fiatType: 'THB',
      buyPrice: 280,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    // for (let i = 1; i <= 5; i++) {
    //   examples.push({
    //     buyGuid: uuid(),
    //     sellGuid: uuid(),
    //     buyerGuid: uuid(),
    //     fiatType: 'THB',
    //     buyPrice: 280,
    //     createdAt: new Date(),
    //     updatedAt: new Date()
    //   });
    // }

    return queryInterface.bulkInsert(tableName, examples);
  },
  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete(tableName, {});
  }
};