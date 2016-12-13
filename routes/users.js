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

router.get('/:user_id', function(req, res, next) {
  var userID = req.params.user_id;
  var queryParams = {
    TableName: 'demoUsers',
    Item: {
      user_id: userID
    }
  }

  docClient.query(queryParams, function(err, data){
    if (err){
      console.log(err);
    } else {
      console.log(data);
    }
  })

})


module.exports = router;
