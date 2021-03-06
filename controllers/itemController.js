const Item = require('../models/item');
const Category = require('../models/category');
const async = require('async');
const { body, validationResult } = require('express-validator');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

// Multer config
const storage = multer.diskStorage({
	destination(req, file, cb) {
		cb(null, 'public/images');
	},
	filename(req, file, cb) {
		const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1e9);
		cb(null, uniquePrefix + '-' + file.originalname);
	},
});

const upload = multer({
	storage,
	fileFilter(req, file, cb) {
		const ext = path.extname(file.originalname);
		const validExt = [
			'.apng',
			'.avif',
			'.gif',
			'.jpg',
			'.jpeg',
			'.jfif',
			'.pjpeg',
			'.pjp',
			'.png',
			'.svg',
			'.webp',
		];

		if (!validExt.includes(ext)) {
			cb(null, false);
			cb(new Error('Invalid file type, upload an image'));
		} else {
			cb(null, true);
		}
	},
	limits: { fileSize: 3000000 },
});

exports.list = (req, res, next) => {
	Item.find({}, 'name category price stock image')
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
				res.render('items/form', {
					title: 'Create Item',
					categories,
					action: 'create',
				});
			}
		});
};

exports.createPost = [
	upload.single('image'),
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
		// Give more helpful error message if no item image is uploaded.
		if (!req.file) {
			throw new Error('Add an item image');
		}
		// Extract the validation errors from a request.
		const errors = validationResult(req);
		// Create an Item object with escaped and trimmed data.
		const item = new Item({
			name: req.body.name,
			description: req.body.description,
			category: req.body.category,
			price: req.body.price,
			stock: req.body.stock,
			image: req.file.filename,
		});
		if (!errors.isEmpty()) {
			// There are errors.
			// If there's an uploaded image delete it.
			if (req.file) {
				fs.unlink(`public/images/${req.file.filename}`, (err) => {
					if (err) {
						next(err);
						return;
					}
				});
			}
			// Get all categories for form
			Category.find({}, 'name')
				.sort({ name: 'asc' })
				.exec((err, categories) => {
					if (err) {
						next(err);
					} else {
						// Render form again with sanitized values and error messages.
						res.render('items/form', {
							title: 'Create Item',
							item,
							categories,
							action: 'create',
							errors: errors.array(),
						});
					}
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

exports.updateGet = (req, res, next) => {
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
					action: 'update',
				});
			}
		}
	);
};

exports.updatePost = [
	upload.single('image'),
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
			// There are errors.
			// If there's an uploaded image delete it.
			if (req.file) {
				fs.unlink(`public/images/${req.file.filename}`, (err) => {
					if (err) {
						next(err);
						return;
					}
				});
			}
			// Get all categories for form
			Category.find({}, 'name')
				.sort({ name: 'asc' })
				.exec((err, categories) => {
					if (err) {
						next(err);
					} else {
						// Render form again with sanitized values and error messages.
						res.render('items/form', {
							title: 'Update Item',
							item: req.body,
							categories,
							action: 'update',
							errors: errors.array(),
						});
					}
				});
		} else {
			// Data from form is valid
			const itemId = req.params.id;
			// Item data for creating the updated item.
			const itemData = {
				name: req.body.name,
				description: req.body.description,
				category: req.body.category,
				price: req.body.price,
				stock: req.body.stock,
				_id: itemId, // This is required, or a new ID will be assigned!
			};
			// Find old item
			Item.findById(itemId, 'image').exec((err, oldItem) => {
				if (err) {
					next(err);
				} else if (oldItem === null) {
					const err = new Error('Item not found');
					err.status = 404;
					next(err);
				} else {
					// No error in finding the old item.
					// If there is no uploaded image.
					if (!req.file) {
						// Use the old image.
						itemData.image = oldItem.image;
					} else {
						// If there's an uploaded image.
						// Delete the old image
						if (req.file) {
							fs.unlink(`public/images/${oldItem.image}`, (err) => {
								if (err) {
									next(err);
									return;
								}
							});
						}
						// Use the new uploaded image
						itemData.image = req.file.filename;
					}
				}
				// Create an Item object with escaped/trimmed data and old id.
				const item = new Item(itemData);
				// Update the record
				Item.findByIdAndUpdate(itemId, item, {}, (err, updatedItem) => {
					err ? next(err) : res.redirect(updatedItem.url);
				});
			});
		}
	},
];

exports.deleteGet = (req, res, next) => {
	Item.findById(req.params.id, 'name image').exec((err, item) => {
		if (err) {
			next(err);
		} else if (item === null) {
			res.redirect('/items');
		} else {
			// Successful, so render.
			res.render('items/delete', { title: 'Delete Item', item });
		}
	});
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
		// Extract the validation errors from a request.
		const errors = validationResult(req);
		Item.findById(req.body.itemId, (err, item) => {
			if (err) {
				next(err);
			} else if (!errors.isEmpty()) {
				// Wrong admin password. Render delete form with errors.
				res.render('items/delete', {
					title: 'Delete Item',
					item,
					errors: errors.array(),
				});
			} else {
				// Item has no dependent objects. Delete object and redirect to the list of items.
				Item.findByIdAndDelete(req.body.itemId, (err) => {
					if (err) {
						next(err);
					} else {
						// Delete the image in public/images
						fs.unlink(`public/images/${item.image}`, (err) => {
							if (err) {
								next(err);
								return;
							}
						});
						// Success - go to items list
						res.redirect('/items');
					}
				});
			}
		});
	},
];
