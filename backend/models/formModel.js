const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  date: { type: Date, required: true },
  productNo: { type: String, required: true },
  productName: { type: String, required: true },
  productDimension: { type: String },
  status: { type: String },
  price: { type: Number },
  plantName: { type: String },
  notes: { type: String },
  productDescription: { type: String },
});

const Form = mongoose.model('Form', formSchema);

module.exports = Form;
