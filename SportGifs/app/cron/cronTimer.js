var mongoose = require('mongoose');
var GifModel = require('../models/GifModel');
var CronJob = require('cron').CronJob;
var getData = require('../services/getData');
var async = require('async');

var cronJob = function () {
	/*new CronJob('* * * * * *', function () {
		console.log('You will see this message every second');
	}, null, true, 'America/Los_Angeles');*/

	var subreddits = ['nba'];
	for (var i = 0; i < subreddits.length; i++) {
		console.log(getData);
		var t = getData(subreddits[i], initData);
	}
	
	var gifModel = {
		title: '',
		url: '',
		permalink: '',
		subreddit: ''
	};
	
	function initData(redditPosts) {
		console.log('whuup', redditPosts);
		var streamable = redditPosts.data.children.filter(function (item) {
			return item.data.url.indexOf('streamable') > -1
		});
		
		var gifs = streamable.map(function (item) {
			return createGif(item);
		});
		

		getListOfGifsToAddDb(gifs, addDataToDb)
	}
	
	function createGif(item) {
		var gif = Object.create(gifModel);
		gif.title = item.data.title,
		gif.url = item.data.url,
		gif.permalink = item.data.permalink,
		gif.subreddit = item.data.subreddit

		return gif;
	}
	
	function getDataFromReddit(channel, callback) {


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
