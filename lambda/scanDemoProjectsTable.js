/*

1.  read s3 contents
2.  pass all video files into array
4.  make POST request to demoProjects DynamdoDB table with array of video objects
5.  could use total number of .mov files in s3 to determine when to run project DB document creation

*/

// dependencies
var AWS = require('aws-sdk');
var uuid = require('node-uuid');

var async = require('async');

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


// call inbound s3 bucket
// exports.handler =

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

function scanProjectsTable() {
  // should this be global object if moving files after passing to app?
  var movieURIHolderArray = [];
  var count = 0;
  var params = {
    TableName : 'demoProjects'
  };
  docClient.scan(params, function(err, data){
    if (err) {
      console.log(err);
    } else {
      var records = data.Items;
      records.forEach(function(proj){
        console.log(proj);
        var videoArray = proj.videos;
        // console.log(proj.videos)
        if (videoArray){

        }
        videoArray.forEach(function(item){
          // pass video URLs into holder array
          // movieURIHolderArray.push(item[0]['upload_uri']);
          // console.log(item);
          // console.log(item["upload_uri"]);

          // I need to be able to copy this and pass it around to other AWS services.
          // instantiate s3 object

          // 1. - ffmpeg - invoke executable bash script

          // 2. - ping abeds server and notify him that new files are available

          // copy images to new s3 location

          // 3. - return txt file -

          // RENDERING

          // 4. - new video file is outputted to final S3 bucket

          // 5. new s3 object creation emits event - fires lambda code

          // 6. fires up chat server, and sends notification once rendering is complete.

          // 7.  user object associates with project and other users.  (future)
        })
      });
    }
  })

}

//
// async.waterfall([
//   scanProjectsTable
//   // videoCollection
// ])

// scanProjectsTable();
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

// remove video files after they are passed into a Project object - move to subdirectory
