var db = require('./db_connection');
var config = require('../config');
var fs = require("fs");

// db.query('SELECT * FROM store_master', function(err, result) {
//     if (err) throw err;
//     console.dir("AAAAAAAAAA");
//     console.dir(result);
//   });


// var stores = {
//         getAllStores: () => {
//             db.query('SELECT * FROM store_master', function(err, result) {
//                 if (err) throw err;
//                 //console.dir("BBBBBBBBBBBBBBBCCCCCCCCCCCCC");
//                 //console.dir(result);
//                 return result;
//             });
//         },
//         getActiveCompany: () => {
//             var a = [1,2,3,4,5,6];
//             return a;
//         },
//     };


// exports.getAllStores = function(done) {
//     db.get().query('SELECT * FROM store_master', function (err, rows) {
//       if (err) return done(err)
//       done(null, rows)
//     })
// }

// exports.getAllStores = function() {
//     db.get().query('SELECT * FROM store_master', function (err, rows) {
//       if (err) throw err;
//       return rows;
//     })
// }




// var data = {
//     getAllStores: getAllStores(db)
// }

// function a(){
//     return 55;
// }
// function getAllStores(db) {
//     var data = 'AASAS';
//    db.query('SELECT store_name FROM store_master WHERE store_id = 1', function(err, result) {
//         if (err) throw err;
//         // console.dir("AAAAAAAAAA");
//         //console.dir(result);
//         data = result;
//     });
//     return data;
// }


// console.dir("B");
// console.dir(data);
// console.dir("B");


function getData(callback) {
    db.query('SELECT * FROM store_master order by store_id desc', function(err, res, fields) {
        //console.dir(res.image);
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

function saveStoreIcon(data, callback) {
    db.query("UPDATE store_master set image = '"+data.dbImagePath+"' WHERE store_id = " + data.storeId, function(err, result) {
        if (err) throw err
            callback(err, result);
      });
}

function saveStoreData(data, callback) {
    // db.query('SELECT * FROM store_master', function(err, res, fields) {
    //     callback(err, res);
    // });
    var postData = [
        data.store_name,
        data.store_type,
        data.company_name,
        data.store_manager_name,
        data.store_owner_name,
        data.store_mobile_number,
        data.store_phone_number,
        data.store_email,
        data.address_1,
        data.address_2,
        data.city,
        data.cluster_id,
        data.latitude,
        data.longitude];

    db.query('INSERT INTO store_master (\
        store_name,store_type_id,company_id,\
        store_manager_name, store_owner_name, mobile_number, phone_number,\
        email, address1, address2, city, cluster_id, gps_lat, gps_long) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', postData, function(err, result) {
        if (err) {
            throw err;
        } else {
            var floorData = [
                data.cluster_id,
                result.insertId,
                data.store_floor,
                data.x_coordinates,
                data.y_coordinates,
                1
            ];

            db.query('INSERT INTO store_floor_details (cluster_id, store_id, floor_number, x_axis, y_axis, status) VALUES (?, ?, ?, ?, ?, ?)', floorData, function(err, result) {
//                console.dir(result);
                if (err) {
                    // throw err
                } 
            });
            // console.log(a.sql);
            callback(err, result);
        }
      });
}

function changeStatus(data, callback) {
    db.query("UPDATE store_master set status = '"+data.status+"' WHERE store_id = " + data.storeId, function(err, result) {
        if (err) throw err
            callback(err, result);
    });
}

function getStoreImages(data, callback) {
    db.query('SELECT * FROM store_images_mapping order by id desc', function(err, res, fields) {
        //console.dir(res.image);
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
    });
}
function saveStoreMultiImages(data, callback) {
  
    var postData = [
        data.storeId,
        data.dbImageName,
        data.dbImagePath,
        data.displayPriority,
        data.status];

    db.query('INSERT INTO store_images_mapping (\
        store_id,image_name,image_file,\
        display_priority, status) VALUES (?, ?, ?, ?, ?)', postData, function(err, result) {
        if (err) throw err
            callback(err, result);
      });
}



module.exports = {
    getData: getData,
    saveStoreData: saveStoreData,
    saveStoreIcon: saveStoreIcon,
    changeStatus: changeStatus,
    saveStoreMultiImages: saveStoreMultiImages,
    getStoreImages: getStoreImages
}



//exports.Stores = data;
//module.exports = stores;