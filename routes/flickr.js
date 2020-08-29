const express = require('express'); 
const https = require('https'); 
const router = express.Router(); 
 
router.get('/:query/:number', (req, res) => {     
    
    const options = createFlickrOptions(req.params.query,req.params.number);  
 
    const flickReq = https.request(options, (flickRes) => { 
 
        //This is the body of the callback for dealing with the results   
        //from the Flickr API. We will assemble the response as it comes in,   //parse it like we did last week and create the page.  
        let body = [];       
        flickReq.on('data',function(chunk) {           
            body.push(chunk);       
        }); 

        flickRes.on('end',function() {           
            res.writeHead(flickRes.statusCode, {'content-type': 'text/html'});
            const bodyString = body.join('');
            const rsp = JSON.parse(bodyString);
            const s = createPage('Flickr Photo Search', rsp);
            
            res.write(s);
            res.end();
        }); 
    }); 
 
    flickReq.on('error', (e) => {         
        console.error(e);     
    }); 
 
    flickReq.end(); 
});

//49411caf828777bd
const flickr = {     
    method: 'flickr.photos.search',     
    api_key: "2702e2f2f2ace61943c41523d63cc637",     
    format: "json",     
    media: "photos",     
    nojsoncallback: 1 
};

function createFlickrOptions(query,number) {     
    const options = {         
        hostname: 'api.flickr.com',         
        port: 443,         
        path: '/services/rest/?',         
        method: 'GET'    
    } 
 
    const str = 'method=' + flickr.method +             
                '&api_key=' + flickr.api_key +             
                '&tags=' + query +             
                '&per_page=' + number +             
                '&format=' + flickr.format +             
                '&media=' + flickr.media +             
                '&nojsoncallback=' + flickr.nojsoncallback;     
    options.path += str;     
    return options; 
} 
 
function parsePhotoRsp(rsp) {     
    let s = "";     
    for (let i = 0; i < rsp.photos.photo.length; i++) {        
         photo = rsp.photos.photo[i];   
         t_url = `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_t.jpg`;            
         p_url = `https://www.flickr.com/photos/${photo.owner}/${photo.id}`;         
         s += `<a href="${p_url}"><img alt="${photo.title}" src="${t_url}"/></a>`;     
    }     
    return s; 
}

function createPage(title,rsp) { 
 
    const number = rsp.photos.photo.length;     
    const imageString = parsePhotoRsp(rsp); 
 
    //Headers and opening body, then main content and close     
    const str = '<!DOCTYPE html>' +         
    '<html><head><title>Flickr JSON</title></head>' +         
    '<body>' + '<h1>' + title + '</h1>' +         
    'Total number of entries is: ' + 
    number + '</br>' + imageString +         
    '</body></html>';     
    return str; 
}

module.exports = router;