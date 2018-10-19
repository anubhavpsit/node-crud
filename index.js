var express = require('express');
var fileUpload = require('express-fileupload');
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');
var path = require('path');
var db = require('./models/db_connection');
var config = require('./config');

app.use(fileUpload());

app.set('views',  [
  path.join(__dirname, 'views'),
  path.join(__dirname, 'views/stores'),
  path.join(__dirname, 'views/company'),
  path.join(__dirname, 'views/offers')
]);

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '/public')));

// Home Page
app.use('/', require('./routes/home'));
app.use('/stores', require('./routes/stores'));
app.use('/company', require('./routes/company'));
app.use('/offers', require('./routes/offers'));
app.use('/RequestManager', require('./routes/RequestManager.js'));

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

var server = app.listen(config.default.port, function () {
  var host = config.default.server
  var port = config.default.port
  console.log("Server listening at http://%s:%s", host, port)
});

module.exports = app;