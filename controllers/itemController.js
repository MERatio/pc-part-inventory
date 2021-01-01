const Item = require('../models/item');

exports.list = (req, res) => {
	res.send('NOT IMPLEMENTED: Item list');
};

exports.createGet = (req, res) => {
	res.send('NOT IMPLEMENTED: Item create GET');
};

exports.createPost = (req, res) => {
	res.send('NOT IMPLEMENTED: Item create POST');
};

exports.detail = (req, res) => {
	res.send('NOT IMPLEMENTED: Item detail: ' + req.params.id);
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
