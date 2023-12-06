// Assuming you have dropdown elements in your HTML with id "magnitudeDropdown", "timePeriodDropdown", and "countryDropdown"
const magnitudeDropdown = document.getElementById("magnitudeDropdown");
const timePeriodDropdown = document.getElementById("timePeriodDropdown");
const countryDropdown = document.getElementById("countryDropdown");

// Assuming you have a button in your HTML with id "fetchDataButton"
const fetchDataButton = document.getElementById("fetchDataButton");

fetchDataButton.addEventListener("click", () => {
    const selectedMagnitude = magnitudeDropdown.value;
    const selectedTimePeriod = timePeriodDropdown.value;
    const selectedCountry = countryDropdown.value;

    const url = `/getHistoricalEarthquakes?magnitude=${selectedMagnitude}&time_period=${selectedTimePeriod}&country=${selectedCountry}`;

    // Fetch data from the Flask server
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Process the data
            console.log(data);

            // Assuming there is a 'location' property in each earthquake object
            const contentDiv = document.getElementById("content");
            contentDiv.innerHTML = ""; // Clear previous content

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
});
