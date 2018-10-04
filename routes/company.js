var express = require('express')
var router = express.Router()
var CompanyModel = require('../models/companyModel');


// middleware that is specific to this router
// router.use(function timeLog (req, res, next) {
//   console.log('Time: ', Date.now())
//   next()
// })
// define the home page route
router.get('/', function (req, res) {
    CompanyModel.getData(function(err, result) {
        res.render('list_company', { data: result })
    });
})

router.get('/add', function (req, res) {
    res.render('create_company')
})

router.post('/add', function (req, res) {
    CompanyModel.saveCompanyData(req.body, function(err, result) {
        if(result.insertId) {
            res.redirect('/company')
        }
    });
})

// define the about route
router.get('/stores', function (req, res) {
  //res.send('About birds')
  res.render('/stores/list_stores.ejs', { title: 'Hey', message: 'Hello there!' })
})

module.exports = router