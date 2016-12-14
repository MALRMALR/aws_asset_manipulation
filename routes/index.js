var express = require('express');
var router = express.Router();
var querystring = require('querystring');
var fs = require('fs');
// passport user authentication and authorization
var methodOverride = require('method-override');
var passport = require('passport');
var passportFacebook = require('passport-facebook');
var passportTokenStrategy = require('passport-facebook-token');
var FacebookStrategy = require('passport-facebook').Strategy;
var Q = require('q');
var AWS = require('aws-sdk');
var uuid = require('node-uuid');
// var db = require('./../db');
AWS.config.apiVersion = {
	dynamodb: '2012-08-10',
	rds: '2014-10-31'
};

AWS.config.update({region: 'us-west-2'});


var s3 = new AWS.S3();
var docClient = new AWS.DynamoDB.DocumentClient();

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
      'token': accessToken,
			'isLoggedIn': true
    }
		// console.log(user);
    var userParams = {
      TableName: 'demoUsers',
      Item: user
    }

		// will make a new user id if one does not exist with
		// existing fb id and profile.displayName
    docClient.put(userParams, function(err, data){
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

	docClient.scan({TableName: demoUsers, Keys: {HashKey: 'user_id'}}, function(err, data){
		if (err){
			console.log(err);
		} else {
			console.log(data);
		}
	})
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

router.post('/upload', function(req, res, next) {

	// {
	// 	'Content-Type': 'MP4',
	// 	'Content-Disposition': 'inline || attachment || attachment; filename="filename.jpg"',
	// 	'Content-Length': req.body["Content-Length"],
	// 	'Video-URL': req.body["Video-URL"]
	// }
	//
	// var videoHeaders = {
	// 	'Content-Type': req.params.Body["Content-Type"],
	// 	'Content-Disposition': req.params.Body["Content-Disposition"],
	// 	'Content-Length': req.params.Body["Content-Length"],
	// 	'payload': req.body.Body["payload"]
	// }
	// upload individual viddo assets and imu data.

	// naming convention

	console.log(req.params);
	var objParams = {
		Bucket: 'gn-inbound',
		Key: 'testvideo.txt',
		Body: 'fuckkkkkkyou'
	}


	s3.upload(objParams, function(err, data){
		console.log(err, data);
	});

	res.json(data);

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

router.post('/login', function(req, res, next) {
	passport.authenticate('local', {
		failureRedirect: '/login'
	})
	res.redirect('/projects')
})
router.get('/login', function(req, res, next) {
	res.render('login.jade', {message: 'Please Log In', title: 'Go Native API'});
})
router.get('/logout', function(req, res, next) {
	req.logout();
	res.redirect('/');
})

//passport facebook routes
// PLEASE be mindful of callback baseURLS (line 24) if you are deploying (e.g. localhost -> EBS);
router.get('/login',
  function(req, res, next){
    res.render('login');
  });

// router.get('/login/facebook',
//   passport.authenticate('facebook'),
//   function(req, res, next){
//     res.redirect('/');
//   });
//
// router.get('/login/facebook/return',
//   passport.authenticate('facebook', { failureRedirect: '/login' }),
//   function(req, res, next) {
//     res.redirect('/');
//   });
//
// router.get('/account',
//   // require('connect-ensure-login').ensureLoggedIn('/login'),
//   function(req, res, next){
//     res.render('profile', { user: req.user });
//   });
//

// utility
function isAuthenticated(){
	// scan dynamo db
	// if token client sends matches one in db - good to go

}
function randomString(length) {
    var chars = '123456789'.split('');

    if (! length) {
        length = Math.floor(Math.random() * chars.length);
    }

    var str = '';
    for (var i = 0; i < length; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
}

module.exports = router;
