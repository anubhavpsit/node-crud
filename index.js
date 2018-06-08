var express = require('express');
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');
var path = require('path');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


// Add history
app.use('/v1/add', require('./routes/addHistory'));

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