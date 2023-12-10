//JESUS' WORK
//Configuration for the comparison menu
//All the elements are independent there is no problem if the user miss one or some of them
// From Year: Box
// To Year: Box
// From Magnitude: BOx
// To Magnitude: Box
// Country: dropdown
// ID: Box
// const url = "http://127.0.0.1:5000/getData?minMagnitude=5&maxYear=1700";
// let data; // Declare data as a global variable


let url = "http://127.0.0.1:5000/getData";
const countriesUrl = 'http://127.0.0.1:5000/getCountries';

// // Promise Pending
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);

// SET 1: Initialization function that populates dropdown, calls other chart functions, and initializes demographic info
function initSet1(){
  // API endpoint to get the list of countries
  
  // Fetching countries data
  d3.json(countriesUrl).then(function(countries) {
    for (i=0; i<countries.length; i++){
      console.log(countries[i])
      d3.select("#countryDropdown").append("option").text(countries[i]);
    }
  });
}

// SET 2 : Initialization function that populates dropdown, calls other chart functions, and initializes demographic info
function initSet2(){
  // API endpoint to get the list of countries
  
  // Fetching countries data
  d3.json(countriesUrl).then(function(countries) {
    for (i=0; i<countries.length; i++){
      console.log(countries[i])
      d3.select("#countryDropdown2").append("option").text(countries[i]);
    }
  });
}


//Running the funcitions to get countries from two sets of data
initSet1();
initSet2();

//Getting the data of the first set 
function getData1() {
  
  var selection = document.getElementById("countryDropdown");
  var country = selection.options[selection.selectedIndex].text;
  var minYear = parseFloat(document.getElementById("minYear").value);
  var maxYear = parseFloat(document.getElementById("maxYear").value);
  var fromMagnitude = parseFloat(document.getElementById("fromMagnitude").value);
  var toMagnitude = parseFloat(document.getElementById("toMagnitude").value);
  var eq_id = parseInt(document.getElementById("id").value);
 
  
  firstValue = true;

  if (country) {
    if (firstValue) {
      url = url + "?country=" + country;
      firstValue ^= true;
      }
    else
    {
      url = url + "&country=" + country;
    }
  }
  console.log(firstValue);

  if (minYear) {
    if (firstValue) {
      console.log("Here miniyear if");
      url = url + "?minYear=" + minYear;
      firstValue ^= true;
      }
    else
    {
      console.log("Here miniyear else:");
      url = url + "&minYear=" + minYear;
    }
  }

  if (maxYear) {
    if (firstValue) {
      url = url + "?maxYear=" + maxYear;
      firstValue ^= true;
      }
    else
      {
      url = url + "&maxYear=" + minYear;
      }
    }
    
    if (fromMagnitude) {
      if (firstValue) {
        url = url + "?minMagnitude=" + fromMagnitude;
        firstValue ^= true;
        }
      else
        {
        url = url + "&minMagnitude=" + fromMagnitude;
        }
      }

      if (toMagnitude) {
        if (firstValue) {
          url = url + "?maxMagnitude=" + toMagnitude;
          firstValue ^= true;
          }
        else
          {
          url = url + "&maxMagnitude=" + toMagnitude;
          }
        }

        if (eq_id) {
          if (firstValue) {
            url = url + "?id=" + eq_id;
            firstValue ^= true;
            }
          else
            {
            url = url + "&id=" + eq_id;
            }
          }

  // Make a request to the Flask server using D3
  //d3.json("http://127.0.0.1:5000/getData?minYear=" + minYear + "&maxYear=" + maxYear)
  d3.json(url).then(function(data) {    
                //createPieChart(data);
                createPieChart(data, 'Pie Chart Set 1');
                url = "http://127.0.0.1:5000/getData";
            })       
      .catch(function(error) {
          console.error("Error fetching data:", error);
      });
    }//End of getData1()

    function getData2() {
  
      var selection = document.getElementById("countryDropdown2");
      var country = selection.options[selection.selectedIndex].text;
      var minYear = parseFloat(document.getElementById("minYear2").value);
      var maxYear = parseFloat(document.getElementById("maxYear2").value);
      var fromMagnitude = parseFloat(document.getElementById("fromMagnitude2").value);
      var toMagnitude = parseFloat(document.getElementById("toMagnitude2").value);
      var eq_id = parseInt(document.getElementById("id2").value);
     
      
      firstValue = true;
    
      if (country) {
        if (firstValue) {
          url = url + "?country=" + country;
          firstValue ^= true;
          }
        else
        {
          url = url + "&country=" + country;
        }
      }
      console.log(firstValue);
    
      if (minYear) {
        if (firstValue) {
          console.log("Here miniyear if");
          url = url + "?minYear=" + minYear;
          firstValue ^= true;
          }
        else
        {
          console.log("Here miniyear else:");
          url = url + "&minYear=" + minYear;
        }
      }
    
      if (maxYear) {
        if (firstValue) {
          url = url + "?maxYear=" + maxYear;
          firstValue ^= true;
          }
        else
          {
          url = url + "&maxYear=" + minYear;
          }
        }
        
        if (fromMagnitude) {
          if (firstValue) {
            url = url + "?minMagnitude=" + fromMagnitude;
            firstValue ^= true;
            }
          else
            {
            url = url + "&minMagnitude=" + fromMagnitude;
            }
          }
    
          if (toMagnitude) {
            if (firstValue) {
              url = url + "?maxMagnitude=" + toMagnitude;
              firstValue ^= true;
              }
            else
              {
              url = url + "&maxMagnitude=" + toMagnitude;
              }
            }
    
            if (eq_id) {
              if (firstValue) {
                url = url + "?id=" + eq_id;
                firstValue ^= true;
                }
              else
                {
                url = url + "&id=" + eq_id;
                }
              }
    
      // Make a request to the Flask server using D3
      d3.json(url).then(function(data) {
        //Creation and update of the Piechart   
                    //createPieChart(data);
                    createPieChart(data, 'Pie Chart Set 2');
                    createTimeSeriesChart(data, 'time-series-chart2',minYear,maxYear);
                    url = "http://127.0.0.1:5000/getData";
                })       
          .catch(function(error) {
              console.error("Error fetching data:", error);
          });
        }//end of getData2()




        //Creation of a Piechart
  
    function createPieChart(data, targetElementId) {
      // Calculate means
      const meanDeaths = d3.mean(data, d => d.deaths);
      const meanMagnitude = d3.mean(data, d => d.eq_primary);
  
      // Create data for Plotly pie chart
      const pieData = [{
          values: [meanDeaths, meanMagnitude],
          labels: ['Mean Deaths', 'Mean Magnitude'],
          type: 'pie'
      }];
  
      // Define layout for Plotly chart
      const layout = {
          height: 400,
          width: 400,
          title: `Mean Deaths and Mean\nMagnitude Earthquake - ${targetElementId}`,
          font: {
            size: 8,
          bold: true,}   // Adjust the font size as needed 
        };
  
      // Plot the pie chart using Plotly
      Plotly.react(targetElementId, pieData, layout);
  }
  
