const FormModel = require('../models/formModel');

const submitForm = async (req, res) => {
  try {
    const {
      date,
      productNo,
      productName,
      productDimension,
      status,
      price,
      plantName,
      notes,
      productDescription,
    } = req.body;

    const newForm = new FormModel({
      user: req.user._id,
      date,
      productNo,
      productName,
      productDimension,
      status,
      price,
      plantName,
      notes,
      productDescription,
    });

    await newForm.save();

    res.status(201).json({
      message: 'Product form submitted successfully',
      success: true,
      data: newForm,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Internal server error',
      success: false,
    });
  }
};

// Get all forms
const getAllForms = async (req, res) => {
  try {
    const forms = await FormModel.find().populate('user', 'email');
    
    const formattedForms = forms.map(form => ({
      _id: form._id, // Make sure to include the ID for edit/delete operations
      email: form.user?.email || 'N/A',
      date: form.date ? new Date(form.date).toLocaleDateString() : 'N/A',
      productNo: form.productNo,
      productName: form.productName,
      productDimension: form.productDimension || '',
      status: form.status || '',
      price: form.price || '',
      plantName: form.plantName || '',
      notes: form.notes || '',
      productDescription: form.productDescription || '',
    }));

    res.json({ success: true, forms: formattedForms });
  } catch (error) {
    console.error('Error fetching forms:', error);
    res.status(500).json({ success: false, message: 'Error fetching forms' });
  }
};

// Edit product details
const editProductDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Find the form and update it
    const updatedForm = await FormModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedForm) {
      return res.status(404).json({
        success: false,
        message: 'Form not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product details updated successfully',
      data: updatedForm,
    });
  } catch (err) {
    console.error('Error updating product details:', err);
    res.status(500).json({
      success: false,
      message: 'Error updating product details',
    });
  }
};

// Delete product entry
const deleteProductEntry = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the form and delete it
    const deletedForm = await FormModel.findByIdAndDelete(id);

    if (!deletedForm) {
      return res.status(404).json({
        success: false,
        message: 'Form not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product entry deleted successfully',
    });
  } catch (err) {
    console.error('Error deleting product entry:', err);
    res.status(500).json({
      success: false,
      message: 'Error deleting product entry',
    });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await FormModel.countDocuments();
    const totalDispatched = await FormModel.countDocuments({ status: 'Dispatched' });
    const totalPrice = await FormModel.aggregate([
      { $group: { _id: null, total: { $sum: "$price" } } }
    ]);
    const latestEntries = await FormModel.find().sort({ date: -1 }).limit(5);

    res.status(200).json({
      totalProducts,
      totalDispatched,
      totalPrice: totalPrice[0]?.total || 0,
      latestEntries,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load dashboard data', error: err });
  }
};

module.exports = { 
  submitForm, 
  getAllForms, 
  editProductDetails, 
  deleteProductEntry,
  getDashboardStats,

};