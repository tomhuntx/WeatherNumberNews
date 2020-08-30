const express = require('express')
const router = express.Router()
const http = require('http');
const cons = require('consolidate');

var output = '';
var temp = 0;
var report = '';

// Weather JSON search
router.get('/country=:country&postcode=:postcode', function (req, res) {

    // Set options
    const options = createOptions(req.params.country, req.params.postcode);
    
    // Connect to numbersapi
    var weatReq = http.request(options, function(waetRes) {

        // Get the entire website and set it as the output
        waetRes.on('data', function (chunk) {
            output = chunk;

            // Write weather to the console
            //console.log('JSON weather data: ' + chunk);
        });

        // Create a page with its contents
        waetRes.on('end',function() {           
            res.writeHead(waetRes.statusCode, {'content-type': 'text/html'});
            
            const temp = parseTemperature(output);

            const s = createPage(temp);

            // Write the page and end the request
            res.write(s);
            res.end();
        }); 
    });

    // Error handling
    weatReq.on('error', (e) => {         
        console.error(e);     
    }); 

    // End the request
    weatReq.end();
})

function createOptions(country, postcode) {

    const options = {         
        hostname: 'api.weatherbit.io',         
        port: 80,         
        path: '/v2.0/current?',         
        method: 'GET'    
    } 
 
    const str = '&postal_code=' + postcode +     
                '&country=' + country +                    
                '&key=' + 'e356802b7eb143b09940bc0d88115c1f';        

    options.path += str;     
    return options; 
}

function parseTemperature(toparse) {     
    let s = "";     
    var json = JSON.parse(toparse);

    s += "The temperature in "

    // Get and set the suburb name
    s += json.data[0].city_name + ", ";

    // Split "Country/City" into separate strings
    var location = json.data[0].timezone;
    var mid = location.indexOf("/");  
    var country = location.substr(0, mid);
    var city = location.substr(mid + 1);  

    // Only include city name if different from area name (to prevent repeating)
    if (city != json.data[0].city_name) {
        s += city + ", ";
    }

    // Add the country name after the city name
    s += country + " is ";

    // Get and set the temperature
    temp = json.data[0].temp;
    temp = Math.round(temp);
    s += temp;

    // Save this string
    report = s;

    // Pring
    console.log(json.data[0]);
    return s; 
}

function createPage(fact) {
    return fact;
}
  
module.exports = router