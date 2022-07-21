const REFRESH_INTERVAL = 5000;

$(document).ready(function() {
        //Import

        btn.addEventListener("click", (e) =>{
          let name = document.getElementById('name').value;
          let location = document.getElementById('location').value;
          //var img = document.getElementById('file-select').files[0].name;
  
          alert("Added Plant to Database");
        });
  
    //MORE TESTING
    //Iterate through 
    //  - connect sensor to plants (using id input)
    //  - display on screen
    function getvals(){
      return fetch('http://192.168.86.94:3000/activeData',
      {
        method: "GET",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      })
      .then((response) => response.json())
      .then((responseData) => {
        //console.log(responseData.dict[responseData.macAddress]);
        //console.log('test',responseData.PLANTS);
        return responseData.PLANTS;
      })
      .catch(error => console.warn(error));
    }
    getvals();
  
    function updateDiv() {
    getvals().then(data => {
      let i = 0;
      for (let x in data) {
      console.log(data[x]);
      //Plant Attributes
      let name =  data[x][1];
      let location =  data[x][2];
      let id =  data[x][0]; //Users need to put this in their arduino program to send the sensor readings to this specific plant
      let img =  "../img/plant1.jpg";
      let moisture =  data[x][4][data[x][4].length-1].y; //Get's the most recent reading
  
      let html = `<div class="card">
                          <img src="img/${img}" style="vertical-align:middle" height="300px" width="250px">
                          <div class="plant-details">
                              <div class="name">Name: ${name}</div>
                              <div class="location">Location: ${location}</div>
                              <div class="id">ID: ${id}</div>
                              <div class="moisture" id="moist">Moisture: ${moisture}</div>
                              </div>
                              <div height="40px">
                <canvas id="myChart${i}" width="100%" height="40px"></canvas>
              </div>
                          <div class="div-remove-card">
                              <button class="remove-card" id="remove-card-${i}">X</button>
                          </div>
                      </div>`;
      
      let div = document.querySelector('.plant-list');
      div.insertAdjacentHTML("beforeend", html);
      function updateScript() {
      var script = document.createElement('script');
      script.innerHTML = `
  //Function to retrive current readings from sensor
  function getvals(){
    return fetch('http://192.168.86.94:3000/activeData',
    {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
    .then((response) => response.json())
    .then((responseData) => {
      //console.log(responseData.dict[responseData.macAddress]);
      return responseData.PLANTS[${x}][4]; //Change []
    })
    .catch(error => console.warn(error));
  }
  //getvals();
  
  function updateChart() {
  getvals().then(values => {
  const labels = [
    '11',
    '10',
    '9',
    '8',
    '7',
    '6',
    '5',
    '4',
    '3',
    '2',
    '1',
    '0',
  ];
  
  const data = {
    datasets: [{
      label: 'Soil Moisture %',
      backgroundColor: 'rgb(18, 151, 139)',
      borderColor: 'rgb(12, 104, 96)',
      data: values,
    }]
  };
  
  //Red Zone bg color (Optional chart plugins)
  const backgroundChartArea = {
    id: 'backgroundChartArea',
    beforeDatasetsDraw(chart,args,options) {
      const {ctx, chartArea: { top, bottom, left, right, width, height},
        scales: {x, y} } = chart;
      ctx.fillStyle = 'rgba(255,70,60,0.8)';
      ctx.fillRect(left,bottom,width,-0.4*height)
    }
  }
  //Adds Green Zone
  const backgroundChartArea2 = {
    id: 'backgroundChartArea2',
    beforeDatasetsDraw(chart,args,options) {
      const {ctx, chartArea: { top, bottom, left, right, width, height},
        scales: {x, y} } = chart;
      ctx.fillStyle = 'rgba(0,203,47,0.8)';
      ctx.fillRect(left,top,width,0.6*height)
    }
  }
  
  const config = {
    type: 'scatter',
    data: data,
    options: {
      showLine: true,
      scales: {
  x: {
    beginAtZero: true,
    min: 0,
    max: 12,
    reverse: true,
    title: {
      color: 'gray',
      display: true,
      text: 'Hours Ago'
    },
    ticks: {
      color: 'white',
    }
  },
  y: {
            suggestedMin: 0,
            suggestedMax: 100,
            grid: {
              tickColor: ['red', 'red','red','red','lime','lime','lime','lime','lime','lime','lime']
            },
            ticks: {
              color: 'gray',
            }
        }
  }},
  //plugins: [backgroundChartArea, backgroundChartArea2]
  };
  //setInterval(function () {
    if (Chart.getChart("myChart${i}")){
      Chart.getChart("myChart${i}").destroy();
    }
  const myChart${i} = new Chart(
              document.getElementById('myChart${i}'),
              config
            );
  myChart${i}.update();
  //}, 5000);
  })
  }
  updateChart();
  setInterval(updateChart, ${REFRESH_INTERVAL});`;
  
      //let div_i = document.getElementById('myChart'+String(i));
      document.body.appendChild(script);
  }
  updateScript();
  //setInterval(updateScript, 3000);
      document.querySelector('#remove-card-' + i)
      .addEventListener('click', function(){
          let confrm = confirm('Do you really want to remove this plant from the Database?')
          let removeEl = this.parentNode.parentNode;
          if(confrm) {
              //Xdiv.removeChild(removeEl);
              //Remove plant from Database
              id = (removeEl.children[1].children[2].textContent.split('ID: '));
              fetch('http://192.168.86.94:3000/removePlant', {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                id: id
              })
            });
              //Xlet idno = removeEl.children[1].children[2].textContent.split('ID: ').pop();
          };
      })
      i++;
  
  
    }
  }, {
    onlyOnce: true
  });
  }
  updateDiv();
});
