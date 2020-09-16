
const express = require('express')
const router = express.Router()
const http = require('http');
const cons = require('consolidate');

// Output values
var articleCount = 20;
var output = "";

// News router search
router.get('/:text', function (req, res) {

    // Set options
    const options = createOptions(req.params.text);

    // Connect to newsapi
    const newsReq = http.request(options, function(newsRes) {
        let data = "";

        // Get the entire website and set it as the output
        newsRes.on('data', function (chunk) {
            data += chunk;
        });

        // Create a page with its contents
        newsRes.on('end', function() {           
            //res.writeHead(newsRes.statusCode, {'content-type': 'text/html'});

            // Check if input is empty or whitespace
            if (!req.params.text || !req.params.text.trim()) {
                output = -1;
            }
            else {
                output = parseNews(data);
            }

            // Check if the data was able to be parsed
            if (output != -1) {
                // Write the page and end the request
                res.send({ news: output });
            }
            // If not, mark the output as an error
            else {
                output = "There was a problem finding news. " +
                         "Please try again with fewer or less obscure keywords.";

                res.send({ error: output });
            }

            // Debug: log the report
            //console.log(output);
            
            // End the request
            res.end();
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
                '&sortBy=relevancy' +
                '&apiKey=2c81e38cd1b24b08aa59f06e934d5486';

    options.path += str; 
    return options; 
}


function parseNews(toparse) {    
    let json;

    try {
        json = JSON.parse(toparse);
    }
    // Catch if it failed to parse
    catch (e) {
        console.log("Failed to parse: " + e);
        return -1;
    }

    // Debug: Total results
    //let totalArticles = json.totalResults;
    //console.log(totalArticles);

    if (!json || !json.articles || json.articles.length == 0) {
        return -1;
    }

    let newsArticles = [];
    let creator = "";
    let articleName = "";
    let url = "";
    let length = json.articles.length;

    // Set max articles to set articlecount
    if (length > articleCount) {
        length = articleCount;
    }
    
    // Loop through the visible articles
    for (let i = 0; i < length; i++) {

        // Check that source and name of source exists
        if (json.articles[i].source && json.articles[i].source.name) {
            // Set name of source
            creator = json.articles[i].source.name + ": ";
        }
        else {
            creator = "Unknown Creator";
        }

        // Check that the article has a title
        if (json.articles[i].title != null) {
            // Set title of article
            articleName = json.articles[i].title;
        }
        else {
            articleName = "Unnamed";
        }

        // Check that the article has a url
        if (json.articles[i].url != null) {
            // Set the url
            url = json.articles[i].url;
        }
        else {
            url = "";
        }

        // Push article and url info to the array
        newsArticles.push([creator, articleName, url]);
    }
    
    var articleText = "";

    // Build a html list of news articles from the retrieved data
    articleText += '<ol class="text-list text-small">';
    for (let i = 0; i < newsArticles.length; i++) {
      articleText += "<li>";
      articleText += newsArticles[i][0];
      articleText += `<a class="text-links" href="${newsArticles[i][2]}" target="_blank" >
                      ${newsArticles[i][1]}</a>`;
      articleText += "</li>";

    }
    articleText += '</ol>';

    // Return the full array
    return articleText; 
}
  
module.exports = router;