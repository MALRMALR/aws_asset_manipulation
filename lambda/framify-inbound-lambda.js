var AWS = require('aws-sdk');
var uuid = require('node-uuid');

// aws api config
AWS.config.apiVersions = {
  dynamodb: '2012-08-10'
};

AWS.config.update({
  region: "us-west-2"
});

// invoke s3 object

var s3 = new AWS.S3();

// create all necessary db variables
var docClient = new AWS.DynamoDB.DocumentClient();

var table = "demoProjectsV3";

exports.handler = function(event, context) {
  console.log('received event');
  console.log(event);
  var s3Params = {
    Bucket: event.Bucket,
    Key: event.Key
  }
  s3.getObject(s3Params, function(err, data){
      if (err) {
        console.log(err, err.stack);
      } else {
        console.log(data);
      }
    })
}
