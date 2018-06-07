var express = require('express');
var router = express.Router();

router.post('/history', function (req, res) {
	console.log("Adding History");
    res.writeHead(200, {'Content-Type': 'text/json'});
	var checkData = validateHistoryObject(req.body);
	if(!checkData.status) {
		var data = new Object();
		data.success = false;
		data.status_code = 200;
		data.message = checkData.message;
	    res.end(JSON.stringify(data));
	} else{
	    var today_date = new Date().toISOString().slice(0,10);
		var data = new Object();
		data.success = true;
		data.status_code = 200;
		data.message = "ALL SET";
	    res.end(JSON.stringify(data));
	}
})


function validateHistoryObject(data) 
{
	var ret_data = new Object();
	var message = [];
	ret_data.status = true;
	
	if(data)
	{
		// Let's Anticipate
		if(typeof data.userid === "undefined") {
			ret_data.status = false;
			message.push("Userid missing");
		}

		if(typeof data.data === "undefined") {
			ret_data.status = false;
			message.push("Data missing");
		}

		if(typeof data.time === "undefined") {
			ret_data.status = false;
			message.push("Time missing");
		}

		if(ret_data.status) {
			message=[];
			message.push("Validated");
		}
	} else {
		ret_data.status = false;
		message.push("Data not found");
	}

	ret_data.message = message;
	return ret_data;
}

module.exports = router;
