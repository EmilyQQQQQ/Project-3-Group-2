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






// Initialization function that populates dropdown, calls other chart functions, and initializes demographic info
function init(){
  // API endpoint to get the list of countries
  const countriesUrl = 'http://127.0.0.1:5000/getCountries';
  // Fetching countries data
  d3.json(countriesUrl).then(function(countries) {
    for (i=0; i<countries.length; i++){
      console.log(countries[i])
      d3.select("#countryDropdown").append("option").text(countries[i]);
    }
    // Extracting country names from data
    //let dropdownMenu = d3.select("#countryDropdown");

    // Populating dropdown menu with country names
    //countries.forEach((country) => dropdownMenu.append('option').text(country));
    
    // Calling chart functions with the initial sample ID
    // Assuming initialSampleId is set elsewhere in your code
    //BarChart(initialSampleId, data);
  });
}

let url = "http://127.0.0.1:5000/getData";
// Simple GET request
fetch(url)
  .then(response => {
    // Check if the request was successful (status code 2xx)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    // Parse the response JSON
    return response.json();
  })
  .then(data => {
    // Process the data
    console.log(data);
    console.log(data[0].coordinates.lon)
    console.log(data[0].coordinates.lat)
    console.log(data[0].country)
    console.log(data[0].day)
    console.log(data[0].month)
    console.log(data[0].year)
    console.log(data[0].i_d)
    console.log(data[0].eq_primary)
    console.log(data[0].focal_depth)
    console.log(data[0].location_name)
    console.log(data[0].deaths)
    console.log(data[0].injuries)
    console.log(data[0].damage_description)
    console.log(data[0].houses_destroyed)
    console.log(data[0].houses_damaged)
    let historicalData = data
    for (let i = 0; i < historicalData.length; i++) {
      let lat = [];
      // Check if coordinates object and lat property exist before pushing
      if (data[i].coordinates && data[i].coordinates.lat !== null) {
        lat.push(data[i].coordinates.lat);
      } else {
        // Handle the case where 'lat' is null or undefined
        console.error(`Latitude is null or undefined for item at index ${i}`);
      }
    }
    console.log(lat);
  })
  .catch(error => {
    // Handle errors
    console.error('Fetch error:', error);
  });

  init();