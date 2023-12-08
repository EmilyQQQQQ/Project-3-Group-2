let myMap;
let sortedIndices = [];
let chartExists = false; // Track if the chart already exists

// Assuming you have a dropdown element in your HTML with id "magnitudeDropdown"
let magnitudeDropdown = document.getElementById("magnitudeDropdown");

// Assuming you have a dropdown element in your HTML with id "timePeriodDropdown"
let timePeriodDropdown = document.getElementById("timePeriodDropdown");

// Assuming you have a button in your HTML with id "fetchDataButton"
let fetchDataButton = document.getElementById("fetchDataButton");

fetchDataButton.addEventListener("click", () => {
    let selectedMagnitude = magnitudeDropdown.value;
    let selectedTimePeriod = timePeriodDropdown.value;

    let usgsApiTemplate = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/{MAGNITUDE}_{TIME_PERIOD}.geojson";
    let usgsApiUrl = usgsApiTemplate
        .replace("{MAGNITUDE}", selectedMagnitude)
        .replace("{TIME_PERIOD}", selectedTimePeriod);

    fetch(usgsApiUrl)
        .then(response => {
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('No earthquakes found for the specified criteria');
                } else {
                    throw new Error('Network response was not ok');
                }
            }
            return response.json();
        })
        .then(data => {
            console.log('Data received:', data);

            let earthquakes = data.features;
            let contentDiv = document.getElementById("content");
            contentDiv.innerHTML = "";

            if (earthquakes.length === 0) {
                contentDiv.textContent = "No earthquakes found for the specified criteria.";
            } else {
                // Perform a GET request to the query URL
                d3.json(usgsApiUrl).then(function (data) {
                    console.log(data.features);

                    // Call createFeatures with the new data
                    createFeatures(data.features);

                    // Call BarChart with the new data
                    BarChart(data.features);
                });
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
});

function BarChart(data) {
    // Sort the data based on magnitude in descending order
    data.sort((a, b) => b.properties.mag - a.properties.mag);

    // Take the top 10 earthquakes
    let top10Data = data.slice(0, 10);

    let locations = top10Data.map(entry => entry.properties.place);
    let magnitudes = top10Data.map(entry => entry.properties.mag);
    let depths = top10Data.map(entry => entry.geometry.coordinates[2]);

    let trace1 = {
        y: locations.reverse(),
        x: magnitudes.reverse(),
        text: depths.reverse(),
        type: 'bar',
        orientation: 'h'
    };

    let layout1 = {
        title: "Top 10 Earthquakes",
        hovermode: "closest"
    };

    // Check if the chart already exists
    if (!chartExists) {
        // If it doesn't exist, create a new chart
        Plotly.newPlot('hbar', [trace1], layout1);
        chartExists = true; // Set the flag to true
    } else {
        // If it exists, update the existing chart
        Plotly.react('hbar', [trace1], layout1);
    }
}


    // Store our API endpoint as queryUrl.
    let boundariesUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

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
  
      // Create layer for tectonic plates.
      let tectonics = L.layerGroup();
      d3.json(boundariesUrl).then(function (data) {
          console.log(data);
          L.geoJSON(data, {
              color: 'orange',
              weight: 2
          }).addTo(tectonics)
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
          center: [37.09, -95.71],
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