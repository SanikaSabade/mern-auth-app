const Form = require('../models/formModel');

const submitForm = async (req, res) => {
  try {
    const { name, email, phone, address, message } = req.body;

    const form = await Form.create({
      userId: req.user._id,
      name,
      email,
      phone,
      address,
      message
    });

    res.status(201).json(form);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all forms (admin only)
const getForms = async (req, res) => {
  try {
    const forms = await Form.find({}).populate('userId', 'name email');
    res.json(forms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { submitForm, getForms };