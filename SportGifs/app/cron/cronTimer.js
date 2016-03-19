var mongoose = require('mongoose');
var GifModel = require('../models/GifModel');
var CronJob = require('cron').CronJob;
var httpHelper = require('../services/httpHelper');
var async = require('async');

var cronJob = function () {
	

	new CronJob('59 * * * * *', function () {
		//var subreddits = ['nba', 'soccer'];
		var subreddits = ['nba', 'soccer','globaloffensive', 'rocketleague'];
		for (var i = 0; i < subreddits.length; i++) {
			var options = {
				host: 'www.reddit.com',
				path: '/r/' + subreddits[i] + '/.json?limit=100'
			}
			httpHelper.getData(options, initData);
		}
	}, null, true, 'America/Los_Angeles');

	function initData(redditPosts) {
		console.log('initdata');
		// find streamable gifs from posts
		var streamable = [];
		async.each(redditPosts.data.children, function (gif, callback) {
			if (gif.data.url.indexOf('streamable') > -1) {
				streamable.push(new GifModel(gif.data));
				callback();
			} else if (gif.data.url.indexOf('gfycat.com') > -1) {
				var gfycatVideoName = gif.data.url.split('/').pop();
				var options = {
					host: 'gfycat.com',
					path: '/cajax/get/' + gfycatVideoName
				}
				httpHelper.getData(options, function (data) {
					gif.data.url = data.gfyItem.mp4Url;
					streamable.push(new GifModel(gif.data));
					callback();
				});
			} else {
				callback();
			}
		}, function (err) {
			saveToDb(streamable, function () {
				if (err) console.log(err + ' saving failed');
				console.log('Done!');
			});
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
							console.log(gif.title + ' saved to the db');
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
