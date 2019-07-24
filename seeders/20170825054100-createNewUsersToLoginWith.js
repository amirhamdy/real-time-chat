'use strict';
var md5 = require('md5');
module.exports = {
  up: function (queryInterface, Sequelize) {

      return queryInterface.bulkInsert('users', [{
          first_name: 'Amir Hamdy',
          email: 'amirhamdy4@gmail.com',
          password: md5('123456'),
          remember_token: 'remember_token',
          avatarPath: '1.jpg',
          isActive: 0,
          socketID: null
      },{
          first_name: 'Ahmed Hamdy',
          email: 'ahmedhamdy4@gmail.com',
          password: md5('123456'),
          remember_token: 'remember_token',
          avatarPath: '2.jpg',
          isActive: 0,
          socketID: null
      },{
          first_name: 'Abdo Hamdy',
          email: 'abdohamdy4@gmail.com',
          password: md5('123456'),
          remember_token: 'remember_token',
          avatarPath: '3.jpg',
          isActive: 0,
          socketID: null
      }], {});
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
