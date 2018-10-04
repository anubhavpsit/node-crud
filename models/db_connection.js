//import { config } from './default';
var config = require('../config');
var mysql = require('mysql');

var connection = mysql.createConnection({
    host     : config.default.host,
    user     : config.default.username,
    password : config.default.password,
    database : config.default.database
});

connection.connect(function(err) {
    if (err) throw err;
});

module.exports = connection;