const express = require('express'),
  router = express.Router();
const Plant = require("../../models/plant.js");
const Moisture = require("../../models/Moisture.js");
/*
let dict = {};
let included = [];
async function accessDB2() {
  const test = await Plant.findAll();
    //Gets the unique MAC addresses
    let included = [];
    for (var i = 0; i<= test.length - 1; i++) { //Remember to account for when there isn't 12 entries yet
      included.push(test[i].dataValues.MAC);
    }
    included = new Set(included);
    for (let item of included) { //Sets the dictionaries values for each unique MAC address
      let numset = [];
      const lastVals = await Plant.findAll({
        where: {
          MAC: item
        },
      });
      if (lastVals.length>=12){ //Remember to account for when there isn't 12 entries yet
      for (var i = 1; i<13; i++) {
        numset.push( lastVals[lastVals.length-i].dataValues.moisture);
      }
      dict[item] = numset.reverse();
    }}
    included = [...included];
    router.get('/', function(req, res, next) {
      res.json({ macAddresses: included, value: 1, dict: dict });
  });
}
*/

//accessDB2();
//setInterval(accessDB2, 5000);
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
  router.get('/', function(req, res, next) {
    res.json({ PLANTS: included });
  });
}
accessDB();
setInterval(accessDB, 5000); //Updates /data every 5 seconds

module.exports = function (app) {
  app.use('/data', router);
};
