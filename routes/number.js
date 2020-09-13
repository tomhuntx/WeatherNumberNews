const express = require('express')
const router = express.Router()
const http = require('http');

var numFact = "";

// Number router search
router.get('/:num', function (req, res) {

    // Set number options
    const numOptions = createNumOptions(req.params.num);

    // Connect to numbersapi
    const numReq = http.request(numOptions, function(numRes) {
        
        // Get the entire website and set it as the output
        numRes.on('data', function (chunk) {

            try {
                numFact = chunk.toString('utf8');
                res.send({ fact: numFact });
            }
            catch {
                res.send({ error: "Number fact not found." });
            }

            // Debug: Log the fact
            //console.log('Fact: ' + fact);

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