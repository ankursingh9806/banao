const express = require('express');
const router = express.Router();
const { homePage, signup, login } = require('./userController');

router.get('/home-page', homePage);
router.post('/signup', signup);
router.post('/login', login);

module.exports = router;