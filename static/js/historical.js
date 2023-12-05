url = "http://127.0.0.1:5000/getData"

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
  })
  .catch(error => {
    // Handle errors
    console.error('Fetch error:', error);
  });