MyJar test task API
===========	

A very simple API to store and retrieve client data from PostgreSQL database through JSON.
Written in pure NODE.js without any frameworks except for libphonenumber-js that is used to validate phone number by selected region.
Code also validates email address by regular expression, encrypts phone numbers before storing them in database and censors most of the phone number for extra security.

How it works
========
 * server.js will initialize and start server to listen to requests
 * database.js will initialize database
 * clients.js has functions to handle all requests targeted to client resource
 * HttpResponses.js has all http responses/errors required for this API
 * Settings.js will have several settings to set up database and server

Installation
========
1. Download repository.
2. Modify settings.js to change database configuration details and listening port.
3. Run api.js in node.

That’s it!




Requests with 'clients' resource
========

Client has 10 columns of variables:
  * id (SERIAL, prime key)
  * first_name (character varying, 255, mandatory)
  * surname (character varying, 255, mandatory)
  * phone_number (Integer, value is retrieved from database as a STRING!, mandatory)
  * email_address (character varying, 255, mandatory)
  * gender (BOOLEAN, one number for every gender there is [1 for woman])
  * birthday (DATE)
  * city (character varying, 255)
  * post_index (Integer)
  * address (character varying, 255)
  
Client resource also has following requests:
  * GET /clients - returns list of clients with their id, first_name and surname
  * GET /clients/'id' - returns all client information with given id (Most of phone number is censored)
  * POST /clients - adds new client and returns id that the client was given, requires at least four fields in JSON body marked as mandatory in variables
  * PUT /clients - changes clients’ information in database. Requires at least id and one field to change in JSON body
  * DELETE /clients/'id' - deletes client with given id from database
