// Get client input after submit button




// Talk to weather/number.js to which return string info

// Add string info as content to webpage



function GetFacts() {
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

  // Query weather.js based on these three variables
  fetch(`/weather/${country}/${city}/${units}`)
    .then(res => res.json()
    .then(data => {

      // Debug alert stringified data
      //alert(JSON.stringify(data, null));

      // Debug alert full
      //alert(data.weather);

      // Set the fact text to the fact
      document.getElementById("result").textContent = data.weather;

      // Remove hidden id from new section
      document.getElementById("hidden-section").removeAttribute("hidden-section");
    })    
    .catch((error) => {
      console.log(error);
    })
  );
}

function GetNews() { 
    // Get fact textbox text
    var text = document.getElementById("result").value;

    // Debug: Alert the search text
    //alert(text);

    // Query news.js based on these three variables
    fetch(`/news/${text}`)
        .then(res => res.json()
        .then(data => {

        alert("data:" + data.news);
        // Debug alert stringified data
        //alert(JSON.stringify(data, null));

        // Debug alert full
        //alert(data.news);

        // Set the fact text to the fact
        var newsTextBox = document.getElementById("news");
        newsTextBox.value = data.news;

        // Remove hidden id from new section
      })    
      .catch((error) => {
        console.log(error);
      })
    );
}


document.getElementById("factButton").addEventListener("click", GetFacts);
document.getElementById("newsButton").addEventListener("click", GetNews);