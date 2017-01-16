/*

1.  read s3 contents
2.  pass all video files into array
4.  make POST request to PROJECTS table with video array
5.  could use total number of .mov files in s3 to determine when to run project DB document creation

*/

// dependencies
var AWS = require('aws-sdk');
var uuid = require('node-uuid');
var ffmpeg = require('fluent-ffmpeg');
var command = ffmpeg();
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

var table = "demoProjects";

// var name = randomString(10);

var status = "pending";
// var id = parseInt(randomString(4));
//
// var dbObjectParams = {
//     TableName: table,
//     Item: {
//         "id": id,
//         "name": name,
//         "status": status,
//         "videos": [],
//         "tags": []
//     }
// };

// end db variables
var outboundS3Params = {
  Bucket: 'gn_outbound'
};
var holder = [];

function scanProjectsTable() {
  var count = 0;
  var params = {
    TableName : 'demoProjects'
  };
  // scan demoProjects dynamodb table
  docClient.scan(params, function(err, data){
    if (err) {
      console.log(err);
    } else {
      var records = data.Items;
      // pass records into array
      console.log(records);
      // return holder;
      console.log("=======================Project Video Array:=======================")
      // console.log(holder);
      var times = 0;
      // now you need to ffmpeg this shit into individual framesand send to outbound s3 bucket.
      // holder.forEach(function(videoFile){
        var directory = videoFile.upload_uri; // without .mov ext
        // create new directories in target s3 bucket
        // var command = ffmpeg(videoFile.upload_uri).FPSOutput(30);
        // console.log("============== Project Id: "+ projectID);
        console.log("INDEX: "+times); // array position
        console.log(directory);
        times++;

        // running executables in line in node js fils
        //http://www.2ality.com/2011/12/nodejs-shell-scripting.html
        // https://aws.amazon.com/blogs/compute/running-executables-in-aws-lambda/

        // 1 CREATE THE FOLDER OBJ
        // s3.createBucket(directory, function(){
          // s3.putObject({
          //   Bucket: 'gn-outbound',
          //   Key: directory + '/' + command
          // })
        // })
        //2.
        // console.log(vid);
        // CATCH ALL FUCKING FRAMES IN AN array
        //3.   UPLOAD TO OUTBOUND s3
        // run ffmpeg and export frames to respective folders
        // 4.  lambda code runs when new s3 obj in outbound bucket is created
        // 5.  alert abeds system to location.

        // once receive text files
        // 6.  render
        // questions
        // what is the most efficient way to pass all these images to the native c code?
        // how can we do this quickly?
        // what infrastructure can we leverage to ensure that all events get sent, everything completes, all alerts get setn, and its done quickly?

        // upon completion
      })
      // when outbound s3 bucket receives a new directoryu with new images, upon completion, fires lamdba - render
      // write rendering code.
    }
  })

}
