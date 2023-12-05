// Assuming you have a dropdown element in your HTML with id "magnitudeDropdown"
const magnitudeDropdown = document.getElementById("magnitudeDropdown");

// Assuming you have a button in your HTML with id "fetchDataButton"
const fetchDataButton = document.getElementById("fetchDataButton");

fetchDataButton.addEventListener("click", () => {
    const selectedMagnitude = magnitudeDropdown.value;

    const url = "/historical-Emily.html/getLatestEarthquakes?magnitude=" + selectedMagnitude + "&time_period=7";

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
