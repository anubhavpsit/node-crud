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


// var storeId = 143;
// let imageName = S('Screenshot_from_2018-09-28_14-18-29.png').replaceAll(' ', '_').s;
// let localPath = config.default.store_icon.replace(/{{store_id}}/gi, storeId);
// let dbImagePath = S(localPath).replaceAll('images/', '').s+imageName;
// //let dirPath = path.join(__dirname+'/../public/'+localPath);
// let dirImagePath = path.join(__dirname+'/../public/'+localPath+imageName);

// //var fileName = 'store/142/store_logo/Screenshot_from_2018-08-29_00-35-26.png';
// var fileName = dirImagePath;
// console.dir("AA => "+fileName);

// var uploadFile = () => {
//     // fs.readFile(fileName, (err, data) => {
//     //    if (err) throw err;
//     //    const params = {
//     //        Bucket: 'ally-staging-images', // pass your bucket name
//     //        Key: dbImagePath, // file will be saved as testBucket/contacts.csv
//     //        //Body: JSON.stringify(data, null, 2),
//     //        Body : fs.createReadStream(fileName),
//     //        StorageClass: 'REDUCED_REDUNDANCY'
//     //    };
//     //    s3.upload(params, function(s3Err, data) {
//     //        if (s3Err) throw s3Err
//     //        console.log(`File uploaded successfully at ${data.Location}`)
//     //    });
//     // });


//     var params = {
//         Bucket: 'ally-staging-images',
//         Body : fs.createReadStream(dirImagePath),
//         Key: dbImagePath
//         //SourceFile: dirImagePath
//       };

//       //params = {Bucket: myBucket, Key: myKey, Body: 'Hello!'};

//     //   s3.putObject(params, function(err, data) {
 
//     //       if (err) {
 
//     //           console.log(err)
 
//     //       } else {
//     //             console.dir(data);
//     //             console.log("Successfully uploaded data to myBucket/myKey");
//     //       }
 
//     // });

       
//       s3.upload(params, function (err, data) {
//         //handle error
//         if (err) {
//           console.log("Error", err);
//         }
      
//         //success
//         if (data) {
//           console.log("Uploaded in:", data.Location);
//         }
//       });
//   };
  
//   uploadFile();

// var storeIconData = new Object();
// storeIconData.storeId = 142;
// storeIconData.dbImagePath = 'store/142/store_logo/Screenshot_from_2018-08-29_00-35-26.png';
// StoresModel.saveStoreIcon(storeIconData
//   , function(err, result) {

// });

//let localPath = path.join(__dirname+'/../public/');

// middleware that is specific to this router
// router.use(function timeLog (req, res, next) {
//   console.log('Time: ', Date.now())
//   next()
// })

// let sampleFileName = "Screenshot from 2018-08-29 01-44-24.png";


// var imagePath = getImageStoragePath(storeId, sampleFileName);
// console.dir(imagePath);

// fs.existsSync
// if (fs.existsSync('https://ally-staging-images.s3.ap-south-1.amazonaws.com/anubhav/bom1.png')) {
//     console.dir("Do something");
// } else {
//     console.dir("DO rESt");
// }

// if (!fs.existsSync(publicPath)) {
//     console.dir("NOT EXITST");
//     fs.mkdirSync(publicPath);
// }

// var storeId = 6;
// let storeImagePath = config.default.store_icon;
// //let storeIconPath = storeImagePath.replace(/{{store_id}}/gi, storeId);
// //let filePath = storeIconPath+S(fileName).replaceAll(' ', '_').s;

// var storeIconPath = 'images/astore/6/store_logo/';
// let publicPath = path.join(__dirname+'/../public/'+storeIconPath);
// // if (!fs.existsSync(publicPath)) {
// //     console.dir("NOT EXITST");
// //     fs.mkdirSync(publicPath);
// // }
// mkDirByPathSync(publicPath);
// //return filePath;















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
                let dbImagePath = S(localPath).replaceAll('images/', '').s+imageName;
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