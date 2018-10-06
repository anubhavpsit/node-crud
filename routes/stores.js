var express = require('express')
var router = express.Router()
//var Busboy = require('busboy');
var config = require('../config');
var S = require('string');
var fs = require("fs");
var path = require("path");
var mkdirp = require('mkdirp');

var StoresModel = require('../models/storesModel');
var DbFunctionsModel = require('../models/storesTypeModel');



var AWS = require('aws-sdk');
var s3 = new AWS.S3({
    accessKeyId: 'AKIAIQHJUN2GXCSYBIXA', //process.env.AWS_ACCESS_KEY,
    secretAccessKey: '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',
    version: '2006-03-01',
    region: 'ap-south-1'
});


// define the home page route
router.get('/', function (req, res) {
    StoresModel.getData(function(err, result) {
        //res.render('api', { data: result, title: "Test API Output" });
        //console.dir(result);
        res.render('list_store', { data: result })
    });
})

router.get('/getClusterFloor', function (req, res) {
    console.dir(req.query.clusterId);
    var postData = new Object();
    postData.clusterId = req.query.clusterId;
    DbFunctionsModel.getClusterFloors(postData, function(err, result) {
        var resData = new Object();
        resData.success = true;
        resData.data = result;
        res.send(resData);
    });


    // var promise = loadDbData();
    // promise.then( function(result) {
    //     // console.dir("result");
    //     // console.dir(result);
    //     // yay! I got the result.
    //     res.render('create_store', { data: result });
    // }, function(error) {
    //     // The promise was rejected with this error.
    //     console.dir("error");
    //     console.dir(error);
    // });
    // res.render('create_store');
});

router.get('/add', function (req, res) {

    var promise = loadDbData();
    promise.then( function(result) {
        // console.dir("result");
        // console.dir(result);
        // yay! I got the result.
        res.render('create_store', { data: result });
    }, function(error) {
        // The promise was rejected with this error.
        console.dir("error");
        console.dir(error);
    });
    // res.render('create_store');
});

router.post('/single_image', function (req, res) {
    var storeId = req.body.typeId;

    if(req.files) {
        let imageName = S(req.files.storeSinglePhoto.name).replaceAll(' ', '_').s;
        let localPath = config.default.store_icon.replace(/{{store_id}}/gi, storeId);
        let dbImagePath = S(localPath).replaceAll('tmp_images/', '').s+imageName;
        let dirPath = path.join(__dirname+'/../public/'+localPath);
        let dirImagePath = path.join(__dirname+'/../public/'+localPath+imageName);
        let sampleFile = req.files.storeSinglePhoto;

        var storeIconData = new Object();
        storeIconData.storeId = storeId;
        storeIconData.dbImagePath = dbImagePath;
        if (!fs.existsSync(dirPath)) {
            mkdirp(dirPath, function (err) {
                if (err) {
                    console.error(err);
                } else {
                    sampleFile.mv(dirImagePath, function(err) {
                        if (err)
                          return res.status(500).send(err);
                        uploadFile(dirImagePath, dbImagePath);
                    });
                }
            });            
        } else {
            sampleFile.mv(dirImagePath, function(err) {
                if (err)
                  return res.status(500).send(err);
                uploadFile(dirImagePath, dbImagePath);
            });
        }

        StoresModel.saveStoreIcon(storeIconData, function(err, result) {
            console.dir("Updated store icon");
        });
    }
    setTimeout(function(){ res.redirect('/stores'); }, 2000);
});

router.post('/multi_image', function (req, res) {

    var storeId = req.body.typeId;
    let localPath = "";
    if(req.body.type == "store_multi") {
        localPath = config.default.store_images.replace(/{{store_id}}/gi, storeId);        
    }

    if(req.files) {
        for(var i =0; i<req.files.storePhoto.length; i++) {
            
            let imageName = S(req.files.storePhoto[i].name).replaceAll(' ', '_').s;
            let dbImagePath = S(localPath).replaceAll('tmp_images/', '').s+imageName;
            let dirPath = path.join(__dirname+'/../public/'+localPath);
            let dirImagePath = path.join(__dirname+'/../public/'+localPath+imageName);
                            
            let sampleFile = req.files.storePhoto[i];

            var storeIconData = new Object();
            storeIconData.storeId = storeId;
            storeIconData.dbImagePath = dbImagePath;
            storeIconData.dbImageName = imageName.substring(0, imageName.indexOf('.'));
            storeIconData.displayPriority = 0;
            storeIconData.status = 1;

            if (!fs.existsSync(dirPath)) {
                mkdirp(dirPath, function (err) {
                    if (err) {
                        console.error(err);
                    } else {
                        sampleFile.mv(dirImagePath, function(err) {
                            if (err)
                              return res.status(500).send(err);
                            uploadFile(dirImagePath, dbImagePath);
                        });
                    }
                });            
            } else {
                sampleFile.mv(dirImagePath, function(err) {
                    if (err)
                      return res.status(500).send(err);
                    uploadFile(dirImagePath, dbImagePath);
                    //console.dir('File uploaded!');
                });
            }
            StoresModel.saveStoreMultiImages(storeIconData
            , function(err, result) {
                //console.dir("Added store image");
            });
        }
        var resData = new Object();
        resData.success = true;
        res.send(resData);
    }
});
router.post('/changeStatus', function (req, res) {
    //console.dir(req.body);
    //res.render('create_store')
    StoresModel.changeStatus(req.body, function(err, result) {
        //console.dir(result.affectedRows);
        if(result.affectedRows) {
            var resData = new Object();
            resData.success = true;
            res.send(resData);
        } else {
            var resData = new Object();
            resData.success = false;
            res.send(resData);
        }
    });
})

router.get('/getAllImages', function (req, res) {

    var postData = new Object();
    postData.storeId = req.query.storeId;
    StoresModel.getStoreImages(postData, function(err, result) {
        var resData = new Object();
        resData.success = true;
        resData.data = result;
        res.send(resData);
    });
});

router.post('/add', function (req, res) {
console.dir(req.body);
    StoresModel.saveStoreData(req.body, function(err, result) {
        if(result.insertId) {
            if(req.files) {
                var storeId = result.insertId;
                let imageName = S(req.files.store_icon.name).replaceAll(' ', '_').s;
                let localPath = config.default.store_icon.replace(/{{store_id}}/gi, storeId);
                let dbImagePath = S(localPath).replaceAll('tmp_images/', '').s+imageName;
                let dirPath = path.join(__dirname+'/../public/'+localPath);
                let dirImagePath = path.join(__dirname+'/../public/'+localPath+imageName);
                                
                let sampleFile = req.files.store_icon;

                var storeIconData = new Object();
                storeIconData.storeId = storeId;
                storeIconData.dbImagePath = dbImagePath

                if (!fs.existsSync(dirPath)) {
                    mkdirp(dirPath, function (err) {
                        if (err) {
                            console.error(err);
                        } else {
                            sampleFile.mv(dirImagePath, function(err) {
                                if (err)
                                  return res.status(500).send(err);;
                                  StoresModel.saveStoreIcon(storeIconData
                                    , function(err, result) {
                                        console.dir("Added store image");
                                        console.dir(result);
                                  });
                                  uploadFile(dirImagePath, dbImagePath);
                            });
                        }
                    });            
                } else {
                    sampleFile.mv(dirImagePath, function(err) {
                        if (err)
                          return res.status(500).send(err);
                          StoresModel.saveStoreIcon(storeIconData
                            , function(err, result) {
                                console.dir("Added store image");
                                console.dir(result);
                          });
                          uploadFile(dirImagePath, dbImagePath);
                        console.dir('File uploaded!');
                    });
                }
            }
            res.redirect('/stores')
        }
    });
})

var storeTypes = () => {
    var storeTypes = [];
    DbFunctionsModel.getStoreTypeData(function(err, result) {
        for (var i = 0; i< result.length; i++) {
            var d = new Object();
            d.store_type_id = result[i].store_type_id;
            d.store_type = result[i].store_type;
            storeTypes.push(d);
        }
        return storeTypes;
    });
}
var uploadFile = (dirImagePath, dbImagePath) => {
    var params = {
      Bucket: 'ally-staging-images',
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

// define the about route
router.get('/stores', function (req, res) {
  //res.send('About birds')
  res.render('/stores/list_stores.ejs', { title: 'Hey', message: 'Hello there!' })
})


function loadDbData()
{
    return new Promise(function(resolve, reject) {
        //var dataReady = false;
        var data = new Object();
        var storeTypes = [];
        var clustersList = [];
        var companyList = [];
        DbFunctionsModel.getStoreTypeData(function(err, result) {
            for (var i = 0; i< result.length; i++) {
                var d = new Object();
                d.store_type_id = result[i].store_type_id;
                d.store_type = result[i].store_type;
                storeTypes.push(d);
            }
            data.storeTypes = storeTypes;

            DbFunctionsModel.getClusterList(function(err, result) {
                for (var i = 0; i< result.length; i++) {
                    var d = new Object();
                    d.cluster_id = result[i].cluster_id;
                    d.cluster_name = result[i].cluster_name;
                    clustersList.push(d);
                }
                data.clustersList = clustersList;

                DbFunctionsModel.getCompanyList(function(err, result) {
                    for (var i = 0; i< result.length; i++) {
                        var d = new Object();
                        d.company_id = result[i].company_id;
                        d.company_name = result[i].company_name;
                        companyList.push(d);
                    }
                    data.companyList = companyList;
                    resolve(data);
                });
            });
        });
    });
}
module.exports = router