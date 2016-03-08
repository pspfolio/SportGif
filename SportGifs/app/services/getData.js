var http = require('http');

   function getData(options, cb) {
	console.log('httpgetdata')
	return http.get({
		host: 'www.reddit.com',
		path: '/r/nba/.json?limit=100'
	}, function (resp) {
		var body = '';
		resp.on('data', function (chunk) {
			body += chunk;
		}).on('end', function () {
			var data = JSON.parse(body);
			console.log('returning data');
			cb(data);
		}).on('error', function (e) {
			console.log('error', e);
		});
	});
};


module.exports = getData;