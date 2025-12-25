// routes/bookingRoutes.js
const express = require('express');
const router = express.Router();

const {
  createBooking,
  listMyBookings,
  listReceivedBookings,
  getBooking,
  updateBookingStatus,
} = require('../controllers/bookingController');

const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// Create booking (any verified, non-admin user)
router.post('/', protect, createBooking);

// User: my bookings
router.get('/mine', protect, listMyBookings);

// Provider: received
router.get('/received', protect, authorizeRoles('service_provider', 'admin'), listReceivedBookings);

// Single booking
router.get('/:id', protect, getBooking);

// Update status
router.put('/:id/status', protect, updateBookingStatus);

module.exports = router;
