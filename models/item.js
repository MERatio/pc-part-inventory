const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
	name: { type: String, required: true, maxlength: 100 },
	description: { type: String, required: true, maxlength: 500 },
	category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
	price: { type: Number, required: true, min: 0, max: 999999 },
	stock: { type: Number, required: true, min: 0, max: 999999 },
});

ItemSchema.virtual('url').get(function () {
	return '/items/' + this._id;
});

module.exports = mongoose.model('Item', ItemSchema);
