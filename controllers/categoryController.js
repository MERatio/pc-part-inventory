const Category = require('../models/category');
const Item = require('../models/item');
const async = require('async');
const { body, validationResult } = require('express-validator');

exports.list = (req, res, next) => {
	Category.find({}, 'name')
		.sort({ name: 'asc' })
		.exec((err, categories) => {
			if (err) {
				next(err);
			} else {
				res.render('categories/list', {
					title: 'Categories',
					path: 'categories',
					categories,
				});
			}
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
		.withMessage('Name must be 3 to 100 characters long')
		.escape(),
	body('description')
		.trim()
		.isLength({ min: 10, max: 500 })
		.withMessage('Description must be 10 to 500 characters long')
		.escape(),
	// Process request after validation and sanitization.
	(req, res, next) => {
		// Extract the validation errors from a request.
		const errors = validationResult(req);
		// Create a category object with escaped and trimmed data.
		const category = new Category({
			name: req.body.name,
			description: req.body.description,
		});
		if (!errors.isEmpty()) {
			// There are errors. Render form again with sanitized values and error messages.
			res.render('categories/form', {
				title: 'Create Category',
				category,
				errors: errors.array(),
			});
		} else {
			// Data form is valid.
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
				Item.find({ category: categoryId }, 'name price stock image').exec(
					callback
				);
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
				res.render('categories/detail', {
					title: `${results.category.name} Detail`,
					category: results.category,
					categoryItems: results.categoryItems,
				});
			}
		}
	);
};

exports.updateGet = (req, res, next) => {
	Category.findById(req.params.id).exec((err, category) => {
		if (err) {
			next(err);
		} else if (category === null) {
			const err = new Error('Category not found');
			err.status = 404;
			next(err);
		} else {
			//Successful, so render
			res.render('categories/form', {
				title: 'Update Category',
				category,
				action: 'update',
			});
		}
	});
};

exports.updatePost = [
	// Validate and sanitise fields.
	body('name')
		.trim()
		.isLength({ min: 3, max: 100 })
		.withMessage('Name must be 3 to 100 characters long')
		.escape(),
	body('description')
		.trim()
		.isLength({ min: 10, max: 500 })
		.withMessage('Description must be 10 to 500 characters long')
		.escape(),
	body('adminPassword').custom((value, { req }) => {
		if (value !== process.env.ADMIN_PASSWORD) {
			throw new Error('Wrong admin password');
		} else {
			return true;
		}
	}),
	// Process request after validation and sanitization.
	(req, res, next) => {
		// Extract the validation errors from a request.
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			// There are errors. Render form again with sanitized values and error messages.
			res.render('categories/form', {
				title: 'Update Category',
				category: req.body,
				action: 'update',
				errors: errors.array(),
			});
		} else {
			// Data form is valid.
			const categoryId = req.params.id;
			// Create a Category object with escaped/trimmed data and old id.
			const category = new Category({
				name: req.body.name,
				description: req.body.description,
				_id: categoryId, // This is required, or a new ID will be assigned!
			});
			// Data from form is valid. Update the record.
			Category.findByIdAndUpdate(
				categoryId,
				category,
				{},
				(err, updatedCategory) =>
					err ? next(err) : res.redirect(updatedCategory.url)
			);
		}
	},
];

exports.deleteGet = (req, res, next) => {
	const categoryId = req.params.id;
	async.parallel(
		{
			category(callback) {
				Category.findById(categoryId, 'name').exec(callback);
			},
			categoryItems(callback) {
				Item.find({ category: categoryId }, 'name image').exec(callback);
			},
		},
		(err, results) => {
			if (err) {
				next(err);
			} else if (results.category === null) {
				res.redirect('/categories');
			} else {
				// Successful, so render.
				res.render('categories/delete', {
					title: 'Delete Category',
					category: results.category,
					categoryItems: results.categoryItems,
				});
			}
		}
	);
};

exports.deletePost = [
	body('adminPassword').custom((value, { req }) => {
		if (value !== process.env.ADMIN_PASSWORD) {
			throw new Error('Wrong admin password');
		} else {
			return true;
		}
	}),
	(req, res, next) => {
		const categoryId = req.body.categoryId;
		async.parallel(
			{
				category(callback) {
					Category.findById(categoryId, 'name').exec(callback);
				},
				categoryItems(callback) {
					Item.find({ category: categoryId }, 'name').exec(callback);
				},
			},
			(err, results) => {
				// Extract the validation errors from a request.
				const errors = validationResult(req);
				if (err) {
					next(err);
				} else if (!errors.isEmpty() || results.categoryItems.length > 0) {
					// Wrong admin password or category has items. Render in same way as for GET route.
					const locals = {
						title: 'Delete Category',
						category: results.category,
						categoryItems: results.categoryItems,
					};
					if (!errors.isEmpty()) {
						locals.errors = errors.array();
					}
					res.render('categories/delete', locals);
				} else {
					// Category has no items. Delete object and redirect to the list of categories.
					Category.findByIdAndDelete(categoryId, (err) => {
						err ? next(err) : res.redirect('/categories');
					});
				}
			}
		);
	},
];
