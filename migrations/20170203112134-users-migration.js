'use strict';
var models = require("../models/index.js");
module.exports = {
  up: function (queryInterface, Sequelize) {

    return queryInterface.createTable(models.users.tableName, 
      models.users.attributes);
  },

  down: function (queryInterface, Sequelize) {
     return queryInterface.dropTable('users');
  }
};

