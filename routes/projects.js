var express = require('express');
var router = express.Router();
// aws variables
var myTable = 'demoProjectsV3';
// call dependency packages
var express = require('express');
var querystring = require('querystring');
var bodyParser = require('body-parser');
var AWS = require('aws-sdk');
var docClient = new AWS.DynamoDB.DocumentClient();

AWS.config.apiVersions = {
	dynamodb: '2012-08-10'
};
AWS.config.update({
	region: "us-west-2",
})
/// routes

router.post('/', function(req, res) {
	//makes db record based on current videos in s3 bucket
	// var dbRecord = require('./../lambda/makeDBRecord.js');
	// need to make this an executable function
	console.log("new db record");
	// res.json({message: 'success'});
  res.end();
})
router.get('/', function(req, res) {
		// res.json({message: 'GET to /PROJECTS'})
		scanProjectsTable(res);
		// console.log('scanning all projects');
	})
	////////////////////////////////////////////////////////////////////////
	////----> HTTP ROUTE: /GET/ http://localhost:8080/projects/:project_id     //////////////
	////----> HTTP ROUTE: /PUT/ http://localhost:8080/projects/:project_id     //////////////
	////----> HTTP ROUTE: /DELETE/ http://localhost:8080/projects/:project_id  //////////////
	////////////////////////////////////////////////////////////////////////
router.get('/:project_id', function(request, response) {
		// grab id from url
		var projId = request.params.project_id;
		// set up input project object
		var dbCallParams = {
				TableName: myTable,
				IndexName: 'project_id',
				Key: {
					project_id: parseInt(projId),
					name: 'demoProject' // all are named demo project
				}
			}
			// console.log("DB CALL PARAMS: "+ JSON.stringify(dbCallParams));
			// pass into execution helper function
		queryDatabase(dbCallParams, response, 'get');
	})
	//update project with given id
router.put('/:project_id', function(request, response) {
		var projId = request.params.project_id;
		var dbCallParams = {
			TableName: myTable,
			IndexName: 'project_id',
			Key: {
				project_id: parseInt(projId),
				name: 'demoProject'
					// need query string to pass in?
			}
		};
		queryDatabase(dbCallParams, response, 'put');
	})
	// delete this project
router.delete('/:project_id', function(request, response) {
		// url id
		var projId = request.params.project_id;
		var dbCallParams = {
			TableName: myTable,
			IndexName: 'project_id',
			Key: {
				project_id: parseInt(projId),
				name: 'demoProject'
			}
		};
		queryDatabase(dbCallParams, response, 'delete');
	})
	////////////////////////////////////////////////////////////////////////
	////----> HTTP ROUTE: /GET/ localhost:8080/projects/findByStatus ///
	////////////////////////////////////////////////////////////////////////
	// router.get('/projects/findByStatus', function(request, response) {
	// 	response.send('{endpoint: find by status}');
	//   // findProjectBy('status', 'status-code');
	// })
	////////////////////////////////////////////////////////////////////////
	////----> HTTP ROUTE: /GET/ localhost:8080/projects/findByTags ////
	////////////////////////////////////////////////////////////////////////
	// router.get('/projects/findByTags', function(request, response) {
	// 	response.send('{endpoint: find by tags}');
	// 	// findProjectBy('tags')
	// })
	////////////////////////////////////////////////////////////////////////
	///////////////////////////// ADDITIONAL ROUTES ios ////////////////////
	////////////////////////////////////////////////////////////////////////
  function scanProjectsTable(res) {
    // should this be global object if moving files after passing to app?
    var movieURIHolderArray = [];
    var count = 0;
    var params = {
      TableName : myTable
    };
    docClient.scan(params, function(err, data){
      if (err) {
        console.error(err, err.stack);
      } else {
        var records = data.Items;
				if (records){
					res.send(JSON.stringify(records));
				}

  			// lloop through all records
        records.forEach(function(proj){
          // console.log(proj);
          var videoArray = proj.videos;
          // console.log(proj.videos)
  					videoArray.forEach(function(item){


  					})// end videoArray foreach loop

        } // end record foreach
  		);
      }
    }) // end doc scan

  }

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
	    // else console.log(data);
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
