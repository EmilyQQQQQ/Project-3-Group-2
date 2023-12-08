// url = "http://127.0.0.1:5000/getData"

// // Simple GET request
// fetch(url)
//   .then(response => {
//     // Check if the request was successful (status code 2xx)
//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }
    
//     // Parse the response JSON
//     return response.json();
//   })
//   .then(data => {
//     // Process the data
//     console.log(data);
//   })
//   .catch(error => {
//     // Handle errors
//     console.error('Fetch error:', error);
//   });

// The URL for the data source
const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json';

// API endpoint to get the list of countries
const countriesUrl = 'http://127.0.0.1:5000/getCountries';

// Fetching data using D3 and logging it to the console
d3.json(url).then(function(data){
  console.log(data);
});

// Initialization function that populates dropdown, calls other chart functions, and initializes demographic info
function init(){
  // Fetching countries data
  d3.json(countriesUrl).then(function(countries) {
    // Extracting country names from data
    let dropdownMenu = d3.select("#countryDropdown");

    // Populating dropdown menu with country names
    countries.forEach((country) => dropdownMenu.append('option').text(country));
    
    // Calling chart functions with the initial sample ID
    // Assuming initialSampleId is set elsewhere in your code
    BarChart(initialSampleId, data);
  });
}

// Initialization function that populates dropdown, calls other chart functions, and initializes demographic info
function init(){
  d3.json(url).then(function(data){
    // Extracting sample names from data
    let names = Object.values(data.names);
    let dropdownMenu = d3.select("#selDataset");

    // Populating dropdown menu with sample names
    names.map((id) => dropdownMenu.append('option').text(id));
    let initialSampleId = names[0];

    // Calling chart functions with the initial sample ID
    BarChart(initialSampleId, data);

  });
}

// Function to create and update the bar chart
function BarChart(sampleId, data){
  // Extracting relevant data for the selected sample
  let samplesData = Object.values(data.samples);
  let result  = samplesData.filter(item => item.id === sampleId)
  let utoId = (result[0].otu_ids);
  let samplesValues = (result[0].sample_values);
  let otuLabels = (result[0].otu_labels);

  // Creating trace and layout for the bar chart
  let trace1 = {
    y : utoId.map(item=>`UTO ${item}`).slice(0,10).reverse(),
    x : samplesValues.slice(0,10).reverse(),
    text : otuLabels.slice(0,10).reverse(),
    type : 'bar',
    orientation : 'h'
  }
  let layout1 = {
    title: "Top 10",
    hovermode: "closest"
  };

  // Creating the bar chart
  Plotly.newPlot('hbar', [trace1], layout1);
}

// Function to handle changes in the selected sample from the dropdown
function optionChanged(newSampleId){
  d3.json(url).then(function(data){
      // Updating all charts and demographic info based on the new sample ID
      BarChart(newSampleId , data);
  });
}

function capturePage() {
  // Capture the entire page
  html2canvas(document.body).then(function(canvas) {
    // Create a temporary link and trigger a click to download the image
    var link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'page_screenshot.png';
    link.click();
  });
}
// Initializing the visualizations when the page loads
init();

// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
let boundariesUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"


// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  console.log(data.features)
  createFeatures(data.features);
});

function markerSize(magnitude) {
  return magnitude * 20000;
}

function chooseColor(depth) {
  if ((depth >= -10) && (depth < 10)) return "lime";
  else if ((depth >= 10) && (depth < 30)) return "greenyellow";
  else if ((depth >= 30) && (depth < 50)) return "yellow";
  else if ((depth >= 50) && (depth < 70)) return "orange";
  else if ((depth >= 70) && (depth < 90)) return "orangered";
  else return "red";
}

function createFeatures(earthquakeData) {
  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.
  function onEachFeature(feature, layer) {
    // layer.on({
    //   click : function(event){
    //     myMap.fitBounds(event.target.getBounds());
    //   }
    // });

    layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3><hr><p>Date: ${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
  }


  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
      return L.circle(latlng, {
        color: 'black',
        fillColor: chooseColor(feature.geometry.coordinates[2]),
        weight: 0.5,
        fillOpacity: 0.5,
        radius: markerSize(feature.properties.mag)
      });
    }
  });
  // Send our earthquakes layer to the createMap function.
  createMap(earthquakes);
}

function createMap(earthquakes) {
  // Create the base layers.

  let satellite = L.tileLayer('https://api.mapbox.com/styles/v1/{style}/tiles/{z}/{x}/{y}?access_token={access_token}', {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    style:    'mapbox/satellite-v9',
    access_token: access_token
  });
  
  let grayscale = L.tileLayer('https://api.mapbox.com/styles/v1/{style}/tiles/{z}/{x}/{y}?access_token={access_token}', {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    style:    'mapbox/light-v11',
    access_token: access_token
  });


  // Create layer for tectonic plates.
  let tectonics = L.layerGroup();
  d3.json(boundariesUrl).then(function(data){
    console.log(data);
    L.geoJSON(data,{
        color: 'orange',
        weight: 2
    }).addTo(tectonics)
  })


  // Create a baseMaps object.
  let baseMaps = {
    'Satellite': satellite,
    'Grayscale': grayscale,
  };

  // Create an overlay object to hold our overlay.
  let overlayMaps = {
    'Earthquakes': earthquakes,
    'Tectonic Plates': tectonics,
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  let myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [satellite, earthquakes, tectonics]
  });



  // Set up the legend.
  let legend = L.control({ position: "bottomright" });
  legend.onAdd = function () {
    let div = L.DomUtil.create("div", "info legend");
    let depth = [-10, 10, 30, 50, 70, 90];
    let labels = [];

    depth.forEach(function (depthValue, index) {
      let label = '<li style="background-color:' + chooseColor(depthValue) + ';"></li> ' + depthValue;

      if (depth[index + 1]) {
        label += "&ndash;" + depth[index + 1] + "<br>";
      } else {
        label += "+";
      }

      labels.push(label);
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };



  // Adding the legend to the map
  legend.addTo(myMap);


  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}

