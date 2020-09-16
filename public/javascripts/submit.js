/*
* Client-Side
* All functions are called by buttons set in the client-side html
*/


// Fetch and set a temperature from the city, country, and units inputs
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
      alert("There was a problem getting the temperature. Please try again");
    })
  );
}

// Fetch and set a fact based on a given temperature
function GetFact(temperature) {

  if (temperature < 0) {
    temperature *= -1;
  }

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
      factText.value = data.fact;

      // Update textarea size
      factText.style.height = "";
      factText.style.height = factText.scrollHeight + "px";
    })    
    .catch((error) => {
      alert("There was a problem getting the temperature. Please try again");
    })
  );
}

// Fetch and set news data with the text from the text area as a query
function GetNews() { 
    // Get textbox text and limit it to a length of 18 to prevent no results
    var textAreaText = document.getElementById("fact-result").value;
    //var trimmedText = textAreaText.substring(0, 2) + " ";
    var trimmedText = textAreaText.substr(-21);

    // Remove full stop if it has one
    if (trimmedText.length > 1) {
      if (trimmedText.endsWith(".")) {
        var trimmedText = trimmedText.slice(0, -1);
      }
    }

    // Debug: Alert the search text
    //alert(trimmedText);

    // Check if input is empty or whitespace and cause an error if so
    if (!trimmedText || !trimmedText.trim()) {
      trimmedText = "-";
      // Set the list (or error) to the html of a set section
      document.getElementById("newstext").innerHTML = "The search query cannot be empty. " +
                                                      "Please enter some text.";
      // End the request
      return -1;
    }

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
        alert("There was a problem getting the news. Please try again");
      })
    );
}

// Get a fact from a random number, then generate news from it
function GetFactNews() { 
  let randomNum = Math.floor(Math.random() * 100);

  // Query weather.js based on these three variables
  fetch(`/number/${randomNum}`)
    .then(res => res.json()
    .then(data => {

      // Debug alert stringified data
      //alert(JSON.stringify(data, null));

      // Debug alert fact
      //alert(data.fact);

      // Set the fact text to the fact
      var factText = document.getElementById("fact-result");
      factText.value = data.fact;

      // Update textarea size
      factText.style.height = "";
      factText.style.height = factText.scrollHeight + "px";

      GetNews();
    })    
    .catch((error) => {
      alert("There was a problem getting the temperature. Please try again");
    })
  );
}

document.getElementById("factButton").addEventListener("click", GetTemperature);
document.getElementById("newsButton").addEventListener("click", GetNews);
document.getElementById("newFactButton").addEventListener("click", GetFactNews);
