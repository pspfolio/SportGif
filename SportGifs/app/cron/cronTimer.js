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

		var gifsToAdd = getListOfGifsToAddDb(result, addDataToDb);
	}
	
	function getDataFromReddit(channel, callback) {
		var options = {
			host: 'www.reddit.com',
			path: '/r/' + channel + '/.json?limit=100'
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

	function getListOfGifsToAddDb(data, cb) {
		var gifCollection = [];
		console.log(data.length);
		async.each(data, function (item, callback) {
			var gif = new GifModel(item);
			var query = GifModel.find({ url : gif.url });
			query.exec(function (err, item) {
				if (item.length > 0) {
					console.log('item found');
					callback();
				} else {
					gifCollection.push(gif);
					callback();
				}
			});
		}, function (err) {
			console.log('done');
			console.log(gifCollection.length);
			cb(gifCollection)
		});
	}

	function addDataToDb(gifs) {
		async.each(gifs, function (gif, callback) {
			gif.save(function (err) {
				if (err) console.log('error saving the data to database');

				console.log(gif.Title + ' saved to the db');
			});
		});
	}
}

module.exports = cronJob;
