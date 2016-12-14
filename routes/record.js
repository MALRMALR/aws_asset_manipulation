var express = require('express');
var expressWs = require('express-ws')(express());
var event = require('events').EventEmitter();
var router = expressWs.app;
// aws variables
var myTable = 'demoProjectsV3';
// call dependency packages
var express = require('express');
var querystring = require('querystring');
var bodyParser = require('body-parser');
var AWS = require('aws-sdk');
var docClient = new AWS.DynamoDB.DocumentClient();
var io = require('socket.io')();
AWS.config.apiVersion = {
	dynamodb: '2012-08-10',
	rds: '2014-10-31'
};

AWS.config.update({region: 'us-west-2'})
/// routes

router.get('/', function(req, res, next) {
	// io.sockets.emit('scream', { message: 'SCREAMMMMMMMM?' });
  res.render('record');
	res.end();
});

router.put('/', function(req, res){
		var incomingLatitude =  req.body.latitude,
				incomingLongitude =  req.body.longitude;

		// need to save to dynamo db...

		// obj creation -lambda - will register - video.

		//

		var objParams = {
			latitude: incomingLatitude,
			longitude: incomingLongitude
		}
		var body = [];
		req.on('data', function(chunk) {
		  body.push(chunk);
		}).on('end', function() {
		  body = Buffer.concat(body).toString();
		  // at this point, `body` has the entire request body stored in it as a string
			res.send(body);
		});
		// console.log(objParams);
		// now go look  for users that are signed in - send to client
		// video - processing: true - progress...

		// once video is received, final video and meta data sent to all clients

		//
		res.end();

})

router.ws('/hp', function(ws, req) {
    console.log('connect ws');
    next();
});


function beginRecordingSession(projectPath, req, res){
	var projectUsers = [];
	// 1.  look up all users, if they are isLoggedIn === true, return users
	var projectCoordinates = projectPath;
	var i = projectUsers.length; // hard coding all logged in users belong to project
	// begin waterfall
	Q.fcall(
		// scan users table
		docClient.scan({TableName: 'demoUsers'}, function(err, data){
			if (err){
				console.log(err);
			} else {
				var userPool = data.Items;
				// [1.] Read through users and pass any active users into projectUsers array
				if (userPool){
					userPool.forEach(function(data){
						// console.log(data.username);
						var user = {
							username: data.username,
							user_id: data.user_id
						};
						if (data.isLoggedIn == true){
							projectUsers.push(user);
						}
						i++;
					})
				}
			}
		}))
		// update db record
		/*
		projectUsers keeps getting passed in as an empty array.

		*/

		.then(updateProjectRecord(projectUsers, projectCoordinates))
		// create corresponding "folder" path with proj.txt inside on S3
		.then(createFolderOnS3(projectCoordinates, res))

}
// if record already exists, update, if not, create new one.
function updateProjectRecord(projectUsers, projectCoordinates){
	// write array to project
	var projParams = {
		TableName: 'demoProjectsV3',
		Item: {
			"name": projectCoordinates,
			"project_id": parseInt(randomString(4)),
			"s3_folder": "http://gn-inbound.s3.amazonaws.com/" + projectCoordinates,
			"project_users": projectUsers
		}
	};
	docClient.put(projParams, function(err, data){
		if (err){
			console.log(err);
		} else {
			console.log(data);
		}
	})

}
// goes out and creates "folder" w/ corresponding name on s3
function createFolderOnS3(projectCoordinates, res){
	s3.putObject({Bucket: 'gn-inbound', Key: projectCoordinates+"/ready.txt"}, function(err, data){
		if (err){
			console.log(err);
		} else {
			res.io.emit('s3Path', data);
			res.end();
		}
	})
}



module.exports = router
