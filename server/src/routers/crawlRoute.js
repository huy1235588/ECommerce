const express = require('express');
const { crawlByURL, crawlByMultipleId, crawlHtmlByMultipleId } = require('../controllers/crawlController');

const router = express.Router();

router.get('/', crawlByURL);

router.post('/list', crawlByMultipleId);

router.post('/detail', crawlHtmlByMultipleId);

module.exports = router;