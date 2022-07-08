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

// Add event listener
let submitBtn = document.getElementById('btn');
submitBtn.addEventListener('click', addPlant); //Use this function to add entries to the database
