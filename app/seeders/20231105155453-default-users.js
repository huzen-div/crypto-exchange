'use strict';
const { uuid } = require('uuidv4');
const tableName = 'users';
module.exports = {
  up: async (queryInterface, Sequelize) => {

    const examples = [];
    examples.push({
      userGuid: '011cac48-ec14-4875-af30-78f591affdfb',
      username: `Manop`,
      password: `526fetj9w6s8`,
      firstname: `Manop`,
      lastname: `Jaidee`,
      published: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    examples.push({
      userGuid: '96c2b3ff-e2bc-4baf-84e5-9cc41e07b410',
      username: `Kanit`,
      password: `526s9w68fetj`,
      firstname: `Kanit`,
      lastname: `Natphichai`,
      published: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    // for (let i = 1; i <= 5; i++) {
    //   examples.push({
    //     userGuid: uuid(),
    //     username: `username-${i}`,
    //     password: `password-${i}`,
    //     firstname: `firstname-${i}`,
    //     lastname: `lastname-${i}`,
    //     published: true,
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