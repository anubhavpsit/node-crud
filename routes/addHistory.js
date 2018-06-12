var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var key = "7cab2267ab2cf19c4b6eaa0ce02d9f0e";

router.post('/history', function (req, res) {

	res.writeHead(200, {'Content-Type': 'text/json'});
	if(typeof req.get('Auth-Key') == "undefined") {
		var data = new Object();
		data.success = false;
		data.status_code = 200;
		data.message = "Auth-Key not provided";
	    res.end(JSON.stringify(data));
	}

	if(req.get('Auth-Key') != key) {
		var data = new Object();
		data.success = false;
		data.status_code = 200;
		data.message = "Authetication failure";
	    res.end(JSON.stringify(data));
	}
    
	var checkData = validateHistoryObject(req.body);
	if(!checkData.status) {
		console.log("Error in request object");
		var data = new Object();
		data.success = false;
		data.status_code = 200;
		data.message = checkData.message;
	    res.end(JSON.stringify(data));
	} else{
		console.log("Request object validated");
	    var todayDate = new Date().toISOString().slice(0,10);
	    var dirPath = "history/"+todayDate+"/"+req.body.userid;
	    //Check if user's today dir is created or not if not create it
	    if(!mkdirpath(dirPath)) {
			console.log("Creating direcotry to save file");
			mkdirpath(dirPath);
	    }
		
	    // Directory created show some engineering and add the data now :)
		var filePath = "history/"+todayDate+"/"+req.body.userid+"/"+req.body.time+".txt";
		fs.writeFile(filePath, req.body.data, function(err) {
			console.log("Writing file in directory");
		    if(err) {
		    	console.log("unable to save file");
		        console.log(err);
				var data = new Object();
				data.success = false;
				data.status_code = 200;
				data.message = "Unable to save file";
				res.end(JSON.stringify(data));
		    }

			var data = new Object();
			data.success = true;
			data.status_code = 200;
			data.message = "File saved successfully";
			res.end(JSON.stringify(data));
		});
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
		if(typeof data.data === "undefined") {
			ret_data.status = false;
			message.push("Data missing");
		}

		if(typeof data.userid === "undefined") {
			ret_data.status = false;
			message.push("Userid missing");
		} else {
			if(data.userid.trim() == "") {
				ret_data.status = false;
				message.push("Userid should not be empty");				
			}
			if (isNaN(data.userid)) {
				ret_data.status = false;
				message.push("Userid should be integer");
			}
		}

		if(typeof data.time === "undefined") {
			ret_data.status = false;
			message.push("Time missing");
		} else {
			if(data.time.trim() == "") {
				ret_data.status = false;
				message.push("Time should not be empty");				
			}
			// if (isNaN(data.time)) {
			// 	ret_data.status = false;
			// 	message.push("Time should be integer");
			// }
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

// Create Directory
function mkdirpath(dirPath)
{
    if(!fs.existsSync(dirPath))
    {
        try
        {
            fs.mkdirSync(dirPath);
        }
        catch(e)
        {
            mkdirpath(path.dirname(dirPath));
            mkdirpath(dirPath);
        }
    } else {
		return true;
    }
}

module.exports = router;
