const http = require('http');

var fact = "";
function SetFact(temperature) {

    var output = "";
    // Set number options
    const numOptions = createNumOptions(temperature);
    
    // Connect to numbersapi
    var numReq = http.request(numOptions, function(numRes) {
        
        // Get the entire website and set it as the output
        numRes.on('data', function (chunk) {

            // Set fact
            output = chunk;
            console.log('Fact: ' + output);
            
            // Return fact
            //console.log('Fact: ' + fact);
        });
    });

    // Error handling
    numReq.on('error', (e) => {         
        console.error(e);     
    }); 
    fact = output;

    // End the request
    numReq.end();
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

function GetNumberFact(num) {
    SetFact(num);
    console.log('Fact: ' + fact);
    return fact;
}

module.exports.getFact = GetNumberFact;

