var http = require('http');
var mongoose = require('mongoose');
var GifModel = require('../models/GifModel');
var CronJob = require('cron').CronJob;
var async = require('async');

var cronJob = function () {
	/*new CronJob('* * * * * *', function () {
		console.log('You will see this message every second');
	}, null, true, 'America/Los_Angeles');*/

	var test = getDataFromReddit('nba', initData);
	
	function initData(redditPosts) {
		var gifs = redditPosts.data.children.filter(function (item) {
			return item.data.url.indexOf('streamable') > -1
		});

		var result = gifs.map(function (item) {
			return {
				title: item.data.title,
				url: item.data.url,
				permalink: item.data.permalink,
				subreddit: item.data.subreddit
			}
		});

		saveDataToDb(result);
	}
	
	function getDataFromReddit(channel, callback) {
		var options = {
			host: 'www.reddit.com',
			path: '/r/' + channel +'.json',
		}

		http.get(options, function (resp) {
			var body = '';
			resp.on('data', function (chunk) {
				body += chunk;
			}).on('end', function () {
				var parsed = JSON.parse(body);
				callback(parsed);
			}).on('error', function (e) {
				console.log('error', e);
			});
		});
	}

	function saveDataToDb(data) {
		var gifCollections = [];
		console.log(data.length);
		async.each(data, function (item, callback) {
			var gif = new GifModel(item);
			var query = GifModel.find({ url : gif.url });
			query.exec(function (err, item) {
				if (item.length > 0) {
					console.log('item found');
					callback();
				} else {
					gifCollections.push(item);
					callback();
				}
			});
		}, function (err) {
			console.log('done');
			console.log(gifCollections.length);
		});
	}
}

module.exports = cronJob;
