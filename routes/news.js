
const express = require('express')
const router = express.Router()
const http = require('http');

// Output values
var articleCount = 0;
var report = "";

// News router search
router.get('/:text', function (req, res) {

    // Set options
    const options = createOptions(req.params.text);

    // Connect to newsapi
    const newsReq = http.request(options, function(newsRes) {
        var output = "";

        // Get the entire website and set it as the output
        newsRes.on('data', function (chunk) {
            output = chunk;
        });

        // Create a page with its contents
        newsRes.on('end', function() {           
            //res.writeHead(newsRes.statusCode, {'content-type': 'text/html'});

            var input = "";

            // Check if input is empty or whitespace
            if (!req.params.text || !req.params.text.trim()) {
                input = -1;
            }
            else {
                input = parseNews(output);
            }

            // Check if the data was able to be parsed
            if (input != -1) {
                // Write the page and end the request
                res.send(input);
                //res.write(s);
                res.end();
            }
            // If not, mark the output as an error
            else {
                report = "There was a problem finding news. " +
                         "Please try again with less or less obscure keywords.";
            }

            // Debug: log the report
            console.log(report);
        }); 
    });

    // Debug error handling
    newsReq.on('error', (e) => {         
        console.error(e);     
    }); 

    // End the request
    newsReq.end();
})

function createOptions(query) {

    // Replace spaces with underscores (will be removed after processing)
    query = query.replace(/\s/g, "+");

    const options = {         
        hostname: 'newsapi.org',         
        port: 80,         
        path: '/v2/everything?',         
        method: 'GET',
        json: true
    } 
    
    const str = 'q=' + query +
                '&sortBy=popularity' +
                '&apiKey=' + '2c81e38cd1b24b08aa59f06e934d5486';

    options.path += str; 
    return options; 
}


function parseNews(toparse) {     
    let s = "";
    var json;

    try {
        json = JSON.parse(toparse);
    }
    // Catch if it failed to parse
    catch (e) {
        console.log("Failed to parse:" + e);
        return -1;
    }

    console.log(json);

    s += json;

    /*
    // Get and set the suburb name
    s += json.data[0].city_name + ", ";

    // Split "Country/City" into separate strings
    var location = json.data[0].timezone;
    var mid = location.indexOf("/");  
    var country = location.substr(0, mid);
    var city = location.substr(mid + 1);  

    // Remove underscores with spaces (New_York becomes New York)
    country = country.replace(/_/g, " ");
    city = city.replace(/_/g, " ");

    // Only include city name if different from area name (to prevent repeating)
    if (city != json.data[0].city_name) {
        s += city + ", ";
    }

    // Add the country name after the city name
    s += country + " is ";

    // Get and set the temperature
    temperature = json.data[0].temp;
    temperature = Math.round(temperature);
    s += temperature;

    if (tempType == "I") {
        s += "&deg;F."
    }
    else {
        s += "&deg;C."
    }
    */

    // Save and return the result
    report = s;
    return s; 
}
  
module.exports = router;