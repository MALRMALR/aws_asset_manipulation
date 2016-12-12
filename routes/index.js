var express = require('express');
var router = express.Router();
var querystring = require('querystring');
// passport user authentication and authorization
var methodOverride = require('method-override');
var passport = require('passport');
var passportFacebook = require('passport-facebook');
var passportTokenStrategy = require('passport-facebook-token');
var FacebookStrategy = require('passport-facebook').Strategy;
var AWS = require('aws-sdk');
var docClient = new AWS.DynamoDB.DocumentClient();
// var db = require('./../db');
AWS.config.apiVersions = {
	dynamodb: '2012-08-10'
};

AWS.config.update({
	region: "us-west-2",
})

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID || '1167644066656429',
    clientSecret: process.env.FACEBOOK_APP_SECRET || 'ba49b34c7c2ec73e88382eeec9850c99',
    callbackURL: "http://gnappwithsockets.zhjpne8fw9.us-west-2.elasticbeanstalk.com/login/facebook/return",
    // callbackURL: 'http://localhost:8081/login/facebook/return',
    profileFields: ['id', 'displayName', 'photos', 'email'],
    enableProof: true
  },
  //success function
  function(accessToken, refreshToken, profile, cb) {
    // In this example, the user's Facebook profile is supplied as the user
    // record.  passes return profile data into user object and makes put request to users TableName

    var user = {
      'username' : profile.displayName.join("-"),
			'full_name': profile.displayName,
      'user_id'   : parseInt(profile.id),
      'token': accessToken
    }

    var params = {
      TableName: 'demoUsers',
      Item: user
    }

    docClient.put(params, function(err, data){
      if (err){
        console.log(err);
      } else {
        console.log(data);
      }
    })
    // pass access token into user profile // db records
    // will use access token every time makes request.

    return cb(null, user);

  }
));

// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser(function(user, done) {
  done(null, user.user_id);
});

passport.deserializeUser(function(user_id, done) {
  Users.findById(user_id, function (err, user) {
    done(err, user);
  });
});

// Configure the local strategy for use by Passport.
//
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.
// passport.use(new Strategy(
//   function(username, password, cb) {
//     db.users.findByUsername(username, function(err, user) {
//       if (err) { return cb(err); }
//       if (!user) { return cb(null, false); }
//       if (user.password != password) { return cb(null, false); }
//       return cb(null, user);
//     });
//   }));


// Configure Passport authenticated session persistence.
//

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
  /*
  [1.] Go out and create a folder on S3 using coordinates from client
  [2.]
  */
  // res.send(users);- are in geofence...?
  // tracks status of videos through pipeline
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
// router.post('/login', function(req, res) {
// 	passport.authenticate('local', {
// 		failureRedirect: '/login'
// 	})
// 	res.redirect('/projects')
// })
// router.get('/login', function(req, res) {
// 	res.render('login.jade', {message: 'Please Log In', title: 'Go Native API'});
// })
// router.get('/logout', function(req, res) {
// 	req.logout();
// 	res.redirect('/');
// })

//passport facebook
router.get('/login',
  function(req, res){
    res.render('login');
  });

router.get('/login/facebook',
  passport.authenticate('facebook'),
  function(req, res){
    res.redirect('/');
  });

router.get('/login/facebook/return',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/projects');
  });

router.get('/account',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    res.render('profile', { user: req.user });
  });


module.exports = router;
