const express = require('express')
const router = express.Router()
const http = require('http');

// Output values
var temperature = 0;
var report = "";
var tempType = "C";

// Get fact
var fact = "Fact not found!";

// Weather JSON search
router.get('/', function (req, res) {

    // Set options
    const options = createOptions(req.query.city, req.query.country, req.query.units);

    // Connect to numbersapi
    const weatReq = http.request(options, function(waetRes) {
        var output = "";

        // Get the entire website and set it as the output
        waetRes.on('data', function (chunk) {
            output = chunk;
        });

        // Create a page with its contents
        waetRes.on('end',function() {           
            res.writeHead(waetRes.statusCode, {'content-type': 'text/html'});

            var temp = "";

            // Check if input is empty or whitespace
            if (!req.query.city || !req.query.city.trim() || !req.query.country || 
                !req.query.country.trim()) {
                temp = -1;
            }
            else {
                temp = parseTemperature(output);
            }

            // Check if the data was able to be parsed
            if (temp != -1) {
                // Generate fact from temperature
                NumberFactGenerator(temperature, temp, res);
            }
            // If not, mark the output as an error
            else {
                report = "There was a problem finding this location. " +
                         "Please try again with different keywords, such as \"USA\" instead of \"America\".";
                temperature = 0;
            }

            // Debug: log the report
            //console.log(report);
        }); 
    });

    // Error handling
    weatReq.on('error', (e) => {         
        console.error(e);     
    }); 

    // End the request
    weatReq.end();
})

function createOptions(city, country, units) {

    // Replace spaces with underscores (will be removed after processing)
    city = city.replace(/\s/g, "_");
    country = country.replace(/\s/g, "_");

    // Save temperature units
    tempType = units;

    const options = {         
        hostname: 'api.weatherbit.io',         
        port: 80,         
        path: '/v2.0/current?',         
        method: 'GET'    
    } 
 
    const str = '&city=' + city +     
                '&country=' + country +    
                '&units=' + units + 
                '&key=' + 'e356802b7eb143b09940bc0d88115c1f';

    options.path += str;     
    return options; 
}

function parseTemperature(toparse) {     
    let s = "";
    var json;

    // Try to parse
    try {
        json = JSON.parse(toparse);
    }
    // Catch if it failed to parse
    catch (e) {
        return -1;
    }

    s += "The temperature right now in "

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

    // Save and return the result
    report = s;
    return s; 
}

function NumberFactGenerator(number, report, res) {
    // Set number options
    const numOptions = createNumOptions(number);
    
    // Connect to numbersapi
    var numReq = http.request(numOptions, function(numRes) {
        
        // Get the entire website and set it as the output
        numRes.on('data', function (chunk) {

            // Set fact
            fact = chunk;
            //console.log('Fact: ' + fact);

            // Create the webpage
            const s = createPage(report, fact);

            // Write the page and end the request
            res.write(s);
            res.end();
        });
    });

    // Error handling
    numReq.on('error', (e) => {         
        console.error(e);     
    }); 

    // End the request
    numReq.end();
}

function createPage(givenReport, fact) {

    //Headers and opening body, then main content and close     
    const str = '<!DOCTYPE html>' +         
                '<html><head><title>Weather Report</title></head>' +         
                '<body>' + '<h2>Result</h2>' +         
                givenReport + " " + fact + 
                '<form action="/news" method="get">' +
                `<input type="text" name="q" value="${fact}" required />` +
                '<input type="submit" value="Submit" /></form>' +
                '</body></html>';     

    return str; 
}

function createNumOptions(number) {
    var options = {
        host: 'numbersapi.com',
        port: 80,
        path: '/' + number,
        method: 'GET'    
    };

    return options;
}

  
module.exports = router;