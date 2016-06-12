(function () {
	
	var GifModel = require('../models/GifModel');

	var GifsService = function () { };
	
	GifsService.prototype.getGifsByCategory = function (category, cb) {
		var query = GifModel.find({ subreddit: category }).sort({ created_at: -1 });
		execQuery(query, cb);
	};
	
	GifsService.prototype.getGifsByCategoryLimit = function (category, limit, cb) {
		var query = GifModel.find({ subreddit: category }).sort({ created_at: -1 }).limit(+limit);
		execQuery(query, cb);
	};
	
	GifsService.prototype.getGifsByCategoryPaged = function (category, limit, skip, searchText, cb) {
		if (searchText) {
			console.log(searchText);
			var query = GifModel.find({ subreddit: category,  $text: { $search: searchText } }).sort({ created_at: -1 }).skip(+skip).limit(+limit);
		} else { 
			var query = GifModel.find({ subreddit: category }).sort({ created_at: -1 }).skip(+skip).limit(+limit);
		}
		
		execQuery(query, cb);
	};
	
	GifsService.prototype.getGifsByCategoryPagedPopular = function (category, limit, skip, searchText, cb) {
		if (searchText) {
			var query = GifModel.find({ subreddit: category, $text: { $search: searchText } }).sort({ views: -1 }).skip(+skip).limit(+limit);
		} else {
			var query = GifModel.find({ subreddit: category }).sort({ views: -1 }).skip(+skip).limit(+limit);
		}
		execQuery(query, cb);
	};
	
	GifsService.prototype.getGifsByCategoryPagedHandpicked = function (category, limit, skip, searchText, cb) {
		if (searchText) {
			var query = GifModel.find({ subreddit: category, $text: { $search: searchText }, handPicked: true,  }).sort({ views: 1 }).skip(+skip).limit(+limit);
		} else {
		var query = GifModel.find({ subreddit: category, handPicked: true }).sort({ views: 1 }).skip(+skip).limit(+limit);
		}
		
		execQuery(query, cb);
	};
	
	GifsService.prototype.incViewCount = function (id, cb) {
		var query = GifModel.findOne({ _id: id });
		// increasing views count by one
		GifModel.update(query, { $inc: { views: 1} }, cb);
	};
	
	function execQuery(query, cb) {
		query.exec(function (err, gifs) {
			if (err) cb(err, null);
			cb(null, gifs);
		});
	}

	module.exports = new GifsService();
}());