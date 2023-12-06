// Assuming you have dropdown elements in your HTML with id "latestMagnitudeDropdown", "latestTimePeriodDropdown", "latestCountryDropdown", "historicalMagnitudeDropdown", "historicalTimePeriodDropdown", and "historicalCountryDropdown"
const latestMagnitudeDropdown = document.getElementById("latestMagnitudeDropdown");
const latestTimePeriodDropdown = document.getElementById("latestTimePeriodDropdown");
const latestCountryDropdown = document.getElementById("latestCountryDropdown");

const historicalMagnitudeDropdown = document.getElementById("historicalMagnitudeDropdown");
const historicalTimePeriodDropdown = document.getElementById("historicalTimePeriodDropdown");
const historicalCountryDropdown = document.getElementById("historicalCountryDropdown");

// Assuming you have a button in your HTML with id "fetchDataButton"
const fetchDataButton = document.getElementById("fetchDataButton");

// Assuming you have a div in your HTML with id "content"
const contentDiv = document.getElementById("content");

// Event listener for fetching data when any dropdown changes
fetchDataButton.addEventListener("click", () => {
    fetchData(latestMagnitudeDropdown, latestTimePeriodDropdown, latestCountryDropdown);
    fetchData(historicalMagnitudeDropdown, historicalTimePeriodDropdown, historicalCountryDropdown);
});

// Function to fetch earthquake data
function fetchData(magnitudeDropdown, timePeriodDropdown, countryDropdown) {
    const selectedMagnitude = magnitudeDropdown.value;
    const selectedTimePeriod = timePeriodDropdown.value;
    const selectedCountry = countryDropdown.value;

    const url = `/getData?magnitude=${selectedMagnitude}&time_period=${selectedTimePeriod}&country=${selectedCountry}`;

    // Fetch data from the Flask server
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Process the data
            console.log(data);

            // Clear previous content
            contentDiv.innerHTML = "";

            // Assuming there is a 'location' property in each earthquake object
            data.forEach(earthquake => {
                const location = earthquake.location;

                const paragraph = document.createElement("p");
                paragraph.textContent = `Location: ${location}`;

                contentDiv.appendChild(paragraph);
            });
        })
        .catch(error => {
            // Handle errors
            console.error('Fetch error:', error);
        });
}
