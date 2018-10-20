var db = require('./db_connection');
var config = require('../config');
var fs = require("fs");

function getStoresList(callback) {
    db.query('SELECT * FROM store_master where store_type_id = 1 AND status = 1 order by store_id desc', function(err, res, fields) {
        callback(err, res);
    });
}

function getOfferTypes(callback) {
    db.query('SELECT * FROM offer_type where status = 1 order by id desc', function(err, res, fields) {
        callback(err, res);
    });
}

function getOfferCategory(callback) {
    db.query('SELECT * FROM offer_category_master where status = 1 order by offer_category_id desc', function(err, res, fields) {
        callback(err, res);
    });
}

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

function getClusterStores(data, callback) {
    if(data.clusterId == 0) {
        db.query('select * FROM store_master order by store_id asc', function(err, res, fields) {
            callback(err, res);
        });
    }
    db.query('select * FROM store_master where cluster_id = '+data.clusterId+' order by store_id asc', function(err, res, fields) {
        callback(err, res);
    });
}

function getStoreFloorsList(data, callback) {
    db.query('select * FROM store_floor_details where store_id = '+data.storeId+' order by id asc', function(err, res, fields) {
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
            //console.dir(res[i].image);
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

function saveSingleIcon(data, callback) {
    if(data.type == "product_icon"){
        db.query("UPDATE store_product_master set image = '"+data.dbImagePath+"' WHERE id = " + data.typeId, function(err, result) {
            if (err) throw err
                callback(err, result);
        });
    } else if(data.type == "store_icon") {
        db.query("UPDATE store_master set image = '"+data.dbImagePath+"' WHERE store_id = " + data.typeId, function(err, result) {
            if (err) throw err
                callback(err, result);
        });
    } else {
        callback(err, {});
    }
}

function getAllImages(data, callback) {

    if(data.type == "product_multi") {
        db.query('SELECT * FROM product_images_mapping WHERE product_id = '+data.typeId+' order by id desc', function(err, res, fields) {
            if(err) {
                console.dir(err);                
            } else {
                for(var i = 0; i<res.length; i++) {
                    //console.dir(res[i].image);
                    if((res[i].image_file == null) || (res[i].image_file == '')) {
                        res[i].image_file = 'https://ally-staging-images.s3.ap-south-1.amazonaws.com/anubhav/bom1.png';
                    } else {
                        //let s3Url = config.default.s3url +res[i].image;
                        res[i].image_file = config.default.s3url +res[i].image_file;
                    }
                    //res[i].image = s3Url;
                }
                callback(err, res);
            }
        });
    } else {
        db.query('SELECT * FROM store_images_mapping WHERE store_id = '+data.typeId+' order by id desc', function(err, res, fields) {
            if(err) {
                console.dir(err);                
            } else {
                for(var i = 0; i<res.length; i++) {
                    //console.dir(res[i].image);
                    if((res[i].image_file == null) || (res[i].image_file == '')) {
                        res[i].image_file = 'https://ally-staging-images.s3.ap-south-1.amazonaws.com/anubhav/bom1.png';
                    } else {
                        //let s3Url = config.default.s3url +res[i].image;
                        res[i].image_file = config.default.s3url +res[i].image_file;
                    }
                    //res[i].image = s3Url;
                }
                callback(err, res);
            }
        });
    }
}

function getOfferData(offerId, callback) {
    db.query('SELECT * FROM advertisment_master WHERE offer_id = '+offerId, function(err, res, fields) {
        callback(err, res);
    });
}

function getOfferFloorData(offerId, callback) {
    db.query('SELECT * FROM ad_floor_mapping WHERE offer_id = '+offerId, function(err, res, fields) {
        callback(err, res);
    });
}

function saveMultiImages(data, callback) { 

    var postData = [
        data.typeId,
        data.dbImageName,
        data.dbImagePath,
        data.displayPriority,
        data.status];

    if(data.type == "product_multi") {
        db.query('INSERT INTO product_images_mapping (\
            product_id,image_name,image_file,\
            display_priority, status) VALUES (?, ?, ?, ?, ?)', postData, function(err, result) {
            if (err) throw err
                callback(err, result);
          });
    } else {
        db.query('INSERT INTO store_images_mapping (\
        store_id,image_name,image_file,\
        display_priority, status) VALUES (?, ?, ?, ?, ?)', postData, function(err, result) {
        if (err) throw err
            callback(err, result);
      });
    }
}

function getAllOffersList(callback) {
    db.query('SELECT a.*,b.offer_type as offer_type_text,c.offer_category as offer_category_text FROM advertisment_master a, offer_type b, offer_category_master c where a.offer_type_id = b.id AND a.offer_category_id = c.offer_category_id order by offer_id desc', function(err, res, fields) {
        for(var i = 0; i<res.length; i++) {
            if((res[i].banner_image == null) || (res[i].banner_image == '')) {
                res[i].banner_image = 'https://ally-staging-images.s3.ap-south-1.amazonaws.com/anubhav/bom1.png';
            } else {
                res[i].banner_image = config.default.s3url +res[i].banner_image;
            }
            if((res[i].image_url == null) || (res[i].image_url == '')) {
                res[i].image_url = 'https://ally-staging-images.s3.ap-south-1.amazonaws.com/anubhav/bom1.png';
            } else {
                res[i].image_url = config.default.s3url +res[i].image_url;
            }
        }

        callback(err, res);
    });
}


function saveOfferImage(data, callback) {
    console.dir("saveOfferImage Called" + data.colName);
    let my_sql = "UPDATE advertisment_master set "+data.colName+" = '"+data.dbImagePath+"' WHERE offer_id = " + data.offerId;
    console.dir(my_sql);
    db.query(my_sql, function(err, result) {
        if (err) throw err
            callback(err, result);
      });
}

function saveOffersData(data, callback) {
    if(typeof(data.is_multiclaim_offer) == "undefined") {
        data.is_multiclaim_offer = 0;
    } else {
        data.is_multiclaim_offer = 1;
    }
    var postData = [
        data.cluster_id,
        data.offer_in_category_id,
        data.offer_title,
        data.offer_description,
        data.start_date,
        data.end_date,
        data.is_multiclaim_offer,
        data.max_claim_count,
        data.offer_points,
        data.offer_type_id,
        data.offer_category_id
    ];
  
    db.query('INSERT INTO advertisment_master (\
        cluster_id, category_code, offer_title, offer_description, validity_from, validity_to,\
        multi_claim, max_claim, offer_points, offer_type_id, offer_category_id\
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', postData, function(err, result) {
        if (err) {
            throw err;
        } else {
            callback(err, result);
        }
    });
}

function getOffersMappedStoreList(offerId, callback) {

    db.query('SELECT * FROM ad_store_mapping WHERE offer_id = '+offerId+' order by id desc', function(err, res, fields) {
        callback(err, res);
    });
}

function getStoreFloorData(data, callback) {
    db.query('SELECT * FROM ad_store_mapping WHERE offer_id = '+data.offer_id+' AND floor_id = '+data.floor_id+' AND store_id='+data.store_id+' order by id desc', function(err, res, fields) {
        callback(err, res);
    });
}

function getStoreFloorDataRow(data, callback) {
    db.query('SELECT * FROM store_floor_details WHERE cluster_id = '+data.cluster_id+' AND store_id = '+data.store_id+' AND floor_number = '+data.floor_number+' order by id desc', function(err, res, fields) {
        callback(err, res);
    });
}

function updateStoreFloorRow(data, callback) {
    db.query("UPDATE store_floor_details set status = 1, x_axis = '"+data.floor_store_x+"', y_axis = '"+data.floor_store_y+"', z_axis = '"+data.floor_store_z+"' WHERE cluster_id = '"+data.cluster_id+"' AND store_id = '"+data.store_id+"' AND floor_number = '"+data.floor_number+"'", function(err, result) {
        if (err) throw err
            callback(err, result);
    });
}

function removeFloorRow(row_index, callback) {

    // db.query("UPDATE store_floor_details set status = '3' WHERE id = " + row_index.floor_index, function(err, result) {
    //     if (err) throw err
    //         callback(err, result);
    // });
    db.query("DELETE FROM store_floor_details WHERE id = " + row_index.floor_index, function(err, result) {
        if (err) throw err
            callback(err, result);
    });
}

function addStoreFloorRow(data, callback) {
    var postData = [
        data.cluster_id,
        data.store_id,
        data.floor_number,
        data.floor_store_x,
        data.floor_store_y,
        data.floor_store_z,
        data.status
    ];
    db.query('INSERT INTO store_floor_details (\
        cluster_id, store_id, floor_number, x_axis, y_axis, z_axis, status) VALUES (?, ?, ?, ?, ?, ?, ?)', postData, function(err, result) {
        if (err) {
            throw err;
        } else {
            callback(err, result);
        }
    });    
}

function addStoreFloorData(data, callback) {
    var postData = [
        data.offer_id,
        data.store_id,
        data.floor_id,
        data.status
    ];
  
    db.query('INSERT INTO ad_store_mapping (\
        offer_id, store_id, floor_id, status) VALUES (?, ?, ?, ?)', postData, function(err, result) {
        if (err) {
            throw err;
        } else {
            callback(err, result);
        }
    });    
}

function updateStoreFloorStatus(data, callback) {
    db.query("UPDATE ad_store_mapping set status = '"+data.status+"' WHERE id = " + data.id, function(err, result) {
        if (err) throw err
            callback(err, result);
    });
}

function changeOfferStatus(data, callback) {
    db.query("UPDATE advertisment_master set status = '"+data.status+"' WHERE offer_id = " + data.offer_id, function(err, result) {
        if (err) throw err
            callback(err, result);
    });
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
    changeStatus: changeStatus,
    saveSingleIcon: saveSingleIcon,
    getAllImages: getAllImages,
    saveMultiImages: saveMultiImages,
    getAllOffersList: getAllOffersList,
    getOfferCategory: getOfferCategory,
    getOfferTypes: getOfferTypes,
    getStoresList: getStoresList,
    getClusterStores: getClusterStores,
    getStoreFloorsList: getStoreFloorsList,
    saveOffersData: saveOffersData,
    saveOfferImage: saveOfferImage,
    getOffersMappedStoreList: getOffersMappedStoreList,
    getOfferData: getOfferData,
    getOfferFloorData: getOfferFloorData,
    getStoreFloorData: getStoreFloorData,
    addStoreFloorData: addStoreFloorData,
    updateStoreFloorStatus: updateStoreFloorStatus,
    changeOfferStatus: changeOfferStatus,
    getStoreFloorDataRow: getStoreFloorDataRow,
    updateStoreFloorRow: updateStoreFloorRow,
    addStoreFloorRow: addStoreFloorRow,
    removeFloorRow: removeFloorRow
}
