const express = require('express'),
  router = express.Router();
const Plant = require("../../models/plant.js");
const sequelize = require("../../app.js");

// Page templates:
/**
 * Render the main page
 */
let id;
/*
router.get('/', function(req, res, next) {
  res.json({ id: id });
});
*/

router.post('/', function(req, res, next) {
  async function accessDB() {
    id = req.body.id;
    //let moisture = getData();
    //let img = document.getElementById('file-select').files[0].name;
    let plant_deleting = await Plant.findAll({
      where : {
        MAC : id
      }
    })
    //Destroys all moisture values connected to the plant entry bring deleted
    Moisture.destroy({
      where: {
          plantId: plant_deleting[0].dataValues.id
      }
    })
    //Destroys the plant entry
    Plant.destroy({
      where: {
          MAC: id
      }
    })
    res.json({ message: 'SUCCESS'});
  }
  accessDB();
});


module.exports = function (app) {
    app.use('/removePlant', router);
  };