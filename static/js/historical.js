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

// Fetching data using D3 and logging it to the console
d3.json(url).then(function(data){
  console.log(data);
});

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

