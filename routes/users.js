var express = require('express');
var router = express.Router();
// passport user authentication and authorization
var methodOverride = require('method-override');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var db = require('./db');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.io.emit("socketToMe", "users");
  res.send('respond with a resource.');
});

module.exports = router;
