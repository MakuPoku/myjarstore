/**
 *Handles all requests targeted to client resource
 * Created by Markus Tarn on 26.06.2017.
 */
var pool = require("./database.js"),
    responses = require("./httpResponses.js"),
    settings = require("./settings.js"),
    lpn = require("libphonenumber-js"),
    util = require("util");

//Returns list of all the clients
exports.getClients = function (req, resp) {
    pool.query('SELECT id, first_name, surname FROM clients', [], function(err, res) {
        if(err) {
            responses.sendError500(req, resp, err);
        } else {
            responses.sendJson(req, resp, res.rows);
        }
    });
};

//Returns all information of the required client
exports.getClient = function (req, resp, clientId) {
    pool.query('SELECT * FROM clients WHERE id=' + clientId, [], function(err, res) {
        if (err) {
            responses.sendError500(req, resp, err);
        } else if (res.rows.length === 0) {
            responses.sendError404(req, resp);
        } else {
            //Censor and decrypt the phone number
            var data = res.rows[0];
            var decryptedNumber = decrypt(data.phone_number, data.id).toString();
            var censoredNumber = "";
            for (var i = 0; i < decryptedNumber.length - 4; i++) {
                censoredNumber += '*';
            }
            data.phone_number = censoredNumber + decryptedNumber.slice(decryptedNumber.length - 4);
            // send back JSON object with client info
            responses.sendJson(req, resp, data);
        }
    });
};

//Adds new client to the database
exports.add = function (req, resp, reqBody) {
    try {
        if (!reqBody) throw new Error("Invalid input");
        var data = JSON.parse(reqBody);
        if (!validateEmail(data.email_address)) throw new Error("Entered email address seems to be invalid");
        if (!validateNumber(data.phone_number)) throw new Error("Entered phone number seems to be invalid for UK region");
        if (data) {
            var sql = "INSERT INTO clients (first_name, surname, email_address, phone_number) VALUES ";
            sql += util.format("('%s', '%s', '%s', %d)", data.first_name ,data.surname, data.email_address, data.phone_number);
            sql += " RETURNING id";
            pool.query(sql, [], function (err, res) {
                if (err) {
                    responses.sendError500(req, resp, err);
                } else {
                    responses.sendJson(req, resp, res.rows);
                }
            });
        }
        else {
            throw new Error("Invalid input");
        }
    } catch (ex) {
        responses.sendError500(req, resp, ex);
    }
};

//Updates information in database for certain client
exports.update = function (req, resp, reqBody) {
    try {
        if (!reqBody) throw new Error("Invalid input");
        var data = JSON.parse(reqBody);
        if (data) {
            if(!data.id) throw new Error("Client id not provided");
            var sql = "UPDATE clients SET ";
            var isDataProvided = false;
            //Check each column and commit update request if id plus at least one field is changed
            if (data.first_name) {
                sql += " first_name = '" + data.first_name + "',";
                isDataProvided = true;
            }
            if (data.surname) {
                sql += " surname = '" + data.surname + "',";
                isDataProvided = true;
            }
            if (data.email_address) {
                if (!validateEmail(data.email_address)) throw new Error("Entered email address seems to be invalid");
                sql += " email_address = '" + data.email_address + "',";
                isDataProvided = true;
            }
            if (data.phone_number) {
                if (!validateNumber(data.phone_number.toString())) throw new Error("Entered phone number seems to be invalid for UK region");
                sql += " phone_number = '" + encrypt(data.phone_number, data.id) + "',";
                isDataProvided = true;
            }
            if (data.gender) {
                sql += " gender = '" + data.gender + "',";
                isDataProvided = true;
            }
            if (data.birthday) {
                sql += " birthday = '" + data.birthday + "',";
                isDataProvided = true;
            }
            if (data.city) {
                sql += " city = '" + data.city + "',";
                isDataProvided = true;
            }
            if (data.post_index) {
                sql += " post_index = '" + data.post_index + "',";
                isDataProvided = true;
            }
            if (data.address) {
                sql += " address = '" + data.address + "',";
                isDataProvided = true;
            }
            sql = sql.slice(0, -1);
            sql += " WHERE id = " + data.id;

            pool.query(sql, [], function (err, res) {
                if (err) {
                    responses.sendError500(req, resp, err);
                } else {
                    responses.send200(req, resp);
                }
            });
        }
        else {
            throw new Error("Input not valid")
        }
    } catch (ex) {
        responses.sendError500(req, resp, ex);
    }
};

//Removes client from database
exports.delete = function (req, resp, reqBody) {
    try {
        if (!reqBody) throw new Error("Invalid input");
        var data = JSON.parse(reqBody);
        if (data) {
            if (!data.id) throw new Error("Client id not provided");
            var sql = "DELETE FROM clients ";
            sql += " WHERE id = " + data.id;
            pool.query(sql, [], function (err, res) {
                if (err) {
                    responses.sendError500(req, resp, err);
                } else {
                    responses.sendJson(req, resp, res);
                }
            });
        }
        else {
            throw new Error("Input not valid");
        }
    } catch (ex) {
        responses.sendError500(req, resp, ex);
    }
};

//Function to validate phone number according to country code in settings.js
//https://github.com/halt-hammerzeit/libphonenumber-js
function validateNumber(number) {
    return lpn.isValidNumber(lpn.parse(number, settings.countryCode()));
}

//Email address validation
//https://stackoverflow.com/questions/46155/how-to-validate-email-address-in-javascript
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

// Hyper-secure encryption algorithm written by John Nash himself. NSA level reliability, trust me.
function encrypt(number, key) {
    return number * (Math.ceil(Math.sqrt(key)) % 10);
}

//Algorithm to decrypt the encryption algorithm mentioned above
function decrypt(number, key) {
    return number / (Math.ceil(Math.sqrt(key)) % 10);
}