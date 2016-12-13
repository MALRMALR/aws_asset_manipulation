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

router.get('/chatroom',
	function(req, res, next) {
		res.render('chat');
	})

module.exports = router;
