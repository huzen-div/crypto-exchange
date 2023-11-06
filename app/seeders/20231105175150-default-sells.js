'use strict';
const { uuid } = require('uuidv4');
const tableName = 'sells';
module.exports = {
  up: async (queryInterface, Sequelize) => {

    const examples = [];
    examples.push({
      sellGuid: 'd83fc52b-5e45-43fa-9eae-d343e1c76242',
      treasureGuid: 'b346e697-a324-4546-997b-561814c2b378',
      price: 1685906,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    // for (let i = 1; i <= 5; i++) {
    //   examples.push({
    //     sellGuid: uuid(),
    //     treasureGuid: uuid(),
    //     price: 1685906,
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