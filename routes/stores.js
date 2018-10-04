var express = require('express')
var router = express.Router()
var StoresModel = require('../models/storesModel');


// middleware that is specific to this router
// router.use(function timeLog (req, res, next) {
//   console.log('Time: ', Date.now())
//   next()
// })

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
    // console.dir(req.body);
    // console.dir(req.body.store_name);
    //res.render('create_store')
    StoresModel.saveStoreData(req.body, function(err, result) {
        //res.render('api', { data: result, title: "Test API Output" });
        // console.dir("VVVVVVVVVVVVVVVVVVV");
        // console.dir(result.insertId);
        if(result.insertId) {
            res.redirect('/stores')
        }
//        console.dir("WWWWWWWWWWWWWWWWWWW");
        //res.render('list_store', { data: result })
    });
})

// define the about route
router.get('/stores', function (req, res) {
  //res.send('About birds')
  res.render('/stores/list_stores.ejs', { title: 'Hey', message: 'Hello there!' })
})

module.exports = router