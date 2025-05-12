const express = require('express');
const { submitForm } = require('../controllers/formController');
const authenticateToken = require('../middleware/auth');  
const { getDashboardStats } = require('../controllers/formController');
const router = express.Router();

router.post('/submit', authenticateToken, submitForm);  
router.get('/dashboard', getDashboardStats);


module.exports = router;
