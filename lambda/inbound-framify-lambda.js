var AWS = require('aws-sdk');
var uuid = require('node-uuid');
var Q = require('q');
var fs = require('fs');


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


s3.createBucket({Bucket: 'gn-inbound'}, function() {
    // console.log("HI");
  	var s3CallParams = {
    	Bucket: 'gn-inbound',
      Prefix: 'public/development/projects'
  	};

    var bucketContents = [];
    var movieHolder = [];

    // listObjectsV2 method - the revised List Objects API and we recommend you use this revised API for new application development.
    s3.listObjectsV2(s3CallParams, function(err, data) {

      if (err) {
        console.log(err, err.stack);
      } else {

        // pass contents of bucket into movieHolder array
        bucketContents = data.Contents;
        // console.log(bucketContents);
        // console.log(data);

        // loop through array and pass any movie files into movieHolder array
        bucketContents.forEach(function(item){
          var file = (/\.mp4/ig).test(item.Key);
          // console.log(item);
          //REGEX matching any files with .mov file extension
          if (file === true) {
            movieHolder.push(item.Key);
          //   console.log(item);
          }

        });
        console.log(movieHolder)


    }; // end s3 listObjects call
  });  // end s3 createBucket
});
