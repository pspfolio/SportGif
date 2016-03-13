var mongoose = require('mongoose');
var GifModel = require('../models/GifModel');
var CronJob = require('cron').CronJob;

var routes = function (app) {
	/*
	 * GET ROUTES
	 */

	app.get('/api/gifs/:subCategory', function (req, res) {
		var category = req.params.subCategory;
		var query = GifModel.find({subreddit: category}).sort({created_at: -1});
		query.exec(function (err, gifs) {
			if (err) res.send(err);
			
			res.json(gifs);
		});
	});
	
	/*
	 * POST ROUTES
	 */

	app.post('/api/gifs', function (req, res) {
		var gif = new GifModel(req.body);
		console.log(gif);
		gif.save(function (err) {
			if (err) res.send(err);
			
			res.json(req.body);
		});
	});


};

module.exports = routes;