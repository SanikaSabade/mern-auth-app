const express = require('express');
const router = express.Router();
const { submitForm, getForms } = require('../controllers/formController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, submitForm);   // Submit form (protected)


router.get('/', protect, admin, getForms);   // Get all forms (admin only)


module.exports = router;