const express = require('express'),
  router = express.Router();

let saturation = 1023;
module.exports = function (app) {
  app.use('/saturation', router);
};

// Page templates:
/**
 * Render the main page
 */
router.get('/', function(req, res, next) {
  res.json({ value: saturation });
}) ;

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
