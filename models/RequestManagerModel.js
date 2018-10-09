var db = require('./db_connection');
var config = require('../config');
var fs = require("fs");


function saveRequestRawData(data, callback) {
    
    var postData = [
        data.instance_id,
        data.headers,
        data.raw_request,
        data.request_url,
        "0"
    ];
    //console.dir(postData);
    db.query('INSERT INTO api_incoming_requests (instance_id, request_headers, raw_request, request_url, status) VALUES (?, ?, ?, ?, ?)', postData, function(err, result) {
        if (err) {
            //console.log('this.sql', this.sql);
            throw err;
            console.dir("Error in capturing the request");
        } else {
            callback(err, result);
        }
    });
}

module.exports = {
    saveRequestRawData: saveRequestRawData
}
