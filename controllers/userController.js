const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// generate JWT
const generateToken = (userId, role) =>
  jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });

// ---------- Auth ----------

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

// ---------- Password ----------

exports.forgotPassword = async (req, res) => {
  try {
    const u = await User.findOne({ email: req.body.email });
    if (!u) return res.status(404).json({ message: 'User not found' });

    const token = crypto.randomBytes(32).toString('hex');
    u.passwordResetToken = token;
    u.passwordResetExpires = Date.now() + 60 * 60 * 1000;
    await u.save();

    const resetUrl = `http://localhost:5000/api/users/reset-password/${token}`;
    const message = `<p>Reset your password:</p><a href="${resetUrl}">${resetUrl}</a>`;
    await sendEmail(u.email, 'Password Reset', message);

    res.json({ message: 'Reset email sent' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const u = await User.findOne({
      passwordResetToken: req.params.token,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!u) return res.status(400).json({ message: 'Invalid or expired token' });

    u.password = await bcrypt.hash(req.body.password, 10);
    u.passwordResetToken = undefined;
    u.passwordResetExpires = undefined;

    await u.save();
    res.json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------- Profile ----------

exports.getMyProfile = async (req, res) => {
  try {
    const u = await User.findById(req.user._id).select(
      '-password -verificationToken -verificationTokenExpires -passwordResetToken -passwordResetExpires'
    );
    if (!u) return res.status(404).json({ message: 'User not found' });
    res.json(u);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const u = await User.findById(req.user._id);
    if (!u) return res.status(404).json({ message: 'User not found' });

    u.name = req.body.name || u.name;
    u.email = req.body.email || u.email;

    if (req.body.password) {
      u.password = await bcrypt.hash(req.body.password, 10);
    }

    await u.save();

    res.json({ message: 'Profile updated', user: u });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.uploadAvatar = async (req, res) => {
  try {
    const u = await User.findById(req.user._id);
    if (!u) return res.status(404).json({ message: 'User not found' });
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    u.avatar = `/uploads/avatars/${req.file.filename}`;
    await u.save();

    res.json({ message: 'Avatar uploaded', avatar: u.avatar });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.resendVerificationEmail = async (req, res) => {
  try {
    const u = await User.findOne({ email: req.body.email });
    if (!u) return res.status(404).json({ message: 'User not found' });
    if (u.isVerified) return res.status(400).json({ message: 'Already verified' });

    u.verificationToken = crypto.randomBytes(32).toString('hex');
    u.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000;
    await u.save();

    const verificationUrl = `http://localhost:5000/api/users/verify-email/${u.verificationToken}`;
    const message = `<p>Verify your email:</p><a href="${verificationUrl}">${verificationUrl}</a>`;
    await sendEmail(u.email, 'Verify Email', message);

    res.json({ message: 'Verification email resent' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteMyAccount = async (req, res) => {
  try {
    const u = await User.findById(req.user._id);
    if (!u) return res.status(404).json({ message: 'User not found' });

    const match = await bcrypt.compare(req.body.password, u.password);
    if (!match) return res.status(401).json({ message: 'Incorrect password' });

    await u.deleteOne();
    res.json({ message: 'Account deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------- Service Provider profile submit ----------

exports.submitServiceProviderProfile = async (req, res) => {
  try {
    const u = await User.findById(req.user._id);
    if (!u || u.role !== 'service_provider') {
      return res.status(403).json({ message: 'Only service providers can submit profile' });
    }

    const {
      companyName,
      businessType,
      businessLicenseNumber,
      phoneNumber,
      website,
      address,
      description,
      services,
      experienceYears,
    } = req.body;

    u.serviceProviderProfile = {
      companyName,
      businessType,
      businessLicenseNumber,
      phoneNumber,
      website,
      address,
      description,
      services: Array.isArray(services) ? services : services ? [services] : [],
      experienceYears: typeof experienceYears === 'number' ? experienceYears : undefined,
      submittedAt: new Date(),
      approvalStatus: 'pending',
    };

    await u.save();

    res.json({ message: 'Profile submitted for approval', profile: u.serviceProviderProfile });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------- Admin: providers & stats ----------

// List providers by status (pending|approved|rejected) — default: all
exports.listServiceProviders = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { role: 'service_provider' };
    if (status) filter['serviceProviderProfile.approvalStatus'] = status;

    const providers = await User.find(
      filter,
      'name email avatar serviceProviderProfile createdAt'
    ).sort({ createdAt: -1 });

    res.json({ providers });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.approveServiceProvider = async (req, res) => {
  try {
    const u = await User.findById(req.params.id);
    if (!u || u.role !== 'service_provider') {
      return res.status(404).json({ message: 'Service provider not found' });
    }
    if (!u.serviceProviderProfile) {
      return res.status(400).json({ message: 'No profile submitted by this user' });
    }

    u.serviceProviderProfile.approvalStatus = 'approved';
    await u.save();

    res.json({ message: 'Service provider approved', userId: u._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.rejectServiceProvider = async (req, res) => {
  try {
    const u = await User.findById(req.params.id);
    if (!u || u.role !== 'service_provider') {
      return res.status(404).json({ message: 'Service provider not found' });
    }
    if (!u.serviceProviderProfile) {
      return res.status(400).json({ message: 'No profile submitted by this user' });
    }

    u.serviceProviderProfile.approvalStatus = 'rejected';
    await u.save();

    res.json({ message: 'Service provider rejected', userId: u._id });
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
      { $group: { _id: '$serviceProviderProfile.approvalStatus', count: { $sum: 1 } } },
    ]);

    const providersByStatus = { pending: 0, approved: 0, rejected: 0 };
    for (const row of providersByStatusAgg) {
      if (row._id && providersByStatus[row._id] !== undefined) {
        providersByStatus[row._id] = row.count;
      }
    }

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    const dailySignups = await User.aggregate([
      { $match: { createdAt: { $gte: new Date(sevenDaysAgo.setHours(0, 0, 0, 0)) } } },
      {
        $group: {
          _id: { y: { $year: '$createdAt' }, m: { $month: '$createdAt' }, d: { $dayOfMonth: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.y': 1, '_id.m': 1, '_id.d': 1 } },
    ]);

    res.json({ totalUsers, totalProviders, providersByStatus, dailySignups });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.listUsers = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100);
    const skip = (page - 1) * limit;
    const { search, role } = req.query;

    const filter = {};
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const [items, total] = await Promise.all([
      User.find(filter, 'name email role avatar serviceProviderProfile createdAt')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments(filter),
    ]);

    res.json({
      items,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAdminOverview = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalProviders = await User.countDocuments({ role: 'service_provider' });
    const approvedProviders = await User.countDocuments({
      role: 'service_provider',
      'serviceProviderProfile.approvalStatus': 'approved',
    });
    const pendingProviders = await User.countDocuments({
      role: 'service_provider',
      'serviceProviderProfile.approvalStatus': 'pending',
    });

    const recentUsers = await User.find({}, 'name email role createdAt')
      .sort({ createdAt: -1 })
      .limit(8);

    res.json({
      totals: { totalUsers, totalProviders, approvedProviders, pendingProviders },
      recentUsers,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
