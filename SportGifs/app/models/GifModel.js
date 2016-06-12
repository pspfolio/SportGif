var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GifSchema = Schema({
	title: { type: String, required: true },
	url: { type: String, required: true },
	permalink: { type: String, required: true },
	subreddit: { type: String, required: true },
	created_at: { type: Date, default: Date.now },
	views: { type: Number, default: 0 },
	handPicked: { type: Boolean, default: false}
}); 

// set created_at before saving it to db
GifSchema.pre('save', function (next) {
	this.created_at = new Date();
	next();
});

GifSchema.index({
	title : 'text',
	created_at: 1,
	views: 1
});

module.exports = mongoose.model('gif', GifSchema);