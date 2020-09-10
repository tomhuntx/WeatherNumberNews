// Get client input after submit button




// Talk to weather/number.js to which return string info

// Add string info as content to webpage

/*
.then((data) => {
  const parent = event.target.parentElement;
  const p = document.createElement("p");
  p.textContent = data.summary;
  parent.append(p);
})*/

/*
async function getFacts() {
  
  var city = document.getElementById("city").value;
  var country = document.getElementById("country").value;
  var units = "M";

  var a = await fetch(`/fact/${country}/${city}/${units}`)
    .then((data) => {
      console.log("a");
      const factText = document.getElementById("fact");
      factText.textContent = data;
      console.log(data);
      alert(data.json());
    })
    .catch((error) => {
      console.log(error);
    })

  alert(a);
}*/

// function call returns a promise (expected key string ex."Zftx5a")
//trailer(id, function(result){return result;})

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
  fetch(`/weather/${country}/${city}/${units}`).then(res =>
    res.json().then(data => {

      // Debug alert stringified data
      //alert(JSON.stringify(data, null));

      // Debug alert full
      //alert(data.weather);

      // Set the fact text to the fact
      const factText = document.getElementById("fact");
      factText.textContent = data.weather;

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
    var text = document.getElementById("fact").textContent;

    // Query news.js based on these three variables
    fetch(`/news?q=${text}`).then(res =>
      res.json().then(data => {

        // Debug alert stringified data
        //alert(JSON.stringify(data, null));

        // Debug alert full
        //alert(data.news);

        // Set the fact text to the fact
        const factText = document.getElementById("news");
        factText.textContent = data.news;

        // Remove hidden id from new section
        document.getElementById("hidden-section").removeAttribute("hidden-section");
      })    
      .catch((error) => {
        console.log(error);
      })
    );
}


document.getElementById("factButton").addEventListener("click", GetFacts);
document.getElementById("newsButton").addEventListener("click", GetNews);
