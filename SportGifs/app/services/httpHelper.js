var http = require('http');

var httpHelpers = function () { };

httpHelpers.prototype.getData = function (options, cb) {
	http.get(options, function (resp) {
		var body = '';
		resp.on('data', function (chunk) {
			body += chunk;
		}).on('end', function () {
			var data = JSON.parse(body);
			cb(data);
		}).on('error', function (e) {
			console.log('error', e);
		});
	});
};


module.exports = new httpHelpers();