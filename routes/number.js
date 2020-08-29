const express = require('express')
const router = express.Router()
const http = require('http');
const cons = require('consolidate');

var output = '';

// Number router search
router.get('/:number', function (req, res) {

    // Set options
    const options = createOptions(req.params.number);
    
    // Connect to numbersapi
    var numReq = http.request(options, function(numRes) {

        // Get the entire website and set it as the output
        numRes.on('data', function (chunk) {
            output = chunk;

            // Write fact to the console
            //console.log('Fact: ' + chunk);
        });

        // Create a page with its contents
        numRes.on('end',function() {           
            res.writeHead(numRes.statusCode, {'content-type': 'text/html'});

            const s = createPage(output);

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
})

function createOptions(number) {
    var options = {
        host: 'numbersapi.com',
        port: 80,
        path: '/'
    };
    options.path += number;

    return options;
}

function createPage(fact) {
    return fact;
}
  
module.exports = router