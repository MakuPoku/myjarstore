/**
 * Settings for connecting api to database,
 * changing api listening port and
 * changing phone validation country code
 * Created by Markus Tarn on 26.06.2017.
 */

//Change values below to connect database server to your api
exports.dbConfig = {
    user: 'myjar', //env var: PGUSER
    database: 'store_db', //env var: PGDATABASE
    password: 'password123', //env var: PGPASSWORD
    host: 'localhost', // Server hosting the postgres database
    port: 5432, //env var: PGPORT
    max: 10, // max number of clients in the pool
    idleTimeoutMillis: 30000 // how long a client is allowed to remain idle before being closed
};

//Changing the listeningPort value will change the port that your server will listen http requests on
exports.listeningPort = 3000;

//Changing the countryCode value will change phone number validation to check number in that country
exports.countryCode = 'GB';
