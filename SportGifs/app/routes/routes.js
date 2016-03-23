var mongoose = require('mongoose');
var GifModel = require('../models/GifModel');
var CronJob = require('cron').CronJob;
var GifsService = require('../services/gifsService');

var routes = function (app) {
	/*
	 * GET ROUTES
	 */

	app.get('/api/gifs/:subCategory', function (req, res) { 
		var category = req.params.subCategory;
		GifsService.getGifsByCategory(category, function (err, gifs) {
			if (err) res.send(err);
			res.json(gifs);
		});
	});

	app.get('/api/gifs/:subCategory/:limit', function (req, res) {
		var category = req.params.subCategory;
		var limit = req.params.limit;
		console.log(limit);
		var result = GifsService.getGifsByCategoryLimit(category, limit, function (err, gifs) {
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