const express = require('express'),
  router = express.Router();
const Plant = require("../../models/plant.js");
const Moisture = require("../../models/moisture.js");

let saturation = 0;
let mac = 0;
let dict = {}; //This will store all of the saturation values for the respective MAC addresses

module.exports = function (app) {
  app.use('/saturation', router);
};

// Page templates:
/**
 * Render the main page
 */
router.get('/', function(req, res, next) {
  res.json({ macAddress: mac, value: saturation, dict: dict });
});


router.post('/', function(req, res, next) {
  saturation = req.body.sensorVal;
  mac = req.body.macAddress;
  //if mac not in dict -> dict[mac] = [saturation] ---else -> if len of dict[mac] > 11 remove the last one and add the new value.
  console.log('Saturation Value: ', saturation, ' Mac Address: ', mac);
  //Add moisture to Database
  async function moistureUpdate() {
    try {
    const ID = await Plant.findAll({
      where: {
        MAC: mac
      },
      });
      let id = (ID[0].dataValues.id);
      let data = {plantId: id, moisture: String((((1023-saturation) / 1023) * 100).toFixed(0))};
      const moisture = await Moisture.create(data);
    } catch {
      console.log("Mac Address (", mac, ") not found in Database... Try adding it on the web page");
    }}
  moistureUpdate();
  res.json({ message: 'SUCCESS'});
});

//Collects saturation values and stores them in a dectionary 
function updateG(){
  if (dict.hasOwnProperty(mac)) {
    //if (dict[mac].length == 12) {
    dict[mac].shift();
    //}
    dict[mac].push((((1023-saturation)/1023)*100).toFixed(0));
  } else {
    dict[mac] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, (((1023-saturation)/1023)*100).toFixed(0)];
  }
  console.log('dict -> ', dict);
}
//setInterval(updateG, 5000);

//accessDB2();
