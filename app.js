var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var querystring = require('querystring');
var AWS = require('aws-sdk');
AWS.config.update({
	region: "us-west-2",
})

// AWS config
var docClient = new AWS.DynamoDB.DocumentClient();

AWS.config.apiVersions = {
  dynamodb: '2012-08-10',
	rds: '2014-10-31'
};

var index = require('./routes/index');
var users = require('./routes/users');
var projects = require('./routes/projects');

var app = express();
// var mysql = require('mysql');
//
// var connection = mysql.createConnection({
//   host     : 'gnnodeapisocketsdbinstance.chtzfafukduc.us-west-2.rds.amazonaws.com',
//   user     : 'gonativedbadmin',
//   password : 'GoNativeAWSDb',
//   port     : '3306'
// });


// sockets
var server = require('http').Server(app);
var io = require('socket.io')(server);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(function(req, res, next){
  res.io = io;
  next();
})
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/projects', projects);

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

module.exports = {app: app, server: server};
