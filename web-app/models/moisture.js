const Sequelize = require("sequelize");
const sequelize = require("../app.js");

const Moisture = sequelize.define("moisture", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  moisture: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

module.exports =  Moisture;