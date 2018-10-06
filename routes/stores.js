var express = require('express')
var router = express.Router()
var StoresModel = require('../models/storesModel');
//var Busboy = require('busboy');
var config = require('../config');
var S = require('string');
var fs = require("fs");
var path = require("path");
var mkdirp = require('mkdirp');

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

router.get('/add', function (req, res) {
    res.render('create_store')
})

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

router.post('/add', function (req, res) {

    StoresModel.saveStoreData(req.body, function(err, result) {
        //res.render('api', { data: result, title: "Test API Output" });
        console.dir("Store Added");
        console.dir(result);
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

module.exports = router