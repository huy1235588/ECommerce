const express = require('express');
const { signup, login, logout, verifyEmail, forgotPassword, resetPassword, checkAuth, ha, resendEmail, checkUserName, forgotPasswordVerify } = require('../controllers/authController');
const { verifyToken } = require('../middleware/verifyToken');

const router = express.Router();

router.get('/check-auth', verifyToken, checkAuth);

router.post('/check-username', checkUserName);

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

router.post('/resend-email', resendEmail);
router.post('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/forgot-password/verify', forgotPasswordVerify);

router.post('/reset-password/', resetPassword);

router.post('/ha', ha);

module.exports = router;