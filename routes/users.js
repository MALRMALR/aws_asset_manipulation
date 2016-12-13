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
  var params = {
    TableName: 'demoUsers'
  }
  docClient.scan(params, function(err, data){
    if (err){
      console.log(err);
    } else {
      // console.log(data);
      res.send(data);
      res.end();
    }
  })
});

module.exports = router;
