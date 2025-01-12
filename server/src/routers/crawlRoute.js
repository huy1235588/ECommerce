const express = require('express');
const { crawlByURL, crawlByMultipleId } = require('../controllers/crawlController');

const router = express.Router();

router.get('/', crawlByURL);

router.post('/list', crawlByMultipleId);

module.exports = router;