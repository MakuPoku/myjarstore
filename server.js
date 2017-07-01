/**
 * Creates server to listen http requests (GET, POST, PUT and DELETE)
 * Server listening port can be changed in settings.js
 * Created by Markus Tarn on 26.06.2017.
 */
var http = require("http"),
    clients = require("./clients.js"),
    settings = require("./settings.js"),
    responses = require("./httpResponses.js");

http.createServer(function (req, resp) {
    var reqBody = '';
    switch(req.method) {
        case 'GET':
            //handle GET request to get information from database
            //reroute empty requests to /clients for retrieving clients
            if (req.url === "/") {
                resp.writeHead(301, {Location: "/clients"});
                resp.end();
                //get list of clients from clients resource
            } else if (req.url === "/clients") {
                clients.getClients(req, resp);
            } else {
                //get specific client information according to client number
                var regexPattern = "[0-9]+";
                var pattern = new RegExp("/clients/" + regexPattern);
                if (pattern.test(req.url)) {
                    pattern = new RegExp(regexPattern);
                    var clientId = pattern.exec(req.url);
                    clients.getClient(req, resp, clientId);
                } else {
                    responses.sendError404(req, resp);
                }
            }
            break;
        case 'POST':
            //handle POST request for adding new row to database
            if (req.url === "/clients") {
                req.on("data", function (data) {
                    reqBody += data;
                    //check that request doesn't exceed 10MB limit
                    if (reqBody.length > 1e7) {
                        feedback.sendError413(req, resp);
                    }
                });
                req.on("end", function () {
                    clients.add(req, resp, reqBody);
                });
            }  else {
                responses.sendError404(req, resp);
            }
            break;
        case 'PUT':
            //handle PUT request to change information in database
            if (req.url === "/clients") {
                req.on("data", function (data) {
                    reqBody += data;
                    //check that request doesn't exceed 10MB limit
                    if (reqBody.length > 1e7) {
                        feedback.sendError413(req, resp);
                    }
                });
                req.on("end", function () {
                    clients.update(req, resp, reqBody);
                });
            } else {
                responses.sendError404(req, resp);
            }
            break;
        case 'DELETE':
            //handle DELETE request to delete information in database
            if (req.url === "/clients") {
                req.on("data", function (data) {
                    reqBody += data;
                    //check that request doesn't exceed 10MB limit
                    if (reqBody.length > 1e7) {
                        feedback.sendError413(req, resp);
                    }
                });
                req.on("end", function () {
                    clients.delete(req, resp, reqBody);
                });
            } else {
                responses.sendError404(req, resp);
            }
            break;
        default:
            responses.sendError405(req, resp);
            break;
    }
}).listen(settings.listeningPort, function () {
    console.log("Api server started on port " + settings.listeningPort);
});
