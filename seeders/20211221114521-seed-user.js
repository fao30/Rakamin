"use strict";
const fs = require("fs");
const { passHelper } = require("../helper/helper");

module.exports = {
  up: (queryInterface, Sequelize) => {
    let data = JSON.parse(fs.readFileSync("./seeders/user.json", "utf-8"));
    data.forEach((e) => {
      e.password = passHelper.hashPassword(e.password);
      e.createdAt = new Date();
      e.updatedAt = new Date();
    });
    return queryInterface.bulkInsert("Users", data, {});
  },

  down: (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete("Users", null, {});
  },
};
