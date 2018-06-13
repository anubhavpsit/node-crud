var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var key = "7cab2267ab2cf19c4b6eaa0ce02d9f0e";

// make Promise version of fs.readdir()
fs.readdirAsync = function(dirname) {
    return new Promise(function(resolve, reject) {
        fs.readdir(dirname, function(err, filenames){
            if (err) 
                reject(err); 
            else 
                resolve(filenames);
        });
    });
};

// make Promise version of fs.readFile()
fs.readFileAsync = function(filename, enc) {
    return new Promise(function(resolve, reject) {
        fs.readFile(filename, enc, function(err, data){
            if (err) 
                reject(err); 
            else
                resolve(data);
        });
    });
};

var getFile = function(dirPath) {
	return function(filename) { return fs.readFileAsync(dirPath +"/"+ filename, 'utf8'); };
    //return function(filename) { return fs.readFileAsync(dirPath +"/"+ filename); };
};



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
	    var dirPath = "history/"+req.body.date+"/"+req.body.userid;

	    // Check if user directory exists or not
		var exists = fs.existsSync(dirPath);		
		if(exists) {
			var summaryFiles = [];
			//http://www.yaoyuyang.com/2017/01/20/nodejs-batch-file-processing.html
			fs.readdirAsync(dirPath).then(function (filenames) {
			    return Promise.all(filenames.map(getFile(dirPath)));
			}).then(function (files) {
			    files.forEach(function(file) {
			    	//summaryFiles.push(JSON.parse(file));
			    	summaryFiles.push(file+"#HANUGAMESHISTORY#");
			    });
				var data = new Object();
				data.success = true;
				data.status_code = 200;
				data.message = "File data accessed successfully";
				data.data = summaryFiles;
				res.end(JSON.stringify(data));
			});
		} else {
			var data = new Object();
			data.success = true;
			data.status_code = 200;
			data.message = "File not found";
			res.end(JSON.stringify(data));			
		}
	}
})


function validateHistoryObject(data) 
{
	var ret_data = new Object();
	var message = [];
	ret_data.status = true;
	
	if(data)
	{
		if(typeof data.date === "undefined") {
			ret_data.status = false;
			message.push("Date missing");
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

		// if(typeof data.time === "undefined") {
		// 	ret_data.status = false;
		// 	message.push("Time missing");
		// } else {
		// 	if(data.time.trim() == "") {
		// 		ret_data.status = false;
		// 		message.push("Time should not be empty");				
		// 	}
		// 	if (isNaN(data.time)) {
		// 		ret_data.status = false;
		// 		message.push("Time should be integer");
		// 	}
		// }

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
