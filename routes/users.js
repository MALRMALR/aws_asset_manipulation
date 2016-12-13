var express = require('express');
var router = express.Router();

//AWS config
var AWS = require('aws-sdk');
var docClient = new AWS.DynamoDB.DocumentClient();
AWS.config.apiVersion = {
	dynamodb: '2012-08-10',
	rds: '2014-10-31'
};

AWS.config.update({region: 'us-west-2'})

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.io.emit("socketToMe", "users");
  // res.send('respond with a resource.');
  docClient.get(params, function(err, data){
    if (err) console.log(err, err.stack);
    else response.json(data); // see in browser
  })
});

module.exports = router;
