const Sequelize = require('sequelize');
const sequelize = require('../app.js')
const Plant = require("./plant.js");
const Moisture = require("./moisture");

// 1 to many relationship
Plant.hasMany(Moisture, {
    foreignKey: 'plantId',
    as: 'moisture',
    onDelete: 'cascade',
    hooks: true,
  });
  Moisture.belongsTo(Plant, {
    foreignKey: 'plantId',
    as: 'plant'
  });