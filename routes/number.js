const express = require('express')
const router = express.Router()
const http = require('http');


// Number router search
router.get('/', function (req, res) {

    // Set options
    const options = createOptions(req.query.num);
    
    // Connect to numbersapi
    var numReq = http.request(options, function(numRes) {
        var output = "";

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
        path: '/' + number,
        method: 'GET'    
    };

    return options;
}

function createPage(fact) {
    return fact;
}
  
module.exports = router;