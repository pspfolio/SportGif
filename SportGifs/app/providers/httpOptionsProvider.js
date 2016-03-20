(function () {
	var getOptions = {
		host: '',
		path: ''
	}

	var optionsProvider = function () { };

	optionsProvider.prototype.getHttpOptions = function (host, path) {
		var options = Object.create(getOptions);
		options.host = host;
		options.path = path;

		return options;
	}

	module.exports = new optionsProvider();
})();