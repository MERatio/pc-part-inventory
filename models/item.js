var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ItemSchema = new Schema({
	name: { type: String, required: true, maxlength: 100 },
	description: { type: String, required: true, maxlength: 500 },
	category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
	price: { type: Number, required: true, min: 0, max: 999999 },
	stock: { type: Number, required: true, min: 0, max: 999999 },
});

ItemSchema.virtual('url').get(function () {
	return '/item/' + this._id;
});

module.exports = mongoose.model('Item', ItemSchema);
