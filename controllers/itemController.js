var Item = require('../models/item');

exports.list = function (req, res) {
	res.send('NOT IMPLEMENTED: Item list');
};

exports.createGet = function (req, res) {
	res.send('NOT IMPLEMENTED: Item create GET');
};

exports.createPost = function (req, res) {
	res.send('NOT IMPLEMENTED: Item create POST');
};

exports.detail = function (req, res) {
	res.send('NOT IMPLEMENTED: Item detail: ' + req.params.id);
};

exports.updateGet = function (req, res) {
	res.send('NOT IMPLEMENTED: Item update GET');
};

exports.updatePost = function (req, res) {
	res.send('NOT IMPLEMENTED: Item update POST');
};

exports.deleteGet = function (req, res) {
	res.send('NOT IMPLEMENTED: Item delete GET');
};

exports.deletePost = function (req, res) {
	res.send('NOT IMPLEMENTED: Item delete POST');
};
