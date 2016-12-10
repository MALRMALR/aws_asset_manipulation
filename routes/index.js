var express = require('express');
var router = express.Router();
var querystring = require('querystring')

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
	res.render('login.jade');
})
router.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
})

module.exports = router;
