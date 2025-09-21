const express = require('express');
const router = express.Router();
const { homePage, signup, login, forgotPassword, resetPasswordPage } = require('./userController');

router.get('/home-page', homePage);
router.post('/signup', signup);
router.post('/login', login);

router.post('/forgot-password', forgotPassword);
router.get('/reset-password/:token', resetPasswordPage);

module.exports = router;