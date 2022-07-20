const express = require('express'),
  router = express.Router();
const Plant = require("../../../models/plant.js");
const Moisture = require("../../../models/Moisture.js");

router.get('/', function(req, res, next) {
async function accessDB() {
  const test = await Plant.findAll();
  let included = [];
  for (var i = 0; i<= test.length - 1; i++) {
    //Collect all data from the last 12 hrs using datetime
    let sensorVals = await Moisture.findAll({
      where : {
        plantId : test[i].dataValues.id
      }
    })
    let readings = [];
    for (let item of sensorVals) {
      //Only include readings if they're in a desired time frame (12 hrs)
      let current = new Date()
      if (current - item.createdAt <= 43200000) {
        readings.push({ x: ((current - item.createdAt)/3600000).toFixed(1), y: item.moisture});
      }
    }
    //Create array for each plant
    included.push([test[i].dataValues.MAC, test[i].dataValues.name, test[i].dataValues.location, test[i].dataValues.id, readings]);
  }
  res.json({ PLANTS: included });
}
accessDB();
});

module.exports = function (app) {
  app.use('/activeData', router);
};
