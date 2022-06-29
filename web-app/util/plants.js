const express = require('express'),
  router = express.Router();

const app = express();
app.use(express.json());

module.exports = function (app) {
  app.use('/plants', router);
};

app.post('/plants', async (req, res) => {
    await Plant.create(req.body);
    res.send("success");
  })
  
  app.get('/plants', async (req, res) => {
    const plants = await Plant.findAll();
    res.send(plants);
  })
  
  app.get('/plants/:id', async (req, res) => {
    const id = req.params.id;
    const plant = await Plant.findOne({where: {id: id}});
    res.send(plant);
  })
