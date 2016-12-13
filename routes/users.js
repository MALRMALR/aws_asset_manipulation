var express = require('express');
var router = express.Router();
var querystring = require('querystring');
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

router.get('/:username', function(req, res, next) {
  var userID = req.params.username;
  var queryParams = {
    TableName: 'demoUsers',
    IndexName: 'username',
    Key: {
      user_id: '10101038179242288',
			username: userID
    }
  }

  queryDatabase(queryParams, res, 'get');

})

// helper
function queryDatabase(params, response, action){

	switch(action){

		case 'scan':
		docClient.scan(params, function(err, data){
			if (err) console.log(err, err.stack);
			else response.json(data);
		})
		break;

		case 'get':
		docClient.get(params, function(err, data){
			if (err) console.log(err, err.stack);
			else response.json(data); // see in browser
		})
		break;

    case 'post':
    docClient.post(params, function(err, data){
      if (err) console.log(err, err.stack);
      else response.json(data);
    })
    break;

    case 'put':
    docClient.put(params, function(err, data){
      if (err) console.log(err, err.stack);
      else response.json(data);
    })
    break;

    // should we add some admin priveliges?
    case 'delete':
    docClient.delete(params, function(err, data){
      if (err) console.log(err, err.stack);
      else response.json(data);
    })
    break;

		case 'videoGet':
		docClient.get(params, function(err, data){
			// node = videos.Item.videos[0].id
			var i = 0;
			if (err) console.log(err, err.stack);
			else {
				var obj = data.Item;
				obj.forEach(function(item){
					console.log(item.videos[i].id + item.videos[i].upload_uri);
				})
			}
		})

    // how can i refactor this ugliness?
	}
}

module.exports = router;
