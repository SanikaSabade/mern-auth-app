const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const { getAllForms, editProductDetails, deleteProductEntry } = require('../controllers/formController');

// Get all forms for admin
router.get('/forms', authenticateToken, getAllForms);

// Edit product details
router.put('/forms/:id', authenticateToken, editProductDetails);

// Delete product entry
router.delete('/forms/:id', authenticateToken, deleteProductEntry);

module.exports = router;