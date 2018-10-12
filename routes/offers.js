var express = require('express')
var router = express.Router()
var config = require('../config');
var moment = require('moment');
var db = require('../models/db_connection');
var DbFunctionsModel = require('../models/storesTypeModel');
var async = require("async");
var S = require('string');
var fs = require("fs");
var path = require("path");
var mkdirp = require('mkdirp');

var AWS = require('aws-sdk');
var s3 = new AWS.S3({
    accessKeyId: config.default.aws_access_key, //process.env.AWS_ACCESS_KEY,
    secretAccessKey: config.default.aws_secret_key,
    version: '2006-03-01',
    region: 'ap-south-1'
});


// app.get('/', function(req, res) {

//     async.parallel({
//       alloffers: queryRow('user_name', 'users'),
//       offertypes: queryRow('title', 'code_samples')
//     },
//     function(result) {
//       res.render('list_offer', { 
//         layout: false,
//         locals: {user_name: result.users, title: result.titles} 
//       });
//     });
// });

router.get('/getClusterStores', function (req, res) {
    var postData = new Object();
    postData.clusterId = req.query.clusterId;
    DbFunctionsModel.getClusterStores(postData, function(err, result) {
        var resData = new Object();
        resData.success = true;
        resData.data = result;
        res.send(resData);
    });
});

router.get('/add', function (req, res) {
    var promise = loadDbData();
    promise.then( function(result) {
        res.render('create_offer', { data: result });
    }, function(error) {
        console.dir("error");
        console.dir(error);
    });
    // res.render('create_store');
});

router.post('/add', function (req, res) {
    //console.dir(req.body);
    DbFunctionsModel.saveOffersData(req.body, function(err, result) {
        if(result.insertId) {
            var offerId = result.insertId;
            if((req.files) && (typeof req.files.banner_image != "undefined")) {
                let imageName = S(req.files.banner_image.name).replaceAll(' ', '_').s;
                let localPath = config.default.offer_banner_image.replace(/{{offer_id}}/gi, offerId);
                let dbImagePath = S(localPath).replaceAll('tmp_images/', '').s+imageName;
                let dirPath = path.join(__dirname+'/../public/'+localPath);
                let dirImagePath = path.join(__dirname+'/../public/'+localPath+imageName);
                                
                let sampleFile = req.files.banner_image;

                var storeIconData = new Object();
                storeIconData.offerId = offerId;
                storeIconData.dbImagePath = dbImagePath;
                storeIconData.colName = "banner_image";
                console.dir(storeIconData);
                if (!fs.existsSync(dirPath)) {
                    mkdirp(dirPath, function (err) {
                        if (err) {
                            console.error(err);
                        } else {
                            sampleFile.mv(dirImagePath, function(err) {
                                if (err)
                                  return res.status(500).send(err);;
                                  DbFunctionsModel.saveOfferImage(storeIconData
                                    , function(err, result) {
                                        console.dir("Created dir and Added offer banner image");
                                        //console.dir(result);
                                  });
                                  uploadFile(dirImagePath, dbImagePath);
                            });
                        }
                    });            
                } else {
                    sampleFile.mv(dirImagePath, function(err) {
                        if (err)
                          return res.status(500).send(err);
                          DbFunctionsModel.saveOfferImage(storeIconData
                            , function(err, result) {
                                console.dir("Dir Exists Added offer banner image");
                                //console.dir(result);
                          });
                          uploadFile(dirImagePath, dbImagePath);
                        console.dir('File uploaded!');
                    });
                }
            }
            if((req.files) && (typeof req.files.offer_icon != "undefined")) {
                let imageName = S(req.files.offer_icon.name).replaceAll(' ', '_').s;
                let localPath = config.default.offer_icon_image.replace(/{{offer_id}}/gi, offerId);
                let dbImagePath = S(localPath).replaceAll('tmp_images/', '').s+imageName;
                let dirPath = path.join(__dirname+'/../public/'+localPath);
                let dirImagePath = path.join(__dirname+'/../public/'+localPath+imageName);
                                
                let sampleFile = req.files.offer_icon;

                var bannerIconData = new Object();
                bannerIconData.offerId = offerId;
                bannerIconData.dbImagePath = dbImagePath;
                bannerIconData.colName = "image_url";
                console.dir(bannerIconData);
                if (!fs.existsSync(dirPath)) {
                    mkdirp(dirPath, function (err) {
                        if (err) {
                            console.error(err);
                        } else {
                            sampleFile.mv(dirImagePath, function(err) {
                                if (err)
                                  return res.status(500).send(err);;
                                  DbFunctionsModel.saveOfferImage(bannerIconData
                                    , function(err, result) {
                                        console.dir("Created dir and Added offer icon image");
                                        //console.dir(result);
                                  });
                                  uploadFile(dirImagePath, dbImagePath);
                            });
                        }
                    });            
                } else {
                    sampleFile.mv(dirImagePath, function(err) {
                        if (err)
                          return res.status(500).send(err);
                          DbFunctionsModel.saveOfferImage(bannerIconData
                            , function(err, result) {
                                console.dir("Dir Exists Added offer icon image");
                                //console.dir(result);
                          });
                          uploadFile(dirImagePath, dbImagePath);
                        console.dir('File uploaded!');
                    });
                }
            }
            res.redirect('/offers');
        }
    });
})


// define the home page route
router.get('/', function (req, res) {

    DbFunctionsModel.getAllOffersList(function(err, result) {
        var dataModel = [];
        for (var i = 0; i< result.length; i++) {

            var data = new Object();
            data.offer_id = result[i].offer_id;
            data.banner_image = result[i].banner_image;
            data.offer_type_id = result[i].offer_type_id;
            data.offer_type_text = result[i].offer_type_text;
            // DbFunctionsModel.getOfferTypeByOfferId(1, function(err, result){
            //     data.offer_type = result[i].offer_type;
            // });
            data.offer_category_id = result[i].offer_category_id;
            data.offer_category_text = result[i].offer_category_text;
            data.validity_from = result[i].validity_from;
            data.validity_to = result[i].validity_to;
            data.cluster_id = result[i].cluster_id;
            data.offer_title = result[i].offer_title;
            data.status = result[i].status;
            dataModel.push(data);

        }
        //console.dir(dataModel);
        res.render('list_offer', { data: dataModel, moment: moment })
    });
})

function loadDbData()
{
    return new Promise(function(resolve, reject) {
        //var dataReady = false;
        var data = new Object();
        var offerTypes = [];
        var offerCategoryData = [];
        var clustersList = [];
        var storesList = [];
        var categoryList = [];
        DbFunctionsModel.getOfferTypes(function(err, result) {
            for (var i = 0; i< result.length; i++) {
                var d = new Object();
                d.id = result[i].id;
                d.offer_type = result[i].offer_type;
                offerTypes.push(d);
            }
            data.offerTypes = offerTypes;
            DbFunctionsModel.getOfferCategory(function(err, result) {
                for (var i = 0; i< result.length; i++) {
                    var d = new Object();
                    d.id = result[i].offer_category_id;
                    d.offer_category = result[i].offer_category;
                    offerCategoryData.push(d);
                }
                data.offerCategoryData = offerCategoryData;

                DbFunctionsModel.getClusterList(function(err, result) {
                    for (var i = 0; i< result.length; i++) {
                        var d = new Object();
                        d.cluster_id = result[i].cluster_id;
                        d.cluster_name = result[i].cluster_name;
                        clustersList.push(d);
                    }
                    data.clustersList = clustersList;
                    DbFunctionsModel.getCategoryList(function(err, result) {
                        for (var i = 0; i< result.length; i++) {
                            var d = new Object();
                            d.id = result[i].id;
                            d.category_name = result[i].category_name;
                            categoryList.push(d);
                        }
                        data.categoryList = categoryList;
                        DbFunctionsModel.getStoresList(function(err, result) {
                            for (var i = 0; i< result.length; i++) {
                                var d = new Object();
                                d.id = result[i].store_id;
                                d.store_name = result[i].store_name;
                                storesList.push(d);
                            }
                            data.storesList = storesList;
                            resolve(data);
                        });
                    });
                });
            });
        });
    });
}

var uploadFile = (dirImagePath, dbImagePath) => {
    var params = {
      Bucket: config.default.aws_bucket_name,
      Body : fs.createReadStream(dirImagePath),
      Key: dbImagePath
      //SourceFile: dirImagePath
    };
     
    s3.upload(params, function (err, data) {
      //handle error
      if (err) {
        console.log("Error", err);
      }
    
      //success
      if (data) {
        console.log("Uploaded in:", data.Location);
      }
    });
  };

module.exports = router


