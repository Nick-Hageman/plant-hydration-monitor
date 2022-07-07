const express = require('express'),
  router = express.Router();
const Plant = require("../../models/plant.js");

// Page templates:
/**
 * Render the main page
 */
let name1, location, id;
router.get('/', function(req, res, next) {
  res.json({ name1: name1, location: location, id: id });
});

router.post('/', function(req, res, next) {
  name1 = req.body.name;
  location = req.body.location;
  id = req.body.id;
  //let moisture = getData();
  //let img = document.getElementById('file-select').files[0].name;
  async function plantEntry() {
  let info = {name: name1, location: location, MAC: id}
  const plant = await Plant.create(info)
  console.log(plant)
  res.json({ message: 'SUCCESS'});
  }
  plantEntry();
});


module.exports = function (app) {
    app.use('/plant', router);
  };