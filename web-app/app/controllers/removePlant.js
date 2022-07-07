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
  id = req.body.id;
  //let moisture = getData();
  //let img = document.getElementById('file-select').files[0].name;

  Plant.destroy({
    where: {
        MAC: id
    }
  })
  res.json({ message: 'SUCCESS'});
});


module.exports = function (app) {
    app.use('/removePlant', router);
  };