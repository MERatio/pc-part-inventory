const Item = require('../models/item');
const Category = require('../models/category');
const async = require('async');
const { body, validationResult } = require('express-validator');

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

exports.createPost = [
	// Validate and sanitise fields.
	body('name')
		.trim()
		.isLength({ min: 1, max: 100 })
		.withMessage('Name must be 1 to 100 characters long')
		.escape(),
	body('description')
		.trim()
		.isLength({ min: 10, max: 500 })
		.withMessage('Description must be 10 to 500 characters long')
		.escape(),
	body('category')
		.isLength({ min: 1 })
		.withMessage('Category must not be empty')
		.escape(),
	body('price')
		.trim()
		.isFloat({ min: 0, max: 999999 })
		.withMessage('Price must be 0 to 999999 dollars')
		.escape(),
	body('stock')
		.trim()
		.isInt({ min: 0, max: 999999 })
		.withMessage('Stock must be 0 to 999999')
		.escape(),
	// Process request after validation and sanitization.
	(req, res, next) => {
		// Extract the validation errors from a request.
		const errors = validationResult(req);
		// Create an Item object with escaped and trimmed data.
		const item = new Item({
			name: req.body.name,
			description: req.body.description,
			category: req.body.category,
			price: req.body.price,
			stock: req.body.stock,
		});
		if (!errors.isEmpty()) {
			// There are errors. Render form again with sanitized values and error messages.
			res.render('items/form', {
				title: 'Create Item',
				item,
				errors: errors.array(),
			});
		} else {
			// Data form is valid.
			item.save((err) => {
				err ? next(err) : res.redirect(item.url);
			});
		}
	},
];

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
	async.parallel(
		{
			item(callback) {
				Item.findById(req.params.id).exec(callback);
			},
			categories(callback) {
				Category.find({}, 'name').sort({ name: 'asc' }).exec(callback);
			},
		},
		(err, results) => {
			if (err) {
				next(err);
			} else if (results.item === null) {
				const err = new Error('Item not found');
				err.status = 404;
				next(err);
			} else {
				//Successful, so render
				res.render('items/form', {
					title: 'Update Item',
					item: results.item,
					categories: results.categories,
				});
			}
		}
	);
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
