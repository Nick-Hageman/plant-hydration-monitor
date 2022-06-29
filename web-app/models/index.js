//const Sequelize = require('sequelize');
const sequelize = require('../app.js')
const Plant = require("./plant.js");
const Moisture = require("./moisture");
const fetch = require('node-fetch');

Plant.hasMany(Moisture);

/*
//Try to update values LIVE vvvv
const api_url = 'http://192.168.86.70:3000/saturation';
let firstTime = true;
async function getInfo() {
  const response = await fetch(api_url);
  const data = await response.json();
  const { mac, value } = data;
  //console.log(mac, value);
  //document.getElementById('lat').textContent = mac.toFixed(2);
  //document.getElementById('moist').textContent = value;
}
async function getMac() {
  const response = await fetch(api_url);
  const data = await response.json();
  const { mac, value } = data;
  return(mac);
}
async function getValue() {
  const response = await fetch(api_url);
  const data = await response.json();
  const { mac, value } = data;
  return(value);
}
*/
let moisture;
let mac;
//TESTING
fetch('http://192.168.86.70:3000/saturation')
.then(response => response.json())
.then(data => {
  console.log(data) // Prints result from `response.json()` in getRequest
  moisture = String(((data.value / 1023) * 100).toFixed(0));
  mac = String(data.macAddress)
})
.catch(error => console.error(error))
//getInfo();
//                    ^^^TESTING*/


//ORIGINAL FUCTION
/*
let plantId = null;
sequelize
  //.sync({force: true})
  .sync()
  .then((result) => {
    return Plant.create({name: "plant1", location: "kitchen", MAC: mac, moisture: moisture});
    console.log(result);
  })
  .then(plant => {
    plantId = plant.id;
    console.log("First plant Created: ",plant);
    return plant.createMoisture({moisture: 500}); //createOrder?
  })
  .then(moisture => {
    console.log("Moisture is : ",moisture);
    return Moisture.findAll({ where: plantId});
  })
  .then(moistures => {
    console.log("All the mositure recordings are : ",moistures);
  })
  .catch((err) => {
    console.log(err);
  });
*/




function createEntry() {
  fetch('http://192.168.86.70:3000/saturation')
  .then(response => response.json())
  .then(data => {
    console.log(data) // Prints result from `response.json()` in getRequest
    moisture = String((((1023-data.value) / 1023) * 100).toFixed(0));
    mac = String(data.macAddress)
    if (mac == 0){
      return;
    }
    //Create entry with fetched data
    let plantId = null;
    sequelize
      //.sync({force: true})
      .sync()
      .then((result) => {
        return Plant.create({name: "plant1", location: "kitchen", MAC: mac, moisture: moisture});
        console.log(result);
      });
  })
  .catch(error => console.error(error))
  }


async function moistureUpdate() {
  fetch('http://192.168.86.70:3000/saturation')
  .then(response => response.json())
  .then(data => {
    console.log(data) // Prints result from `response.json()` in getRequest
    moisture = String((((1023-data.value) / 1023) * 100).toFixed(0));
    mac = String(data.macAddress)
    //Create entry with fetched data
    let plantId = null;
    sequelize
      //.sync({force: true})
      .sync()
      .then(plant => {
        plantId = plant.id;
        console.log("First plant Created: ",plant);
        return plant.createMoisture({moisture: moisture}); //createOrder?
      })
      .then(moisture => {
        console.log("Moisture is : ",moisture);
        return Moisture.findAll({ where: plantId});
      })
      .then(moistures => {
        console.log("All the mositure recordings are : ",moistures);
      })
      .catch((err) => {
        console.log(err);
      });
  })
  .catch(error => console.error(error))
}

//setInterval(createEntry, 5000); //Test every 5 seconds because when it starts we get values of 0

//Try to access data
async function accessDB(address) {
  const test = await Plant.findAll({
    where: {
      MAC: address
    },
  });
  console.log("TEST------------------------", JSON.stringify(test));
  console.log("TEST------------------------", test[test.length-1].dataValues.moisture);
  let numset = [];
  //Get's the 12 most recent sensor readings
  for (var i = 1; i<13; i++) { //Remember to account for when there isn't 12 entries yet
    numset.push( test[test.length-i].dataValues.moisture);
  }
  console.log("NUMSET:   ",numset);

  //Gets the unique MAC addresses
  let included = [];
  for (var i = 0; i<= test.length - 1; i++) { //Remember to account for when there isn't 12 entries yet
    included.push(test[i].dataValues.MAC);
  }
  included = new Set(included);
  for (let item of included) console.log(item); //How to iterate through a SET
  
}
//accessDB('AC:0B:FB:DD:3D:A2');

//Attempt #2 (This one works)
let dict = {};
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
      dict[item] = numset
    }}
    console.log(dict);
}

//accessDB2();
