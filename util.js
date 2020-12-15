// load a text resource from a file over the network 
var loadTextResource = function (url, cb) {
    var request = new XMLHttpRequest();  
    request.open("GET", url + "?dontCache" + Math.random(), true);
    request.onload = function () {
        if (request.status < 200 || request.status > 299) {
            cb('Error : HTTP Status ' + request.status + ' on resource ' + url); 
        } else {
            cb(null, request.responseText); 
        } 
    }; 
    request.send();  
}


var loadImage = function (url, cb) {
    var image = new Image(); 
    image.onload = function () {
        cb(null, image); 
    }; 
    image.src=url; 
}

var loadJSONResource = function (url, cb) {
    loadTextResource(url, function(err, result) {
        if (err) {
            cb(err); 
        } else {
            try {
                cb(null, JSON.parse(result)); 
            } catch (e) {
                cb(e); 
            }
        }
    }); 
}