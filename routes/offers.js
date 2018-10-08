var express = require('express')
var router = express.Router()
var config = require('../config');
var moment = require('moment');
var db = require('../models/db_connection');
var DbFunctionsModel = require('../models/storesTypeModel');
var async = require("async");

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
        console.dir(dataModel);
        res.render('list_offer', { data: dataModel, moment: moment })
    });
})

module.exports = router


