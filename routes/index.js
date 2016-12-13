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
AWS.config = {
  apiVersions: {
    dynamodb: '2012-08-10'
  },
  update: {
    region: 'us-west-2'
  }
}

passport.use(new FacebookStrategy({
		clientID: process.env.FACEBOOK_APP_ID,
		clientSecret: process.env.FACEBOOK_APP_SECRET,
		callbackURL: "http://gnappwithsockets.zhjpne8fw9.us-west-2.elasticbeanstalk.com/login/facebook/return",
		profileFields: ['id', 'displayName', 'photos', 'email'],
		enableProof: true
  },
  //success function
  function(accessToken, refreshToken, profile, done) {
    // In this example, the user's Facebook profile is supplied as the user
    // record.  passes return profile data into user object and makes put request to users TableName
		var username = profile.displayName.split(" ");
    var user = {
			'username': username.join("_"),
			'first_name': username[0],
			'last_name': username[1],
			'photo': profile._json.picture.data.url,
      'user_id': parseInt(profile.id),
      'token': accessToken
    }
		// console.log(user);
    var params = {
      TableName: 'demoUsers',
      Item: user
    }
		// will make a new user id if one does not exist with
		// existing fb id and profile.displayName
    docClient.put(params, function(err, data){
      if (err){
        console.log(err);
      } else {
        console.log(data);
      }
    })
    // pass access token into user profile // db records
    // will use access token every time makes request.

    return done(null, user);

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
// (`username` and `password`) s, nextubmitted by the user.  The function must verify
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

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Go Native API v0.0.1' });
});


router.get('/upload', function(req, res, next) {
	res.send({
		'message': 'getting /upload'
	});
});

router.post('/upload', function(req, res, next) {

	var payload = {
		'Content-Type': req.body["Content-Type"],
		'Content-Disposition': req.body["Content-Disposition"],
		'Content-Length': req.body["Content-Length"],
		'Video-URL': 's3-url-will-go-here.mov'
	}
	res.json(payload);
	// res.end();


})

router.get('/videos/:id', function(req, res, next) {
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
router.put('/record', function(req, res, next) {
	// client tells server to start new recording session
	// server notifies client of users in recording session
	// server tells all clients that recording session is completed and being processed
	// {
	// 	latitude: 22
	// 	longitude: 44.9922
	// }
	var coordinates = querystring.parse(req.url.split("?")[1])
	res.json(coordinates);
	// go out on s3 - save file path - can post /list/to/file/video.mp4
	// even though 'folders' don't really exist on S3
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
}) // end record


// router.post('/login', function(req, res, next) {
// 	passport.authenticate('local', {
// 		failureRedirect: '/login'
// 	})
// 	res.redirect('/projects')
// })
// router.get('/login', function(req, res, next) {
// 	res.render('login.jade', {message: 'Please Log In', title: 'Go Native API'});
// })
// router.get('/logout', function(req, res, next) {
// 	req.logout();
// 	res.redirect('/');
// })

//passport facebook routes
// PLEASE be mindful of callback baseURLS (line 24) if you are deploying (e.g. localhost -> EBS);
router.get('/login',
  function(req, res, next){
    res.render('login');
  });

router.get('/login/facebook',
  passport.authenticate('facebook'),
  function(req, res, next){
    res.redirect('/');
  });

router.get('/login/facebook/return',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res, next) {
    res.redirect('/');
  });

router.get('/account',
  require('connect-ensure-login').ensureLoggedIn('/login'),
  function(req, res, next){
    res.render('profile', { user: req.user });
  });

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

module.exports = router;
