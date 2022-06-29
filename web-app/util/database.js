const Sequelize = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: '../../../database/plant.db'
});

module.exports = sequelize;