'use strict';
const { uuid } = require('uuidv4');
const tableName = 'treasures';
module.exports = {
  up: async (queryInterface, Sequelize) => {

    const examples = [];
    examples.push({
      treasureGuid: 'b346e697-a324-4546-997b-561814c2b378',
      userGuid: '011cac48-ec14-4875-af30-78f591affdfb',
      cryptoType: 'BTC',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    // for (let i = 1; i <= 5; i++) {
    //   examples.push({
    //     treasureGuid: uuid(),
    //     userGuid: uuid(),
    //     cryptoType: 'BTC',
    //     isActive: true,
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