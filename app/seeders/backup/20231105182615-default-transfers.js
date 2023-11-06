'use strict';
const { uuid } = require('uuidv4');
const tableName = 'transfers';
module.exports = {
  up: async (queryInterface, Sequelize) => {

    const examples = [];

    examples.push({
      transferGuid: uuid(),
      treasureGuid: 'b346e697-a324-4546-997b-561814c2b378',
      isExternal: false,
      receiverGuid: '96c2b3ff-e2bc-4baf-84e5-9cc41e07b410',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // for (let i = 1; i <= 5; i++) {
    //   examples.push({
    //     transferGuid: uuid(),
    //     treasureGuid: uuid(),
    //     isExternal: false,
    //     receiverGuid: uuid(),
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