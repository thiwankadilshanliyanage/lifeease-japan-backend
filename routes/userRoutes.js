const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const {
  registerUser,
  loginUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
  updateUserProfile,
  resendVerificationEmail,
  deleteMyAccount,
  uploadAvatar,
  submitServiceProviderProfile,
  listServiceProviders, 
  approveServiceProvider, 
  rejectServiceProvider,
  getAdminStats,       
  listUsers 
} = require('../controllers/userController');

const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');



// ✅ Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/avatars/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  },
});
const upload = multer({ storage });

// ✅ Auth & register
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/verify-email/:token', verifyEmail);

// ✅ Password reset
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// ✅ Profile & account
router.get('/profile', protect, (req, res) => {
  res.status(200).json({
    message: 'Profile fetched successfully',
    user: req.user,
  });
});
router.put('/profile', protect, updateUserProfile);
router.put('/avatar', protect, upload.single('avatar'), uploadAvatar);
router.post('/resend-verification', resendVerificationEmail);
router.delete('/delete-account', protect, deleteMyAccount);

//service provider profile
router.post('/submit-service-profile', protect, submitServiceProviderProfile);


// ✅ Admin example
router.get('/admin/data', protect, authorizeRoles('admin'), (req, res) => {
  res.status(200).json({
    message: 'Welcome admin',
    data: 'Sensitive admin-only data',
  });
});

//admin approve service provider
const User = require('../models/userModel'); // Make sure this is at the top of the file

router.get('/all-providers', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const providers = await User.find({ role: 'service_provider' });
    res.json(providers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Approve service provider by ID (Admin only)
// Approve service provider by ID (Admin only)
router.put('/approve-provider/:id', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    console.log('User ID:', req.params.id);

    const user = await User.findById(req.params.id);
    console.log('Fetched User:', user);

    if (!user || user.role !== 'service_provider') {
      console.log('User not found or not a service provider');
      return res.status(404).json({ message: 'Service provider not found' });
    }

    if (!user.serviceProviderProfile) {
      console.log('No service provider profile submitted yet');
      return res.status(400).json({ message: 'No profile submitted by this user' });
    }

    // ❌ Wrong field
    // user.serviceProviderProfile.isApproved = true;

    // ✅ FIX:
    user.serviceProviderProfile.approvalStatus = 'approved';

    await user.save();

    console.log('Approval successful');
    res.json({ message: 'Service provider approved successfully' });
  } catch (err) {
    console.error('Error during approval:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// --- ADD admin listing + approve/reject ---
router.get(
  '/admin/providers',
  protect,
  authorizeRoles('admin'),
  listServiceProviders
);

router.put(
  '/admin/providers/:id/approve',
  protect,
  authorizeRoles('admin'),
  approveServiceProvider
);

router.put(
  '/admin/providers/:id/reject',
  protect,
  authorizeRoles('admin'),
  rejectServiceProvider
);
router.get(
  '/admin/stats',
  protect,
  authorizeRoles('admin'),
  getAdminStats
);

router.get(
  '/admin/users',
  protect,
  authorizeRoles('admin'),
  listUsers
);



module.exports = router;
