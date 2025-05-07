const express = require('express');
const router = express.Router();
const { registerUser, verifyEmail, loginUser } = require('../controllers/userController');

router.post('/register', registerUser);  // Register route


router.get('/verify/:token', verifyEmail);  // Verify email route

router.post('/login', loginUser); // Login route


module.exports = router;