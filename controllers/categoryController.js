const Category = require('../models/category');
const Item = require('../models/item');
const async = require('async');
const { body, validationResult } = require('express-validator');

exports.list = (req, res) => {
	Category.find().exec((err, categories) => {
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

exports.createGet = (req, res) => {
	res.render('categories/form', { title: 'Create Category' });
};

exports.createPost = [
	// Validate and sanitise fields.
	body('name')
		.trim()
		.isLength({ min: 3, max: 100 })
		.escape()
		.withMessage('Name must be 3 to 100 characters long'),
	body('description')
		.trim()
		.isLength({ min: 10, max: 500 })
		.escape()
		.withMessage('Description must be 10 to 500 characters long'),
	// Process request after validation and sanitization.
	(req, res, next) => {
		const errors = validationResult(req);
		const categoryData = req.body;
		if (!errors.isEmpty()) {
			res.render('categories/form', {
				title: 'Create Category',
				category: categoryData,
				errors: errors.array(),
			});
		} else {
			// Data form is valid.
			const category = new Category(categoryData);
			category.save((err) => {
				err ? next(err) : res.redirect(category.url);
			});
		}
	},
];

exports.detail = (req, res, next) => {
	const categoryId = req.params.id;
	async.parallel(
		{
			category(callback) {
				Category.findById(categoryId).exec(callback);
			},
			categoryItems(callback) {
				Item.find({ category: categoryId }, 'name price stock').exec(callback);
			},
		},
		(err, results) => {
			if (err) {
				next(err);
			} else if (results.category === null) {
				const err = new Error('Category not found');
				err.status = 404;
				next(err);
			} else {
				// Success, so render.
				const categoryName = results.category.name;
				const { category, categoryItems } = results;
				res.render('categories/detail', {
					title: `${categoryName} Detail`,
					category,
					categoryItems,
				});
			}
		}
	);
};

exports.updateGet = (req, res) => {
	res.send('NOT IMPLEMENTED: Category update GET');
};

exports.updatePost = (req, res) => {
	res.send('NOT IMPLEMENTED: Category update POST');
};

exports.deleteGet = (req, res) => {
	res.send('NOT IMPLEMENTED: Category delete GET');
};

exports.deletePost = (req, res) => {
	res.send('NOT IMPLEMENTED: Category delete POST');
};
