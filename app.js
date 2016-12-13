var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var querystring = require('querystring');
var passport = require('passport');
var passportFacebook = require('passport-facebook');
var FacebookStrategy = require('passport-facebook').Strategy;
require('dotenv').config();
// AWS config
var AWS = require('aws-sdk');
var docClient = new AWS.DynamoDB.DocumentClient();
AWS.config = {
  apiVersions: {
    dynamodb: '2012-08-10',
		rds: '2014-10-31'
  },
  update: {
    region: 'us-west-2'
  }
}

// routes
var index = require('./routes/index');
var users = require('./routes/users');
var projects = require('./routes/projects');
var chat = require('./routes/chat');

// instantiate express and require mysql
var app = express();
var mysql = require('mysql');
// var pool = mysql;
//
// var connection = mysql.createConnection({
//   host     : 'gnnodeapisocketsdbinstance.chtzfafukduc.us-west-2.rds.amazonaws.com',
//   user     : 'gonativedbadmin',
//   password : 'GoNativeAWSDb',
//   port     : '3306'
// });
//
//
// connection.connect(function(err) {
//   if (err) throw err
//   console.log('You are now connected...')
// })

// web sockets
var server = require('http').Server(app);
// var io = require('socket.io')(server);
var io = require('socket.io').listen(app.listen(8081));
// writes to console all io connection events
// chatroom
io.on('connection', function(socket){
	console.log('a user connected');
	socket.on('disconnect', function(){
		console.log('user disconnected');
	})
})

io.sockets.on('connection', function (socket) {
    socket.emit('message', { message: 'welcome to the chat' });
    socket.on('send', function (data) {
        io.sockets.emit('message', data);
    });
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'))
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(function(req, res, next){
  res.io = io;
  next();
})
app.use(logger('dev'));
app.use(bodyParser.json()); // supports json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));  // supports url encoded bodies
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// add passport middleware for auth
app.use(passport.initialize());
app.use(passport.session());

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
