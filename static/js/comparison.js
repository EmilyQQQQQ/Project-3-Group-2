//JESUS' WORK
//Configuration for the comparison menu
//All the elements are independent there is no problem if the user miss one or some of them
// From Year: Box
// To Year: Box
// From Magnitude: BOx
// To Magnitude: Box
// Country: dropdown
// ID: Box
const url = "http://127.0.0.1:5000/getData?minMagnitude=5&maxYear=1700";
let data; // Declare data as a global variable

// Promise Pending
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);

d3.json(url).then(responseData => {
    // Assign the data to the global variable
    data = responseData;

    // Extract the sample data
    const samples = data.samples;
  
    // Create the dropdown menu
    const dropdown = d3.select("#selDataset");
    samples.forEach(sample => {
      dropdown
        .append("option")
        .text(sample.id)
        .property("value", sample.id);
    });

    // Initial sample ID
    const initialSampleId = samples[0].id;

    //Update the bar chart based on the initial sample ID
    optionChanged(initialSampleId);
});

// Function to update the bar chart based on the selected sample ID
function optionChanged(selectedSampleId) {
    // Find the selected sample
    const selectedSample = data.samples.find(sample => sample.id === selectedSampleId);
    const selectedMetadata = data.metadata.find(meta => meta.id === parseInt(selectedSampleId));

    //update Bar chart
    updateBarChart(selectedSample);
    //update Bubble chart
    updateBubbleChart(selectedSample);
    // Display metadata
    displayMetadata(selectedMetadata);
    createGaugeChart(selectedMetadata);
}

// Function to update the bar chart based on the selected sample
function updateBarChart(selectedSample){
// Get the OTU ids and corresponding sample values
const otuIds = selectedSample.otu_ids.slice(0, 10).reverse();
const sampleValues = selectedSample.sample_values.slice(0, 10).reverse();

// Create a bar chart using Plotly
let trace = {
  x: sampleValues,
  y: otuIds.map(id => `OTU ${id}`),
  type: 'bar',
  orientation: 'h',
};

let plotData = [trace];

let layout = {
  title: `Top 10 OTU IDs Based on Sample Values for Sample ${selectedSample} (Descending Order)`,
  xaxis: { title: 'Sample Values' },
  yaxis: { title: 'OTU ID' },
};

Plotly.newPlot('bar', plotData, layout);

}



////EMILYS'S WORK

// // Assuming you have dropdown elements in your HTML with id "latestMagnitudeDropdown", "latestTimePeriodDropdown", "latestCountryDropdown", "historicalMagnitudeDropdown", "historicalTimePeriodDropdown", and "historicalCountryDropdown"
// const latestMagnitudeDropdown = document.getElementById("latestMagnitudeDropdown");
// const latestTimePeriodDropdown = document.getElementById("latestTimePeriodDropdown");
// const latestCountryDropdown = document.getElementById("latestCountryDropdown");

// const historicalMagnitudeDropdown = document.getElementById("historicalMagnitudeDropdown");
// const historicalTimePeriodDropdown = document.getElementById("historicalTimePeriodDropdown");
// const historicalCountryDropdown = document.getElementById("historicalCountryDropdown");

// // Assuming you have a button in your HTML with id "fetchDataButton"
// const fetchDataButton = document.getElementById("fetchDataButton");

// // Assuming you have a div in your HTML with id "content"
// const contentDiv = document.getElementById("content");

// // Event listener for fetching data when any dropdown changes
// fetchDataButton.addEventListener("click", () => {
//     fetchData(latestMagnitudeDropdown, latestTimePeriodDropdown, latestCountryDropdown);
//     fetchData(historicalMagnitudeDropdown, historicalTimePeriodDropdown, historicalCountryDropdown);
// });

// // Function to fetch earthquake data
// function fetchData(magnitudeDropdown, timePeriodDropdown, countryDropdown) {
//     const selectedMagnitude = magnitudeDropdown.value;
//     const selectedTimePeriod = timePeriodDropdown.value;
//     const selectedCountry = countryDropdown.value;

//     const url = `/getData?magnitude=${selectedMagnitude}&time_period=${selectedTimePeriod}&country=${selectedCountry}`;

//     // Fetch data from the Flask server
//     fetch(url)
//         .then(response => response.json())
//         .then(data => {
//             // Process the data
//             console.log(data);

//             // Clear previous content
//             contentDiv.innerHTML = "";

//             // Assuming there is a 'location' property in each earthquake object
//             data.forEach(earthquake => {
//                 const location = earthquake.location;

//                 const paragraph = document.createElement("p");
//                 paragraph.textContent = `Location: ${location}`;

//                 contentDiv.appendChild(paragraph);
//             });
//         })
//         .catch(error => {
//             // Handle errors
//             console.error('Fetch error:', error);
//         });
// }
