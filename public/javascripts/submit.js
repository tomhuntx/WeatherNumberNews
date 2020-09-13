// Get client input after submit button




// Talk to weather/number.js to which return string info

// Add string info as content to webpage



function GetTemperature() {
  // Get city and country values
  var city = document.getElementById("city").value;
  var country = document.getElementById("country").value;
  var units = "";

  // Assign units
  if (document.getElementById("f").checked) {
    units = "I";
  }
  else {
    units = "M";
  }

  // Don't execute fetch if no text is given
  if (!city || !city.trim() || !country || !country.trim()) {
    return -1;
  }

  // Query weather.js based on these three variables
  fetch(`/weather/${country}/${city}/${units}`)
    .then(res => res.json()
    .then(data => {

      // Debug alert stringified data
      //alert(JSON.stringify(data, null));

      // Debug alert full weather data
      //alert(data.weather);

      // Check if returned string (error) or correct array
      if (typeof data.weather === 'string') {
        document.getElementById("temp-result").innerHTML = data.weather;
      }
      else {
          GetFact(data.weather[1]);

          // Set the fact text to the fact
          document.getElementById("temp-result").innerHTML = data.weather[0];
        }
    })    
    .catch((error) => {
      console.log(error);
    })
  );
}

// Get AND Set the fact from a given temperature
function GetFact(temperature) {

  // Query weather.js based on these three variables
  fetch(`/number/${temperature}`)
    .then(res => res.json()
    .then(data => {

      // Debug alert stringified data
      //alert(JSON.stringify(data, null));

      // Debug alert fact
      //alert(data.fact);

      // Set the fact text to the fact
      var factText = document.getElementById("fact-result");
      factText.textContent = data.fact;

      // Update textarea size
      factText.style.height = "";
      factText.style.height = factText.scrollHeight + "px";
    })    
    .catch((error) => {
      console.log(error);
    })
  );
}

function GetNews() { 
    // Get textbox text and limit it to a length of 19
    var textAreaText = document.getElementById("fact-result").value;
    var trimmedText = textAreaText.substring(0, 18);

    // Debug: Alert the search text
    //alert(trimmedText);

    // Query news.js based on the given text
    fetch(`/news/${trimmedText}`)
        .then(res => res.json()
        .then(data => {

        var finalText = "";

        // Check if an error is returned and print the error if so
        if (data.error) {
          finalText = data.error;
        }
        // Otherwise, build a list of news articles from the retrieved data
        else {
          finalText = data.news;
        }
        
        // Debug: alert all data
        //alert(data.news);

        // Set the list (or error) to the html of a set section
        var newsTextBox = document.getElementById("newstext");
        newsTextBox.innerHTML = finalText;
      })    
      .catch((error) => {
        console.log(error);
      })
    );
}


document.getElementById("factButton").addEventListener("click", GetTemperature);
document.getElementById("newsButton").addEventListener("click", GetNews);
