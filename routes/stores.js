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


config.default.aws_secret_key
var AWS = require('aws-sdk');
var s3 = new AWS.S3({
    accessKeyId: config.default.aws_access_key, //process.env.AWS_ACCESS_KEY,
    secretAccessKey: config.default.aws_secret_key,
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

router.get('/getSubcategoryByCategoryId', function (req, res) {
    // StoresModel.getData(function(err, result) {
    //     //res.render('api', { data: result, title: "Test API Output" });
    //     //console.dir(result);
    //     res.render('list_store', { data: result })
    // });
    var postData = new Object();
    postData.categoryId = req.query.categoryId;
    DbFunctionsModel.getSubCategoryList(postData, function(err, result) {
        var resData = new Object();
        resData.success = true;
        resData.data = result;
        res.send(resData);
    });
})

router.get('/getClusterFloor', function (req, res) {
    var postData = new Object();
    postData.clusterId = req.query.clusterId;
    DbFunctionsModel.getClusterFloors(postData, function(err, result) {
        var resData = new Object();
        resData.success = true;
        resData.data = result;
        res.send(resData);
    });
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

    let typeId = req.body.typeId;
    let imageName = S(req.files.storeSinglePhoto.name).replaceAll(' ', '_').s;
    let localPath = '';
    let redirectUrl = '';
    if(req.body.type == "product_icon") {
        localPath = config.default.product_icon.replace(/{{product_id}}/gi, typeId);
        redirectUrl = 'stores/productsList/'+req.body.entityparentId;
    } else {
        localPath = config.default.store_icon.replace(/{{store_id}}/gi, typeId);
        redirectUrl = '/stores';
    }

    let dirPath = path.join(__dirname+'/../public/'+localPath);
    let dirImagePath = path.join(__dirname+'/../public/'+localPath+imageName);
    let sampleFile = req.files.storeSinglePhoto;
    let dbImagePath = S(localPath).replaceAll('tmp_images/', '').s+imageName;
    var storeIconData = new Object();
    storeIconData.type = req.body.type;
    storeIconData.typeId = typeId;
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

    DbFunctionsModel.saveSingleIcon(storeIconData, function(err, result) {
        console.dir("Updated store icon");
    });

    setTimeout(function(){
       res.redirect('/');
    }, 2000);
});

router.post('/upload_multi_image', function(req, res){

    var typeId = req.body.typeId;
    var type = req.body.type;
    var parentId = req.body.parentId;

    let localPath = "";
    if(req.body.type == "product_multi") {
        localPath = config.default.product_images.replace(/{{product_id}}/gi, typeId);
    } else if(req.body.type == "store_multi") {
        localPath = config.default.store_images.replace(/{{store_id}}/gi, typeId);
    }


    if(req.files) {
        for(var i =0; i<req.files.multiPhotos.length; i++) {
            let imageName = S(req.files.multiPhotos[i].name).replaceAll(' ', '_').s;
            let dbImagePath = S(localPath).replaceAll('tmp_images/', '').s+imageName;
            let dirPath = path.join(__dirname+'/../public/'+localPath);
            let dirImagePath = path.join(__dirname+'/../public/'+localPath+imageName);
                            
            let sampleFile = req.files.multiPhotos[i];

            var storeIconData = new Object();
            storeIconData.type = type;
            storeIconData.parentId = parentId;
            storeIconData.typeId = typeId;
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
            DbFunctionsModel.saveMultiImages(storeIconData
                , function(err, result) {
                    //console.dir("Added store image");
            });
        }
        var resData = new Object();
        resData.success = true;
        res.send(resData);
    }
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
    //console.dir(req.body);
    var postData = new Object();
    postData.typeId = req.query.typeId;
    postData.parentId = req.query.parentId;
    postData.type = req.query.type;
    DbFunctionsModel.getAllImages(postData, function(err, result){
        var resData = new Object();
        resData.success = true;
        resData.data = result;
        res.send(resData);
    });
});

router.post('/add', function (req, res) {
    //console.dir(req.body);
    StoresModel.saveStoreData(req.body, function(err, result) {
        if(result.insertId) {
            if((req.files) && (typeof req.files.store_icon != "undefined")) {

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
                          StoresModel.saveStoreIcon(storeIconData
                            , function(err, result) {
                                console.dir("Added store image");
                                //console.dir(result);
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



// define the home page route
router.get('/productsList/:storeId', function (req, res) {
    DbFunctionsModel.getStoreProductsList(req.params.storeId, function(err, result) {
        //res.render('api', { data: result, title: "Test API Output" });
        //console.dir(result);
        res.render('list_product', { data: result, storeId: req.params.storeId })
    });
})

router.get('/productsList/add/:storeId', function (req, res) {

    var promise = loadProductData(req.params.storeId);
    promise.then(function(result) {
        res.render('create_product', { data: result });
    }, function(error) {
        // The promise was rejected with this error.
        console.dir("error");
        console.dir(error);
    });
    // res.render('create_store');
    // DbFunctionsModel.getStoreProductsList(req.params.storeId, function(err, result) {
    //     //res.render('api', { data: result, title: "Test API Output" });
    //     //console.dir(result);
    //     res.render('list_product', { data: result })
    // });
})

router.post('/productsList/add', function (req, res) {
    DbFunctionsModel.addProduct(req.body, function(err, result) {
        if(result.insertId) {
            if((req.files) && (typeof req.files.product_icon != "undefined")) {
                var productId = result.insertId;
                let imageName = S(req.files.product_icon.name).replaceAll(' ', '_').s;
                let localPath = config.default.product_icon.replace(/{{product_id}}/gi, productId);
                let dbImagePath = S(localPath).replaceAll('tmp_images/', '').s+imageName;
                let dirPath = path.join(__dirname+'/../public/'+localPath);
                let dirImagePath = path.join(__dirname+'/../public/'+localPath+imageName);
                                
                let sampleFile = req.files.product_icon;

                var productIconData = new Object();
                productIconData.productId = productId;
                productIconData.dbImagePath = dbImagePath;
                if (!fs.existsSync(dirPath)) {
                    mkdirp(dirPath, function (err) {
                        if (err) {
                            console.error(err);
                        } else {
                            sampleFile.mv(dirImagePath, function(err) {
                                if (err)
                                return res.status(500).send(err);;
                                DbFunctionsModel.saveProductIcon(productIconData
                                    , function(err, result) {
                                        console.dir("Added product image");
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
                        DbFunctionsModel.saveProductIcon(productIconData
                            , function(err, result) {
                                console.dir("Added product image");
                                //console.dir(result);
                        });
                        uploadFile(dirImagePath, dbImagePath);
                        console.dir('File uploaded!');
                    });
                }
            }
            res.redirect('/stores/productsList/' + req.body.store_id)
        }
    });
});

router.post('/product/changeStatus', function (req, res) {
    //res.render('create_store')
    req.body.action="product";
    DbFunctionsModel.changeStatus(req.body, function(err, result) {
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

function loadProductData(storeId)
{
    return new Promise(function(resolve, reject) {
        var data = new Object();
        data.storeId = storeId;
        resolve(data);
    });
}

function loadDbData()
{
    return new Promise(function(resolve, reject) {
        //var dataReady = false;
        var data = new Object();
        var storeTypes = [];
        var clustersList = [];
        var companyList = [];
        var categoryList = [];
        
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
                    
                    DbFunctionsModel.getCategoryList(function(err, result) {
                        for (var i = 0; i< result.length; i++) {
                            var d = new Object();
                            d.id = result[i].id;
                            d.category_name = result[i].category_name;
                            categoryList.push(d);
                        }
                        data.categoryList = categoryList;
                        resolve(data);
                    });
                });
            });
        });
    });
}
module.exports = router