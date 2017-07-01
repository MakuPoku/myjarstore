/**
 *Here are all the http responses that this api can answer
 * All answers are sent in JSON
 * Created by Markus Tarn on 26.06.2017.
 */

//Writes data into JSON and sends out
exports.sendJson = function (req, resp, data) {
    resp.writeHead(200, {"Content-Type": "application/json"});
    if (data) {
        resp.write(JSON.stringify(data));
    }
    resp.end();
};

//Successful response
exports.send200 = function (req, resp) {
    resp.writeHead(200, {"Content-Type": "application/json"});
    resp.end();
};

//Internal error occurred
// err- Error text that is passed by
exports.sendError500 = function (req, resp, err) {
    resp.writeHead(500, "Internal error occurred", {"Content-Type": "application/json"});
    resp.write(JSON.stringify({data: "Internal error occurred- " + err}));
    resp.end();
};

//Method not supported
exports.sendError405 = function (req, resp) {
    resp.writeHead(405, "Method not supported", {"Content-Type": "application/json"});
    resp.write(JSON.stringify({data: "Method not supported"}));
    resp.end();
};

//Resource not found
exports.sendError404 = function (req, resp) {
    resp.writeHead(404, "Resource not found", {"Content-Type": "application/json"});
    resp.write(JSON.stringify({data: "Resource not found"}));
    resp.end();
};

//Request entity too large
exports.sendError413 = function (req, resp) {
    resp.writeHead(413, "Request entity too large", {"Content-Type": "application/json"});
    resp.write(JSON.stringify({data: "Request entity too large"}));
    resp.end();
};