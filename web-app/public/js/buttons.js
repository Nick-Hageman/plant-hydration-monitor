//const Plant = require("../../models/plant.js");
let moisture, dataset;
//TESTING
fetch('http://192.168.86.82:3000/saturation')
.then(response => response.json())
.then(data => {
  dataset = (data.dict[data.macAddress]) // Prints result from `response.json()` in getRequest
  moisture = String(((data.value / 1023) * 100).toFixed(0)) + "%";
})
.catch(error => console.error(error))

//New div attempt
// Create div and add to webpage
let div = document.createElement('div');
div.classList.add('plant-list');
let containerDiv = document.querySelector('.container');
containerDiv.appendChild(div);

// 1. create plant
const addPlant = async (req, res) => {
  let name = document.getElementById('name').value;
  let location = document.getElementById('location').value;
  let id = document.getElementById('id').value;
  fetch('http://192.168.86.82:3000/plant', {
  method: "POST",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    name: name,
    location: location,
    id: id
  })
});
}
//addPlant();

// Add event listener
let submitBtn = document.getElementById('btn');
submitBtn.addEventListener('click', addPlant); //Use this function to add entries to the database

/*
// Remove Plant
const addPlant = async (req, res) => {
  let name = document.getElementById('name').value;
  let location = document.getElementById('location').value;
  let id = document.getElementById('id').value;
  fetch('http://192.168.86.82:3000/plant', {
  method: "POST",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    name: name,
    location: location,
    id: id
  })
});
}
//addPlant();

// Add event listener
let submitBtn = document.getElementById('btn');
submitBtn.addEventListener('click', addPlant); //Use this function to add entries to the database
*/

let i = 0;
/*
// create function
function displayPlantDetail() {
    //collect data from form
    let name = document.getElementById('name').value;
    let location = document.getElementById('location').value;
    let id = document.getElementById('id').value;
    //let moisture = getData();
    let img = document.getElementById('file-select').files[0].name;
    let html = `<div class="card">
                        <img src="img/${img}" style="vertical-align:middle" height="300px" width="250px">
                        <div class="plant-details">
                            <div class="name">Name: ${name}</div>
                            <div class="location">Location: ${location}</div>
                            <div class="id">ID: ${id}</div>
                            <div class="moisture">Moisture: ${moisture}</div>
                            </div>
                            <div class="skill">
                              <div class="outer">
                                <div class="inner">
                                  <div id="number">
                                    65%
                                  </div>
                                </div>
                              </div>
                
                              <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="160px" height="160px">
                                <defs>
                                   <linearGradient id="GradientColor">
                                      <stop offset="0%" stop-color="#e91e63" />
                                      <stop offset="100%" stop-color="#673ab7" />
                                   </linearGradient>
                                </defs>
                                <circle cx="80" cy="80" r="70" stroke-linecap="round" />
                    </svg>
                        <script>
                            //Script for hydration bar
                            let number = document.getElementById("number");
                            let counter = 0;
                            setInterval(() => {
                                if(counter == 65){
                                    clearInterval();
                                }else{
                                    counter += 1;
                                    number.innerHTML = counter + "%"
                                }
                            }, 30);
                        </script>
                        </div>
                        <div class="div-remove-card">
                            <button class="remove-card" id="remove-card-${i}">X</button>
                        </div>
                    </div>`;
    
    div.insertAdjacentHTML("beforeend", html);

    document.querySelector('#remove-card-' + i)
    .addEventListener('click', function(){
        let confrm = confirm('Do you really want to remove this plant?')
        let removeEl = this.parentNode.parentNode;
        if(confrm)
            div.removeChild(removeEl)
    })
    i++;

}
*/