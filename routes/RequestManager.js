var express = require('express')
var router = express.Router()
var config = require('../config');


var RequestManagerModel = require('../models/RequestManagerModel');

// // define the home page route
router.post('/Add', function (req, res) {
    RequestManagerModel.saveRequestRawData(req.body, function(err, result) {
	    var resData = new Object();
	    resData.success = true;
	    resData.message = "Request captured successfully!";
	    res.send(resData);
    });

})

module.exports = router