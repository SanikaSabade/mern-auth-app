const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const emailSender = require('../utils/emailSender');


const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (role === 'admin') {
      const token = req.header('Authorization')?.split(' ')[1];

      if (!token) {
        return res.status(403).json({ message: 'Only admins can create admin accounts', success: false });
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'admin') {
          return res.status(403).json({ message: 'Only admins can create admin accounts', success: false });
        }

        req.user = decoded; 
      } catch (err) {
        return res.status(403).json({ message: 'Invalid token', success: false });
      }
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists, please log in', success: false });
    }

    const newUser = new UserModel({ name, email, password, role });

    newUser.password = await bcrypt.hash(password, 10);

    const activationToken = crypto.randomBytes(20).toString('hex');
    newUser.activationToken = activationToken;

    await newUser.save();

    const activationLink = `http://localhost:5000/api/auth/activate/${activationToken}`;
    try {
      await emailSender({
        email,
        subject: 'Account Activation',
        message: `<p>Please activate your account by clicking the link: <a href="${activationLink}">${activationLink}</a></p>`
      });
    } catch (emailErr) {
      console.error('Email sending failed:', emailErr.message);
      return res.status(500).json({ message: 'Signup failed while sending email', success: false });
    }
  

    res.status(201).json({
      message: 'Signup successful, please check your email for activation.',
      success: true,
    });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', success: false });
  }
};

// Login controller
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(403).json({ message: 'Authentication failed. Incorrect email or password.', success: false });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Please activate your account first.', success: false });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(403).json({ message: 'Authentication failed. Incorrect email or password.', success: false });
    }

    const token = jwt.sign(
      {_id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: 'Login successful',
      success: true,
      token,
      user: { name: user.name, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', success: false });
  }
};

// Activate account controller
const activateAccount = async (req, res) => {
  const { activationToken } = req.params;
  try {
    const user = await UserModel.findOne({ activationToken });

    if (!user) {
      return res.status(404).json({ message: 'Invalid activation token', success: false });
    }

    user.isActive = true;
    user.activationToken = null;
    await user.save();

    res.status(200).json({ message: 'Account activated successfully', success: true });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', success: false });
  }
};

module.exports = {
  signup,
  login,
  activateAccount,
};
