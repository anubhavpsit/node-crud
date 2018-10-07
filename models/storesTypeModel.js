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

function getClusterFloors(data, callback) {
    db.query('select id,cluster_id,floor_number,floor_alias FROM cluster_floor_details where cluster_id = '+data.clusterId+' order by id asc', function(err, res, fields) {
        callback(err, res);
    });
}

function getCategoryList(callback) {
    db.query('SELECT * FROM category_master where status = 1 order by id desc', function(err, res, fields) {
        callback(err, res);
    });    
}

function getSubCategoryList(data, callback) {
    db.query('SELECT * FROM sub_category_master where category_code = '+data.categoryId+' order by sub_category_code desc', function(err, res, fields) {
        callback(err, res);
    });    
}

module.exports = {
    getStoreTypeData: getStoreTypeData,
    getClusterList: getClusterList,
    getCompanyList: getCompanyList,
    getClusterFloors: getClusterFloors,
    getCategoryList: getCategoryList,
    getSubCategoryList: getSubCategoryList
}
