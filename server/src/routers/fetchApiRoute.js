const express = require('express');
const fetchApiController = require('../controllers/fetchApiController');

const router = express.Router();

router.get('/', fetchApiController.fetchById);

router.post('/ids', fetchApiController.fetchByIds);

module.exports = router;