var express = require('express');
var router = express.Router();
var categoryController = require('../controllers/categoryController');

router.get('/', categoryController.list);

router.get('/create', categoryController.createGet);

router.post('/create', categoryController.createPost);

router.get('/:id', categoryController.detail);

router.get('/:id/update', categoryController.updateGet);

router.post('/:id/update', categoryController.updatePost);

router.get('/:id/delete', categoryController.deleteGet);

router.post('/:id/delete', categoryController.deletePost);

module.exports = router;
