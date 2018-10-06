var db = require('./db_connection');
var config = require('../config');
var fs = require("fs");

function getStoreTypeData(callback) {
    db.query('SELECT * FROM store_type_master where status = 1 order by store_type_id asc', function(err, res, fields) {
        callback(err, res);
    });
}

function getClusterList(callback) {
    db.query('SELECT * FROM cluster_master where status = 1 order by cluster_id asc', function(err, res, fields) {
        callback(err, res);
    });
}

function getCompanyList(callback) {
    db.query('SELECT * FROM company_master where status = 1 order by company_id asc', function(err, res, fields) {
        callback(err, res);
    });
}

module.exports = {
    getStoreTypeData: getStoreTypeData,
    getClusterList: getClusterList,
    getCompanyList: getCompanyList
}
