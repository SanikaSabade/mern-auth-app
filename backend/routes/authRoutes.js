const express = require('express');
const { signup, login, activateAccount } = require('../controllers/authController');
const isAdmin = require('../middleware/isAdmin');

const router = express.Router();

// Admin signup route (only for admins)
router.post('/admin/signup', isAdmin, signup);

// User signup route
router.post('/signup', signup);

// User login route
router.post('/login', login);

// Account activation
router.get('/activate/:activationToken', activateAccount);

module.exports = router;
