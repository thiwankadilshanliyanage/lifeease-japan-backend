const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });
};

// Register User with Email Verification
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      verificationToken,
      verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });

    await user.save();

    const verificationUrl = `http://localhost:5000/api/users/verify-email/${verificationToken}`;
    const message = `
      <h2>Hello ${name},</h2>
      <p>Thank you for registering with LifeEase Japan.</p>
      <p>Please verify your email by clicking the link below:</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
    `;

    await sendEmail(email, 'Verify Your Email - LifeEase Japan', message);

    res.status(201).json({
      message: 'User registered successfully. Please check your email to verify your account.',
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Email Verification Handler
exports.verifyEmail = async (req, res) => {
  try {
    const token = req.params.token;

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;

    await user.save();

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (!user.isVerified) {
      return res.status(401).json({ message: 'Please verify your email to log in' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({
      message: 'Login successful',
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Request password reset - send reset email
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User with that email not found' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = Date.now() + 60 * 60 * 1000; // 1 hour expiry
    await user.save();

    const resetUrl = `http://localhost:5000/api/users/reset-password/${resetToken}`;
    const message = `
      <h2>Hello ${user.name},</h2>
      <p>You requested a password reset. Please click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link will expire in 1 hour.</p>
    `;

    await sendEmail(user.email, 'Password Reset - LifeEase Japan', message);

    res.status(200).json({ message: 'Password reset email sent' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired password reset token' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update User Profile
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    // Only update password if provided
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await user.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Resend Verification Email
exports.resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'User already verified' });
    }

    const crypto = require('crypto');
    const sendEmail = require('../utils/sendEmail');

    // Generate new token
    user.verificationToken = crypto.randomBytes(32).toString('hex');
    user.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    await user.save();

    const verificationUrl = `http://localhost:5000/api/users/verify-email/${user.verificationToken}`;
    const message = `
      <h2>Hello ${user.name},</h2>
      <p>Please verify your email by clicking the link below:</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
    `;

    await sendEmail(user.email, 'Resend Verification - LifeEase Japan', message);

    res.status(200).json({ message: 'Verification email resent successfully' });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete My Account
exports.deleteMyAccount = async (req, res) => {
  try {
    const userId = req.user._id;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'Password is required to delete account' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: 'Your account has been deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
