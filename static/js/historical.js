// historical.js

let earthquakeData; // Global variable to store earthquake data

// Function to fetch earthquake data
function fetchEarthquakeData() {
  fetch('http://127.0.0.1:5000/getData')
    .then(response => response.json())
    .then(data => {
      earthquakeData = data; // Set earthquakeData to the fetched data
      console.log(data);
    })
    .catch(error => {
      console.error('Error fetching earthquake data:', error);
    });
}

// Call the function to fetch earthquake data
fetchEarthquakeData();

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
});

// Event listener for the "Capture" button
document.getElementById("capturePageButton").addEventListener("click", capturePage);

// Define the function for dropdown change
function optionChanged(selectedCountry) {
  // Check if earthquakeData is defined
  if (earthquakeData) {
    // Filter the earthquake data based on the selected country
    let filteredData = earthquakeData.filter(entry => entry.country === selectedCountry);

    // Log the filtered data to the console for testing
    console.log("Filtered Data for", selectedCountry, ":", filteredData);

    // Now you can perform further actions with the filtered data
    // For example, you can update a chart or display information on the webpage
    // This is where you can integrate your visualization code

    // Update the horizontal bar chart
    updateHorizontalBarChart(selectedCountry);
  } else {
    console.error('Earthquake data is not available.');
  }
}

// Define the function to update the horizontal bar chart
function updateHorizontalBarChart(selectedCountry) {
  // Check if earthquakeData is defined
  if (earthquakeData) {
    // Filter the earthquake data based on the selected country
    let filteredData = earthquakeData.filter(entry => entry.country === selectedCountry);

    // Sort the filtered data by magnitude in descending order
    let sortedData = filteredData.sort((a, b) => b.eq_primary - a.eq_primary);

    // Take the top ten earthquakes
    let topTenData = sortedData.slice(0, 10).reverse();

    // Extract magnitudes and locations for the chart
    let magnitudes = topTenData.map(entry => entry.eq_primary);
    let locations = topTenData.map(entry => entry.location_name);

    for (i=0; i<locations.length; i++){
      rank = locations.length - i
      parts = locations[i].split(",")
      lastpart = parts[parts.length - 1]
      locations[i] = rank.toString() + ". " +  lastpart
  }

    // Create a horizontal bar chart using Plotly
    let data = [{
      type: 'bar',
      x: magnitudes,
      y: locations,
      orientation: 'h',
    }];

    let layout = {
      title: `Top Ten Earthquakes in ${selectedCountry} (Sorted by Magnitude)`,
      xaxis: { title: 'Magnitude' },
      yaxis: { title: 'Location' },
      margin: {t:0,r:0,b:0,l:200}
    };

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

// Call init function on page load
document.addEventListener("DOMContentLoaded", init);
