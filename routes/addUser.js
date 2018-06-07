var express = require('express');
var router = express.Router();

router.post('/addUser', function (req, res) {
	console.log("THE REQUST CAME");
	//console.dir(req);
    res.writeHead(200, {'Content-Type': 'text/json'});
	var data = new Object();
	data.success = true;
	data.status_code = 200;
	data.message = "User added";
    res.end(JSON.stringify(data));
})



module.exports = router;
