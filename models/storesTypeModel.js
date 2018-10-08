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

function getProductsList(callback) {
    db.query('SELECT * FROM store_product_master order by id asc', function(err, res, fields) {
        // for(var i = 0; i<res.length; i++) {
        //     console.dir(res[i].image);
        //     if((res[i].image == null) || (res[i].image == '')) {
        //         res[i].image = 'https://ally-staging-images.s3.ap-south-1.amazonaws.com/anubhav/bom1.png';
        //     } else {
        //         //let s3Url = config.default.s3url +res[i].image;
        //         res[i].image = config.default.s3url +res[i].image;
        //     }
        //     //res[i].image = s3Url;
        // }
        callback(err, res);
    });
}

function getStoreProductsList(storeId, callback) {
    //storeId = 4;
    db.query('SELECT * FROM store_product_master WHERE store_id = '+storeId+' order by id desc', function(err, res, fields) {
        for(var i = 0; i<res.length; i++) {
            console.dir(res[i].image);
            if((res[i].image == null) || (res[i].image == '')) {
                res[i].image = 'https://ally-staging-images.s3.ap-south-1.amazonaws.com/anubhav/bom1.png';
            } else {
                //let s3Url = config.default.s3url +res[i].image;
                res[i].image = config.default.s3url +res[i].image;
            }
            //res[i].image = s3Url;
        }
        callback(err, res);
    });
}

function addProduct(data, callback) {
    var postData = [
        data.store_id,
        data.product_name,
        2
    ];

    db.query('INSERT INTO store_product_master (\
        store_id,product_name,status) VALUES (?, ?, ?)', postData, function(err, result) {
        if (err) {
            throw err;
        } else {
            callback(err, result);
        }
    });    

}

function saveProductIcon(data, callback) {
    db.query("UPDATE store_product_master set image = '"+data.dbImagePath+"' WHERE id = " + data.productId, function(err, result) {
        if (err) throw err
            callback(err, result);
      });
}

function changeStatus(data, callback) {
    if(data.action == "product"){
        db.query("UPDATE store_product_master set status = '"+data.status+"' WHERE id = " + data.id, function(err, result) {
            if (err) throw err
                callback(err, result);
        });
    }
}

module.exports = {
    getStoreTypeData: getStoreTypeData,
    getClusterList: getClusterList,
    getCompanyList: getCompanyList,
    getClusterFloors: getClusterFloors,
    getCategoryList: getCategoryList,
    getSubCategoryList: getSubCategoryList,
    getProductsList: getProductsList,
    getStoreProductsList: getStoreProductsList,
    addProduct: addProduct,
    saveProductIcon: saveProductIcon,
    changeStatus: changeStatus
}
