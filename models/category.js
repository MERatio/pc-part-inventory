var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CategorySchema = new Schema({
	name: { type: String, required: true, maxlength: 100 },
	description: { type: String, required: true, maxlength: 500 },
});

CategorySchema.virtual('url').get(function () {
	return '/categories/' + this._id;
});

module.exports = mongoose.model('Category', CategorySchema);
