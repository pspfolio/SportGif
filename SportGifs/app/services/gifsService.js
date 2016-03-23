﻿(function () {
	
	var GifModel = require('../models/GifModel');

	var GifsService = function () { };
	
	GifsService.prototype.getGifsByCategory = function (category, cb) {
		var query = GifModel.find({ subreddit: category }).sort({ created_at: -1 });
		execQuery(query, cb);
	};
	
	GifsService.prototype.getGifsByCategoryLimit = function (category, limit, cb) {
		var query = GifModel.find({ subreddit: category }).sort({ created_at: -1 }).limit(+limit);
		execQuery(query, cb);
	}
	
	function execQuery(query, cb) {
		query.exec(function (err, gifs) {
			if (err) cb(err, null);
			console.log('returning from service');
			cb(null, gifs);
		});
	}

	module.exports = new GifsService();
}());