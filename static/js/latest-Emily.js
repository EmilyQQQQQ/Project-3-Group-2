// Assuming you have a dropdown element in your HTML with id "magnitudeDropdown"
const magnitudeDropdown = document.getElementById("magnitudeDropdown");

// Assuming you have a dropdown element in your HTML with id "timePeriodDropdown"
const timePeriodDropdown = document.getElementById("timePeriodDropdown");

// Assuming you have a button in your HTML with id "fetchDataButton"
const fetchDataButton = document.getElementById("fetchDataButton");

fetchDataButton.addEventListener("click", () => {
    const selectedMagnitude = magnitudeDropdown.value;
    const selectedTimePeriod = timePeriodDropdown.value;

    // Construct the URL for the USGS API
    const usgsApiUrl = `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/${selectedMagnitude}_${selectedTimePeriod}.geojson`;

    // Fetch data from the USGS API
    fetch(usgsApiUrl)
        .then(response => response.json())
        .then(data => {
            // Process the data
            console.log(data);

            // Assuming there is a 'features' property containing earthquake data
            const earthquakes = data.features;

            // Assuming there is a 'properties' property in each earthquake object with a 'place' field
            const contentDiv = document.getElementById("content");
            contentDiv.innerHTML = ""; // Clear previous content

            earthquakes.forEach(earthquake => {
                const location = earthquake.properties.place;

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
