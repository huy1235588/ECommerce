const express = require('express');
const { signup, login, logout, verifyEmail, forgotPassword, resetPassword, checkAuth, ha, resendEmail } = require('../controllers/authController');
const { verifyToken } = require('../middleware/verifyToken');

const router = express.Router();

router.get('/check-auth', verifyToken, checkAuth);

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

router.post('/resend-email', resendEmail);
router.post('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);

router.post('/reset-password/:token', resetPassword);

router.post('/ha', ha);

module.exports = router;