var mongoose = require('mongoose');
var GifModel = require('../models/GifModel');
var CronJob = require('cron').CronJob;
var httpHelper = require('../services/httpHelper');
var async = require('async');

var cronJob = function () {
	var options = {
		host: 'www.reddit.com',
		path: '/r/nba/.json?limit=100'
	}

	new CronJob('59 * * * * *', function () {
		var subreddits = ['nba'];
		for (var i = 0; i < subreddits.length; i++) {
			httpHelper.getData(options, initData);
		}
	}, null, true, 'America/Los_Angeles');

	function initData(redditPosts) {
		// find streamable gifs from posts
		var streamable = redditPosts.data.children.filter(function (item) {
			return item.data.url.indexOf('streamable') > -1
		});
		
		// make mongoose schema GifModels
		var gifs = streamable.map(function (item) {
			return new GifModel(item.data);
		});
		
		saveToDb(gifs, function (err) {
			if (err) console.log(err + ' saving failed');
			console.log('Done!');
		});
	};
	
	function saveToDb(data, cb) {
		console.log('saving gifs to database');
		async.each(data, function (gif, callback) {
			var query = GifModel.find({ url : gif.url });
			query.exec(function (err, item) {
				if (item.length > 0) {
					callback();
				} else {
					// if the gif didn't find from db. Save it to the db.
					gif.save(function (err) {
						if (err) {
							console.log(err + ' error saving the data to database');
						} else {
							console.log(gif.title + 'saved to the db');
						}
						callback();
					});
				}
			});
		}, function (err) {
			if (err) cb(err);
			cb(null);
		});
	}
}

module.exports = cronJob;
