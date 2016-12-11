var express = require('express');
var router = express.Router();
var querystring = require('querystring');
// passport user authentication and authorization
var methodOverride = require('method-override');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var db = require('./../db');

// Configure the local strategy for use by Passport.
//
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.
passport.use(new Strategy(
  function(username, password, cb) {
    db.users.findByUsername(username, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if (user.password != password) { return cb(null, false); }
      return cb(null, user);
    });
  }));


// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  db.users.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Go Native API' });
});

router.get('/upload', function(req, res) {
	res.send({
		'message': 'getting /upload'
	});
	/*  */
});
router.post('/upload', function(req, res) {
	res.send({
		'message': 'posting to /upload'
	});
})
router.get('/videos/:id', function(request, response) {
		var video_id = request.params.id;
		var apiCallParams = {
			TableName: 'demoProjectsV3',
			Key: {
				id: video_id,
				name: 'demoProject'
			}
		}
		queryDatabase(apiCallParams, response, 'videoGet');
	})
	// routes for iOS client
router.put('/record', function(req, res) {
	// client tells server to start new recording session
	// server notifies client of users in recording session
	// server tells all clients that recording session is completed and being processed
	// {
	// 	latitude: 22
	// 	longitude: 44.9922
	// }
	var coordinates = querystring.parse(req.url.split("?")[1])
	res.json(coordinates);
  // res.send(users);- are in geofence...?
	/*
	1.  Client tells server to start new project recording session - latitude and longitude
	2.  Server responds with existing && current users in geofence
	3.  server tells all clients that recording session is completed and being processed - sockets
	4.  server sends notification via web sockets
	5.  loads cloudfront
	6.  sockets
	*/
	// res.json({ 'message': '/PUT/ => /record'});
})
router.post('/login', function(req, res) {
	passport.authenticate('local', {
		successRedirect: '/latest/projects',
		failureRedirect: '/latest/login'
	})
	res.redirect('/projects')
})
router.get('/login', function(req, res) {
	res.render('login.jade', {message: 'Please Log In', title: 'Go Native API'});
})
router.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
})

module.exports = router;
