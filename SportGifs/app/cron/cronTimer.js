var http = require('http');
var mongoose = require('mongoose');
var GifModel = require('../models/GifModel');
var CronJob = require('cron').CronJob;

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
			return {}
		})
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


}

module.exports = cronJob;
