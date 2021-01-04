const Item = require('../models/item');
const Category = require('../models/category');

exports.list = (req, res, next) => {
	Item.find({}, 'name category price stock')
		.populate('category')
		.exec((err, items) => {
			if (err) {
				next(err);
			} else {
				res.render('items/list', {
					title: 'Computer Parts',
					path: 'items',
					items,
				});
			}
		});
};

exports.createGet = (req, res, next) => {
	Category.find({}, 'name')
		.sort({ name: 'asc' })
		.exec((err, categories) => {
			if (err) {
				next(err);
			} else {
				res.render('items/form', { title: 'Create Item', categories });
			}
		});
};

exports.createPost = (req, res) => {
	res.send('NOT IMPLEMENTED: Item create POST');
};

exports.detail = (req, res, next) => {
	Item.findById(req.params.id)
		.populate('category')
		.exec((err, item) => {
			if (err) {
				next(err);
			} else if (item === null) {
				const err = new Error('Item not found');
				err.status = 404;
				next(err);
			} else {
				// Successful, so render.
				res.render('items/detail', { title: item.name, item });
			}
		});
};

exports.updateGet = (req, res) => {
	res.send('NOT IMPLEMENTED: Item update GET');
};

exports.updatePost = (req, res) => {
	res.send('NOT IMPLEMENTED: Item update POST');
};

exports.deleteGet = (req, res) => {
	res.send('NOT IMPLEMENTED: Item delete GET');
};

exports.deletePost = (req, res) => {
	res.send('NOT IMPLEMENTED: Item delete POST');
};
