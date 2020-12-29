var express = require('express');
var router = express.Router();
var itemController = require('../controllers/itemController');

router.get('/', itemController.list);

router.get('/create', itemController.createGet);

router.post('/create', itemController.createPost);

router.get('/:id', itemController.detail);

router.get('/:id/update', itemController.updateGet);

router.post('/:id/update', itemController.updatePost);

router.get('/:id/delete', itemController.deleteGet);

router.post('/:id/delete', itemController.deletePost);

module.exports = router;
