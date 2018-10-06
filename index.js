var express = require('express');
var fileUpload = require('express-fileupload');
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');
var path = require('path');
//var busboy = require('connect-busboy');
//var Busboy = require('busboy');
var db = require('./models/db_connection');


app.use(fileUpload());
// var mysql = require('mysql')
// var connection = mysql.createConnection({
//   host     : 'localhost',
//   user     : 'root',
//   password : 'Qwerty1!',
//   database : 'unyde_api'
// });

// connection.connect()

// connection.query('SELECT * FROM store_master', function (err, rows, fields) {
//   if (err) throw err
//   console.dir(rows);
//   //console.log('The solution is: ', rows[0].solution)
// })

// connection.end()



// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('views', __dirname+'/views/');
app.set('views',  [
  path.join(__dirname, 'views'),
  path.join(__dirname, 'views/stores'),
  path.join(__dirname, 'views/company')
]);

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '/public')));

// Home Page
app.use('/', require('./routes/home'));
app.use('/stores', require('./routes/stores'));
app.use('/company', require('./routes/company'));

// Add history
app.use('/v1/add', require('./routes/addHistory'));
// Get history
app.use('/v1/get', require('./routes/getHistory'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var server = app.listen(3001, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Server listening at http://%s:%s", host, port)
});

module.exports = app;