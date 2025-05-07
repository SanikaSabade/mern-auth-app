const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/emailSender');
const crypto = require('crypto');

// Register a new user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(20).toString('hex');

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      verificationToken,
      verificationTokenExpiry: Date.now() + 24 * 60 * 60 * 1000 //24hrs time
    });

    const verificationUrl = `${req.protocol}://${req.get('host')}/api/users/verify/${verificationToken}`;

    // Email message
    const message = `
      <h1>Account Verification</h1>
      <p>Please click the link below to verify your account:</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
    `;

    // Send email
    await sendEmail({
      email: user.email,
      subject: 'Account Verification',
      message
    });

    res.status(201).json({ message: 'User registered! Please verify your email' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify user email
const verifyEmail = async (req, res) => {
  try {
    const user = await User.findOne({
      verificationToken: req.params.token,
      verificationTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully. You can now login' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    
    if (user && (await user.matchPassword(password))) {
      if (!user.isVerified) {
        return res.status(401).json({ message: 'Please verify your email before logging in' });
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, verifyEmail, loginUser };