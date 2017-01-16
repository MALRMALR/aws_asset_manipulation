/*

1.  read s3 contents
2.  pass all video files into array
4.  make POST request to demoProjects DynamdoDB table with array of video objects
5.  could use total number of .mov files in s3 to determine when to run project DB document creation

*/

// dependencies
var AWS = require('aws-sdk');
var uuid = require('uuid');
AWS.config.apiVersion = {
	dynamodb: '2012-08-10',
	rds: '2014-10-31'
};

AWS.config.update({region: 'us-west-2'})
// invoke s3 object

var s3 = new AWS.S3();

// create all necessary db variables
var docClient = new AWS.DynamoDB.DocumentClient();

var table = "demoProjectsV3";

// https://www.paulirish.com/2009/random-hex-color-code-snippets/
// var name = '#'+Math.floor(Math.random()*16777215).toString(16);
var name = "demoProject"

var status = "pending";
var id = parseInt(randomString(4));
var videos = [];
var tags = []

var dbObjectParams = {
    TableName: table,
    Item: {
        "project_id": id,
        "name": name,
        "status": status,
        "videos": videos,
        "tags": tags
    }
};

var key = "";


// call inbound s3 bucket
module.exports = s3.createBucket({Bucket: 'gn-inbound'}, function() {

	var params = {
  	Bucket: 'gn-inbound'
	};

  var bucketContents = [];
  var movieHolder = [];

  // HTTP GET-like req to S3 bucket "gn_inbound"
  s3.listObjectsV2(params, function(err, data) {

    if (err) {
      console.log(err, err.stack);
    } else {

      // pass contents of bucket into movieHolder array
      bucketContents = data.Contents;
      // console.log(bucketContents);

      // loop through array and pass any movie files into movieHolder array
      bucketContents.forEach(function(item){

        var file = (/\.(mov)$/i).test(item.Key)
        // REGEX matching any files with .mov file extension
        if (file === true) {
          movieHolder.push(item.Key);
        }
      })

    }
    // write movieHolder array to console
    console.log(movieHolder);

    // Video object schema: projectVideoArraySchema.js
    // pass movie file URIs into object being passed to DB
    var i = movieHolder.length;

    // where is the logic to manage these assets?
    // how do we group assets

    movieHolder.forEach(function(videoFileLink){
      var uri = 'http://gn-inbound.s3.amazonaws.com/' + videoFileLink;
      if (i > 0){
        dbObjectParams.Item.videos[i] = {
          'id': uuid.v1(),
          'upload_uri': encodeURI(uri),
          'state': 'uploading',
          'complete': 'true',
          'description': 'desc',
          'metadata_url': 'meta-data-url-will-go-here'
        }
        i--;
      }
    });

    // send PUT request to DynamoDb if videos is not null and there is more than one
    if (dbObjectParams.Item.videos !== null && dbObjectParams.Item.videos.length > 4) {
      makeDBRecord(dbObjectParams);
      console.log(dbObjectParams);
    } else {
      console.log('not enough videos have finished uploading to make new project')
    }

    // process videos into frames

    // drop frames into new s3 bucket - or on node server - with buffers / sterams

    // notify abeds system of new files
    // wait for text files in another s3 bucket?
    // fire lambda
    //READ AGAIN https://tomkersten.com/articles/server-sent-events-with-node/

  });

});


// utility functions
function makeDBRecord(dbObjectParams){
  console.log("Adding a new item...");
  // begin post request using DynamoDB Document client interface
  docClient.put(dbObjectParams, function(err, data) {
    // maybe need catch for identical ids. - should maybe just increment from starting value ?
    if (err) {
      console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
      console.log("Added item:", JSON.stringify(data, null, 2));
    }
  });
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
