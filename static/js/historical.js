let earthquakeData; // Global variable to store earthquake data


// Function to fetch earthquake data
function fetchEarthquakeData(selectedCountry) {
  // Get the input values for minYear, maxYear, minMagnitude, maxMagnitude, and id
  let minYear = document.getElementById("minYear").value;
  let maxYear = document.getElementById("maxYear").value;
  let minMagnitude = document.getElementById("fromMagnitude").value;
  let maxMagnitude = document.getElementById("toMagnitude").value;
  let id = document.getElementById("id").value;

  // Construct the API request URL with the selectedCountry, minYear, maxYear, minMagnitude, maxMagnitude, and id parameters
  let apiUrl = `http://127.0.0.1:5000/getData?country=${selectedCountry}&minYear=${minYear}&maxYear=${maxYear}&minMagnitude=${minMagnitude}&maxMagnitude=${maxMagnitude}&id=${id}`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      earthquakeData = data; // Set earthquakeData to the fetched data
      console.log(data);

      // Update charts and features with the fetched data
      updateHorizontalBarChart(selectedCountry);
      updateVerticalBarChart(selectedCountry);
      createFeatures(selectedCountry);
      // Zoom to the selected country if it has coordinates
      zoomToSelectedCountry(selectedCountry);
    })
    .catch(error => {
      console.error('Error fetching earthquake data:', error);
    });
}


// Call the function to fetch earthquake data
fetchEarthquakeData();

// Function to create a custom marker icon based on magnitude
function createCustomIcon(magnitude) {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${chooseColor(magnitude)};">${magnitude}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15]
  });
}
// Initialization function
function init() {
  const countriesUrl = 'http://127.0.0.1:5000/getCountries';

  // Fetching countries data
  fetch(countriesUrl)
    .then(response => response.json())
    .then(function (countries) {
      let dropdown = document.getElementById("countryDropdown");
      dropdown.innerHTML = ""; // Clear existing options
      for (let i = 0; i < countries.length; i++) {
        let option = document.createElement("option");
        option.text = countries[i];
        dropdown.add(option);
      }
    })
    .catch(error => {
      // Handle errors
      console.error('Fetch error:', error);
    });
}

// Event listener for the "Fetch Earthquakes" button
document.getElementById("fetchDataButton").addEventListener("click", function () {
  let selectedCountry = document.getElementById("countryDropdown").value;
  fetchEarthquakeData(selectedCountry);
  updateHorizontalBarChart(selectedCountry);
  updateVerticalBarChart(selectedCountry);
  createFeatures(selectedCountry);
});

// Event listener for the "Capture" button
document.getElementById("capturePageButton").addEventListener("click", capturePage);

// Define the function for dropdown change
function optionChanged(selectedCountry) {
  // Check if earthquakeData is defined
  if (earthquakeData) {
    let filteredData;

    // Check if the selected country is 'ALL'
    if (selectedCountry === 'ALL') {
      filteredData = earthquakeData;
    } else {
      // Filter the earthquake data based on the selected country
      filteredData = earthquakeData.filter(entry => entry.country === selectedCountry);
    }

    // Log the filtered data to the console for testing
    console.log("Filtered Data for", selectedCountry, ":", filteredData);

  } else {
    console.error('Earthquake data is not available.');
  }
}

// Function to zoom to the selected country
function zoomToSelectedCountry(selectedCountry) {
  if (myMap && selectedCountry !== 'ALL') {
    // Assuming you have coordinates available in your earthquakeData
    let countryCoordinates = getCountryCoordinates(selectedCountry);

    if (countryCoordinates) {
      // Set the map's center to the selected country's coordinates and zoom in
      myMap.setView(countryCoordinates, 5); // You can adjust the zoom level as needed
    } else {
      console.warn('Coordinates not available for the selected country:', selectedCountry);
    }
  }
}


// Function to get the coordinates of the selected country
function getCountryCoordinates(selectedCountry) {
  // Assuming you have a list of countries with corresponding coordinates in your earthquakeData
  // Adjust this based on your actual data structure
  let countryEntry = earthquakeData.find(entry => entry.country === selectedCountry);

  if (countryEntry && countryEntry.coordinates) {
    return [countryEntry.coordinates.lat, countryEntry.coordinates.lon];
  } else {
    return null;
  }
}

// Add a variable to keep track of the currently displayed data on the vertical bar chart
let isShowingDeaths = true;
let selectedChartType = 'deaths';

// Function to toggle between death counts and magnitudes
function toggleChart(selectedCountry) {
  // Toggle between 'deaths' and 'magnitude'
  isShowingDeaths = !isShowingDeaths;

  // Update the chart based on the selected country and the current state
  updateVerticalBarChart(selectedCountry);

  // Update the button text accordingly
  let toggleButton = document.getElementById('toggleButton');
  toggleButton.innerText = `Chart Option: ${isShowingDeaths ? 'Magnitude' : 'Deaths'}`;
}

// Update the vertical bar chart based on the current state (deaths or magnitudes)
function updateVerticalBarChart(selectedCountry) {
  // Check if earthquakeData is defined
  if (earthquakeData) {
    let filteredData;

    // Check if the selected country is 'ALL'
    if (selectedCountry === 'ALL') {
      filteredData = earthquakeData;
    } else {
      // Filter the earthquake data based on the selected country
      filteredData = earthquakeData.filter(entry => entry.country === selectedCountry);
    }

    // Sort the filtered data by date in the format "MM/DD/YYYY"
    let sortedData = filteredData.sort((a, b) => {
      let dateA = new Date(`${a.month}/${a.day}/${a.year}`);
      let dateB = new Date(`${b.month}/${b.day}/${b.year}`);
      return dateA - dateB;
    });

    // Extract dates and values for the chart based on the current state
    let x = sortedData.map(entry => new Date(entry.year, entry.month - 1, entry.day).toLocaleDateString());
    let y;
    let chartTitle;

    if (isShowingDeaths) {
      y = sortedData.map(entry => entry.deaths);
      chartTitle = `Earthquake Deaths Over Time in ${selectedCountry}`;
    } else {
      y = sortedData.map(entry => entry.eq_primary);
      chartTitle = `Earthquake Magnitudes Over Time in ${selectedCountry}`;
    }

    let data = [{
      type: 'bar',
      x: x,
      y: y,
      text: sortedData.map(entry => `ID: ${entry.i_d}<br>Depth: ${entry.focal_depth}<br>Location: ${entry.location_name}<br>Damages description: ${entry.damage_description}<br>Deaths: ${entry.deaths}<br>Injuries: ${entry.injuries}`),
      hoverinfo: 'text'
    }];
    
    let layout = {
      title: chartTitle,
      xaxis: { title: 'Date' },
      yaxis: isShowingDeaths ? { title: 'Number of Deaths' } : { title: 'Magnitude' },
      margin: { t: 100, r: 100, b: 150, l: 100 }, 
      height: 600, 
      hoverlabel: { 
        bgcolor: 'white',
        font: { size: 12 } 
      }
    };

    Plotly.newPlot('vbar', data, layout);
  } else {
    console.error('Earthquake data is not available.');
  }
}



// Define the function to update the horizontal bar chart
function updateHorizontalBarChart(selectedCountry) {
  // Check if earthquakeData is defined
  if (earthquakeData) {
    let filteredData;

    // Check if the selected country is 'ALL'
    if (selectedCountry === 'ALL') {
      filteredData = earthquakeData;
    } else {
      // Filter the earthquake data based on the selected country
      filteredData = earthquakeData.filter(entry => entry.country === selectedCountry);
    }

    // Sort the filtered data by magnitude in descending order
    let sortedData = filteredData.sort((a, b) => b.eq_primary - a.eq_primary);

    // Take the top ten earthquakes
    let topTenData = sortedData.slice(0, 10).reverse();

    // Extract magnitudes and locations for the chart
    let x = topTenData.map(entry => entry.eq_primary);
    let y = topTenData.map((entry, index) => `${index + 1}. ${entry.eq_primary}M in ${entry.country}`);
    let text = topTenData.map(entry => `ID: ${entry.i_d} <br>Depth: ${entry.focal_depth} <br>Location: ${entry.location_name}<br>Damages description: ${entry.damage_description} <br>Deaths: ${entry.deaths} <br>Injuries: ${entry.injuries}`);

     let data = [{
      type: 'bar',
      x: x,
      y: y,
      orientation: 'h',
      text: text,
      hoverinfo: 'text'
    }];
    
    let layout = {
      title: `Top Ten Earthquakes in ${selectedCountry} (Sorted by Magnitude)`,
      margin: { t: 50, r: 50, b: 150, l: 200 }, 
      height: 600, 
      hoverlabel: { 
        bgcolor: 'white',
        font: { size: 12 } 
      }
    };
    
    Plotly.newPlot('hbar', data, layout);

    Plotly.newPlot('hbar', data, layout);
  } else {
    console.error('Earthquake data is not available.');
  }
}

// Define the function to capture the page
function capturePage() {
  html2canvas(document.body).then(function (canvas) {
    let link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'page_screenshot.png';
    link.click();
  });
}

// Store our API endpoint as queryUrl.
let boundariesUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

function markerSize(magnitude) {
  return magnitude * 10000;
}

function chooseColor(depth) {
  if ((depth >= -10) && (depth < 10)) return "lime";
  else if ((depth >= 10) && (depth < 30)) return "greenyellow";
  else if ((depth >= 30) && (depth < 50)) return "yellow";
  else if ((depth >= 50) && (depth < 70)) return "orange";
  else if ((depth >= 70) && (depth < 90)) return "orangered";
  else return "red";
}

function createFeatures(selectedCountry) {
  // Check if earthquakeData is defined
  if (earthquakeData) {
    let filteredData;

    // Check if the selected country is 'ALL'
    if (selectedCountry === 'ALL') {
      filteredData = earthquakeData;
    } else {
      // Filter the earthquake data based on the selected country
      filteredData = earthquakeData.filter(entry => entry.country === selectedCountry);
    }

    if (filteredData.length === 0) {
      console.warn('No earthquake data for the selected country.');
      return;
    }

    // Create a GeoJSON object
    let geoJsonData = {
      type: 'FeatureCollection',
      features: filteredData.map(entry => ({
        type: 'Feature',
        properties: {
          location_name: entry.location_name,
          date: `${entry.month}/${entry.day}/${entry.year}`,
          magnitude: entry.eq_primary,
          depth: entry.focal_depth,
          damage_description: entry.damage_description,
          deaths: entry.deaths,
          injuries: entry.injuries,
        },
        geometry: {
          type: 'Point',
          coordinates: [entry.coordinates.lon, entry.coordinates.lat], // Adjust these based on your data
        },
      })),
    };

    function onEachFeature(feature, layer) {
      // Assuming 'feature' contains necessary properties like 'location_name', 'date', 'eq_primary', and 'focal_depth'
      layer.bindPopup(`<h3>Location: ${feature.properties.location_name}</h3>
                      <hr>
                      <p>Date: ${feature.properties.date}</p>
                      <p>Magnitude: ${feature.properties.magnitude}</p>
                      <p>Depth: ${feature.properties.depth}</p>
                      <p>Damage Description: ${feature.properties.damage_description}</p>
                      <p>Deaths: ${feature.properties.deaths}</p>
                      <p>Injuries: ${feature.properties.injuries}</p>`);
    }

    // Create a GeoJSON layer that contains the features array on the earthquakeData object.
    // Run the onEachFeature function once for each piece of data in the array.
    let markers = L.markerClusterGroup();
    let earthquakes = L.geoJSON(geoJsonData, {
      onEachFeature: onEachFeature,
      pointToLayer: function (feature, latlng) {
        // Assuming 'feature' contains necessary properties like 'coordinates', 'eq_primary', 'focal_depth'
        return L.marker(latlng)
          .bindPopup(`<h3>Location: ${feature.properties.location_name}</h3>
                      <hr>
                      <p>Date: ${feature.properties.date}</p>
                      <p>Magnitude: ${feature.properties.magnitude}</p>
                      <p>Depth: ${feature.properties.depth}</p>
                      <p>Damage Description: ${feature.properties.damage_description}</p>
                      <p>Deaths: ${feature.properties.deaths}</p>
                      <p>Injuries: ${feature.properties.injuries}</p>`);
      },
    });

    // Add the GeoJSON layer to the marker cluster group
    markers.addLayer(earthquakes);

    // Send our marker cluster group to the createMap function.
    createMap(markers);
  } else {
    console.error('Earthquake data is not available.');
  }
}




let myMap; // Declare myMap globally

function createMap(earthquakes) {
  // Check if the map already exists
  if (myMap) {
    // If the map exists, remove it before creating a new one
    myMap.remove();
  }

  // Create the base layers.
  let satellite = L.tileLayer('https://api.mapbox.com/styles/v1/{style}/tiles/{z}/{x}/{y}?access_token={access_token}', {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    style: 'mapbox/satellite-v9',
    access_token: access_token
  });

  let grayscale = L.tileLayer('https://api.mapbox.com/styles/v1/{style}/tiles/{z}/{x}/{y}?access_token={access_token}', {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    style: 'mapbox/light-v11',
    access_token: access_token
  });
  let markers = L.markerClusterGroup();

  // Create layer for tectonic plates.
  let tectonics = L.layerGroup();
  d3.json(boundariesUrl).then(function (data) {
    console.log(data);
    L.geoJSON(data, {
      color: 'orange',
      weight: 2
    }).addTo(tectonics);
  });

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
  myMap = L.map("map", {
    center: [30, 0],
    zoom: 2,
    layers: [grayscale, earthquakes, tectonics]
  });


  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}


function capturePage() {
  // Capture the entire page
  html2canvas(document.body).then(function (canvas) {
    // Create a temporary link and trigger a click to download the image
    var link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'page_screenshot.png';
    link.click();
  });
}

// Call init function on page load
document.addEventListener("DOMContentLoaded", init);
