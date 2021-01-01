var Category = require('../models/category');

exports.list = function (req, res) {
	Category.find().exec(function (err, categories) {
		if (err) {
			return next(err);
		}
		res.render('categories/list', {
			title: 'Categories',
			path: 'categories',
			categories,
		});
	});
};

exports.createGet = function (req, res) {
	res.render('categories/form', { title: 'Create Category' });
};

exports.createPost = function (req, res) {
	res.send('NOT IMPLEMENTED: Category create POST');
};

exports.detail = function (req, res) {
	res.send('NOT IMPLEMENTED: Category detail: ' + req.params.id);
};

exports.updateGet = function (req, res) {
	res.send('NOT IMPLEMENTED: Category update GET');
};

exports.updatePost = function (req, res) {
	res.send('NOT IMPLEMENTED: Category update POST');
};

exports.deleteGet = function (req, res) {
	res.send('NOT IMPLEMENTED: Category delete GET');
};

exports.deletePost = function (req, res) {
	res.send('NOT IMPLEMENTED: Category delete POST');
};
