const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// 🔑 Token generator
const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });
};

// 📝 Register
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, isServiceProvider } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const role = isServiceProvider ? 'service_provider' : 'user';

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      verificationToken,
      verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000,
    });

    const verificationUrl = `http://localhost:5000/api/users/verify-email/${verificationToken}`;
    const message = `
      <h2>Hello ${name}</h2>
      <p>Verify your email:</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
    `;

    await sendEmail(email, 'Verify Your Email - LifeEase Japan', message);

    res.status(201).json({ message: 'Registered. Check your email to verify.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📄 Submit service provider profile
exports.submitServiceProviderProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user || user.role !== 'service_provider') {
      return res.status(403).json({ message: 'Only service providers can submit profile' });
    }

    const {
      companyName,
      businessLicenseNumber,
      phone,
      website,
      address,
      services,
      experienceYears,
      description,
    } = req.body;

    user.serviceProviderProfile = {
      companyName,
      businessLicenseNumber,
      phone,
      website,
      address,
      services,
      experienceYears,
      description,
      submittedAt: new Date(),
      approved: false, // default
    };

    await user.save();

    res.json({ message: 'Profile submitted for approval', profile: user.serviceProviderProfile });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ✅ Email verification
exports.verifyEmail = async (req, res) => {
  try {
    const user = await User.findOne({
      verificationToken: req.params.token,
      verificationTokenExpires: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;

    await user.save();
    res.json({ message: 'Email verified' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔐 Login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(400).json({ message: 'Invalid credentials' });

    if (!user.isVerified)
      return res.status(401).json({ message: 'Verify your email first' });

    res.json({
      message: 'Login successful',
      token: generateToken(user._id, user.role),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔄 Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const token = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = token;
    user.passwordResetExpires = Date.now() + 60 * 60 * 1000;

    await user.save();

    const resetUrl = `http://localhost:5000/api/users/reset-password/${token}`;
    const message = `<p>Reset your password:</p><a href="${resetUrl}">${resetUrl}</a>`;
    await sendEmail(user.email, 'Password Reset', message);

    res.json({ message: 'Reset email sent' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔄 Reset password
exports.resetPassword = async (req, res) => {
  try {
    const user = await User.findOne({
      passwordResetToken: req.params.token,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

    user.password = await bcrypt.hash(req.body.password, 10);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();
    res.json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 👤 Update profile
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = await bcrypt.hash(req.body.password, 10);
    }

    await user.save();

    res.json({ message: 'Profile updated', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🖼️ Upload Avatar
exports.uploadAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    user.avatar = `/uploads/avatars/${req.file.filename}`;
    await user.save();

    res.json({ message: 'Avatar uploaded', avatar: user.avatar });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔄 Resend verification
exports.resendVerificationEmail = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.isVerified) return res.status(400).json({ message: 'Already verified' });

    user.verificationToken = crypto.randomBytes(32).toString('hex');
    user.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000;

    await user.save();

    const verificationUrl = `http://localhost:5000/api/users/verify-email/${user.verificationToken}`;
    const message = `<p>Verify your email:</p><a href="${verificationUrl}">${verificationUrl}</a>`;
    await sendEmail(user.email, 'Verify Email', message);

    res.json({ message: 'Verification email resent' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ❌ Delete account
exports.deleteMyAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) return res.status(401).json({ message: 'Incorrect password' });

    await user.deleteOne();

    res.json({ message: 'Account deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// List providers by status (pending|approved|rejected) — default: all
exports.listServiceProviders = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { role: 'service_provider' };

    if (status) {
      filter['serviceProviderProfile.approvalStatus'] = status;
    }

    // return only fields we need
    const providers = await User.find(
      filter,
      'name email avatar serviceProviderProfile createdAt'
    ).sort({ createdAt: -1 });

    res.json({ providers });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Approve provider
exports.approveServiceProvider = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || user.role !== 'service_provider') {
      return res.status(404).json({ message: 'Service provider not found' });
    }
    if (!user.serviceProviderProfile) {
      return res.status(400).json({ message: 'No profile submitted by this user' });
    }

    user.serviceProviderProfile.approvalStatus = 'approved';
    await user.save();

    res.json({ message: 'Service provider approved', userId: user._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Reject provider
exports.rejectServiceProvider = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || user.role !== 'service_provider') {
      return res.status(404).json({ message: 'Service provider not found' });
    }
    if (!user.serviceProviderProfile) {
      return res.status(400).json({ message: 'No profile submitted by this user' });
    }

    user.serviceProviderProfile.approvalStatus = 'rejected';
    await user.save();

    res.json({ message: 'Service provider rejected', userId: user._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({});
    const totalProviders = await User.countDocuments({ role: 'service_provider' });

    const providersByStatusAgg = await User.aggregate([
      { $match: { role: 'service_provider' } },
      {
        $group: {
          _id: '$serviceProviderProfile.approvalStatus',
          count: { $sum: 1 }
        }
      }
    ]);
    const providersByStatus = {
      pending: 0, approved: 0, rejected: 0
    };
    for (const row of providersByStatusAgg) {
      if (row._id && providersByStatus[row._id] !== undefined) {
        providersByStatus[row._id] = row.count;
      }
    }

    // last 7 days signups (daily)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // include today

    const dailySignups = await User.aggregate([
      { $match: { createdAt: { $gte: new Date(sevenDaysAgo.setHours(0,0,0,0)) } } },
      {
        $group: {
          _id: {
            y: { $year: '$createdAt' },
            m: { $month: '$createdAt' },
            d: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.y': 1, '_id.m': 1, '_id.d': 1 } }
    ]);

    res.json({
      totalUsers,
      totalProviders,
      providersByStatus, // {pending, approved, rejected}
      dailySignups       // array of { _id:{y,m,d}, count }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.listUsers = async (req, res) => {
  try {
    const page  = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100);
    const skip  = (page - 1) * limit;
    const { search, role } = req.query;

    const filter = {};
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { name:  { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const [items, total] = await Promise.all([
      User.find(filter, 'name email role avatar serviceProviderProfile createdAt')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
      User.countDocuments(filter)
    ]);

    res.json({
      items,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

