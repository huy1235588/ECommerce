const express = require('express');
const { getAllUsers, getUsersByPage } = require('../controllers/userController');
const { verifyToken } = require('../middleware/verifyToken');
const { checkAdmin } = require('../middleware/checkAdmin');

const router = express.Router();

router.get('/all', verifyToken, checkAdmin, getAllUsers);
router.get('/page', verifyToken, checkAdmin, getUsersByPage);

module.exports = router;