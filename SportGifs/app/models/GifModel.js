var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GifSchema = Schema({
	title: {type: String, required: true},
	url: {type: String, required: true},
	permalink: {type: String, required: true},
	subreddit: { type: String, required: true },
	created_at: {type: Date, default: Date.now}
});

// set created_at before saving it to db
GifSchema.pre('save', function (next) {
	this.created_at = new Date();
	next();
});

GifSchema.index({ title : 1 });

module.exports = mongoose.model('gif', GifSchema);