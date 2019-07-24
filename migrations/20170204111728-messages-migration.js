'use strict';
var models = require("../models/index.js");
module.exports = {
  up: function (queryInterface, Sequelize) {
      return queryInterface.createTable(models.messages.tableName,
          models.messages.attributes);
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('messages');
  }
};
