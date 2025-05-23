const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { updateUserProfile } = require('../controllers/userController');
const { resendVerificationEmail } = require('../controllers/userController');
const { deleteMyAccount } = require('../controllers/userController');

// User registration and login
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/verify-email/:token', verifyEmail);

// Password reset routes
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Update profile route
router.put('/profile', protect, updateUserProfile);

// Delete account (self)
router.delete('/delete-account', protect, deleteMyAccount);

//resendVerificationEmail
router.post('/resend-verification', resendVerificationEmail);
// Protected route for profile
router.get('/profile', protect, (req, res) => {
  res.status(200).json({
    message: 'Profile data fetched successfully',
    user: req.user,
  });
});

// Admin-only route
router.get('/admin/data', protect, authorizeRoles('admin'), (req, res) => {
  res.status(200).json({
    message: 'Welcome, Admin!',
    data: {
      stats: 'This is some sensitive admin-only data',
    },
  });
});

module.exports = router;
