'use strict';

var path = process.cwd();
require('dotenv').config({silent: true});
var Bing = require('node-bing-api')({ accKey: process.env.BING_KEY });
var Search = require('../models/search');


module.exports = function (app) {
	
	app.get('/',function (req, res) {
		res.sendFile(path + '/public/index.html');
	});
	
	app.get('/imagesearch/:search(*)',function (req, res) {
		res.setHeader('Content-Type', 'application/json');
		var offset = req.query.offset ? req.query.offset : 0;
		var search = req.params.search;
		
		var newSearch = new Search({term: search,when: Date.now()});
			
		newSearch.save(function (err, data) {
			if (err) console.log(err);
			else console.log('Saved : ', data );
		});
		
		
		
		Bing.images(search, {skip: offset * 10, top: 10}, function(err, results, body){
		  	if (err) console.log(err)
		  	else{
		  		var images = [];
		  		body.d.results.forEach(function (img){
		  			images.push({
						url: img.MediaUrl,
						snippet: img.Title,
						thumbnail: img.Thumbnail.MediaUrl,
						context: img.SourceUrl
						})
		  			
		  		})
				res.json(images);
		  	}
		});
	
	});	
	
	app.get('/searches',function (req, res) {
		Search.find({}, 'term when -_id',function(err, searches) {
		  	if (err) console.log(err);
		    res.send(searches);  
		});
	});
};
