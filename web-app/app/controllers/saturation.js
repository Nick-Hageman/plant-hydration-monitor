const express = require('express'),
  router = express.Router();
  
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
