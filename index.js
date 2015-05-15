
/**
 * Module dependencies.
 */

var http = require('http');
var filter = require("./libs/filter.js");

/*
 *  server application function 
 */
function httpRequest(request, response) {	
        if (request.method == 'POST') {
			var error =  {
    			"error": "Could not decode request: JSON parsing failed",
			};
	        var jsonString  = '';
	        request.on('data', function (data) {
	            jsonString += data;

	            // Too much POST data, kill the connection!
	            if (jsonString.length > 1e6){
	                jsonString = '';
					//console.log("json string too long");
					response.setHeader('Access-Control-Allow-Origin', '*');
					response.writeHead(400, {'Content-Type': 'application/json'});
					response.write(JSON.stringify(error));
					response.end();
					request.connection.destroy();
	            }
	        });
	        request.on('end', function () {
                try {
			   		var normalResponse =  {};
                    var list = filter.metadataFilter(JSON.parse(jsonString));
					
					normalResponse['response'] = list;
					response.setHeader('Access-Control-Allow-Origin', '*');
					response.writeHead(200, {'Content-Type': 'application/json'});
					response.write(JSON.stringify(normalResponse));
					response.end();
					
			    } catch (e) {
			    	
			    	response.setHeader('Access-Control-Allow-Origin', '*');
			        response.writeHead(400, {'Content-Type': 'application/json'});
					response.write(JSON.stringify(error));
					response.end();
			    }
	        });
	    }
		else{ 
			// reminder user to post a json data to the server 
			response.writeHead(200, {"Content-Type": "text/plain"});
			response.write("Please post the server a JSON data. e.g.{\'payload':[...]}");
			response.end();
		}
}
 
/**
 * Launch server
 */

http.createServer(httpRequest).listen(process.env.PORT ||8888,function() {
  console.log('Application started on port %d', process.env.PORT ||8888);
});

