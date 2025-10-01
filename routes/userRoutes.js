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
  getMyProfile,
  updateUserProfile,
  resendVerificationEmail,
  deleteMyAccount,
  uploadAvatar,
  submitServiceProviderProfile,

  // admin
  listServiceProviders,
  approveServiceProvider,
  rejectServiceProvider,
  getAdminStats,
  listUsers,
  getAdminOverview,
} = require('../controllers/userController');

const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// ---------- Multer for avatar uploads ----------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/avatars/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  },
});
const upload = multer({ storage });

// ---------- Auth ----------
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/verify-email/:token', verifyEmail);

// ---------- Password ----------
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// ---------- Profile ----------
router.get('/profile', protect, getMyProfile);
router.put('/profile', protect, updateUserProfile);
router.put('/avatar', protect, upload.single('avatar'), uploadAvatar);
router.post('/resend-verification', resendVerificationEmail);
router.delete('/delete-account', protect, deleteMyAccount);

// ---------- Service provider: submit profile ----------
router.post('/service-provider/submit', protect, submitServiceProviderProfile);

// ---------- Admin sample (optional) ----------
router.get('/admin/data', protect, authorizeRoles('admin'), (req, res) => {
  res.status(200).json({ message: 'Welcome admin', data: 'Sensitive admin-only data' });
});

// ---------- Admin: providers & users ----------
router.get('/admin/providers', protect, authorizeRoles('admin'), listServiceProviders);
router.put('/admin/providers/:id/approve', protect, authorizeRoles('admin'), approveServiceProvider);
router.put('/admin/providers/:id/reject', protect, authorizeRoles('admin'), rejectServiceProvider);

router.get('/admin/stats', protect, authorizeRoles('admin'), getAdminStats);
router.get('/admin/users', protect, authorizeRoles('admin'), listUsers);
router.get('/admin/overview', protect, authorizeRoles('admin'), getAdminOverview);

module.exports = router;
