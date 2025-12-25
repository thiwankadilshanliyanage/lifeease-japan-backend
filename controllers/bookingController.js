// controllers/bookingController.js
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const User = require('../models/userModel');
const sendEmail = require('../utils/sendEmail');

// Helper: can view a booking?
const canViewBooking = (b, user) => {
  if (!user) return false;
  if (user.role === 'admin') return true;
  return (
    b.user.toString() === user._id.toString() ||
    b.provider.toString() === user._id.toString()
  );
};

// POST /api/bookings
exports.createBooking = async (req, res) => {
  try {
    const { serviceId, startAt, endAt, notes } = req.body;

    if (!serviceId || !startAt) {
      return res.status(400).json({ message: 'serviceId and startAt are required' });
    }

    const service = await Service.findById(serviceId).populate('provider', 'name email role');
    if (!service) return res.status(404).json({ message: 'Service not found' });
    if (!service.isActive || service.adminStatus !== 'approved') {
      return res.status(400).json({ message: 'This service is not bookable at the moment' });
    }

    // Prevent booking your own service
    if (service.provider._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot book your own service' });
    }

    const booking = await Booking.create({
      user: req.user._id,
      provider: service.provider._id,
      service: service._id,
      startAt: new Date(startAt),
      endAt: endAt ? new Date(endAt) : undefined,
      notes: notes || undefined,
      status: 'pending',
    });

    // Notify provider (best-effort)
    try {
      await sendEmail(
        service.provider.email,
        'New Booking Request - LifeEase Japan',
        `
          <h3>Hello ${service.provider.name || 'Provider'}</h3>
          <p>You have a new booking request for: <b>${service.title}</b></p>
          <p>Requested time: ${new Date(startAt).toLocaleString()}</p>
          ${notes ? `<p>Notes: ${notes}</p>` : ''}
          <p>Please log in to accept or decline.</p>
        `
      );
    } catch (_) {}

    const populated = await Booking.findById(booking._id)
      .populate('user', 'name email')
      .populate('provider', 'name email')
      .populate('service', 'title price currency');

    res.status(201).json({ message: 'Request created', booking: populated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/bookings/mine  (as user)
exports.listMyBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const p = Math.max(parseInt(page) || 1, 1);
    const l = Math.min(Math.max(parseInt(limit) || 20, 1), 100);
    const skip = (p - 1) * l;

    const filter = { user: req.user._id };
    if (status) filter.status = status;

    const [items, total] = await Promise.all([
      Booking.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(l)
        .populate('service', 'title price currency images')
        .populate('provider', 'name email'),
      Booking.countDocuments(filter),
    ]);

    res.json({
      items,
      pagination: { page: p, pages: Math.ceil(total / l) || 1, total, limit: l },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/bookings/received  (as provider)
exports.listReceivedBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const p = Math.max(parseInt(page) || 1, 1);
    const l = Math.min(Math.max(parseInt(limit) || 20, 1), 100);
    const skip = (p - 1) * l;

    const filter = { provider: req.user._id };
    if (status) filter.status = status;

    const [items, total] = await Promise.all([
      Booking.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(l)
        .populate('service', 'title price currency images')
        .populate('user', 'name email'),
      Booking.countDocuments(filter),
    ]);

    res.json({
      items,
      pagination: { page: p, pages: Math.ceil(total / l) || 1, total, limit: l },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/bookings/:id
exports.getBooking = async (req, res) => {
  try {
    const b = await Booking.findById(req.params.id)
      .populate('user', 'name email')
      .populate('provider', 'name email')
      .populate('service', 'title price currency images');
    if (!b) return res.status(404).json({ message: 'Booking not found' });
    if (!canViewBooking(b, req.user)) return res.status(403).json({ message: 'Not allowed' });
    res.json(b);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/bookings/:id/status
// - Provider: can set accepted/declined
// - User: can set cancelled (from pending or accepted)
// - Admin: can set any
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body; // expected: accepted|declined|cancelled
    const valid = ['accepted', 'declined', 'cancelled'];
    if (!valid.includes(status)) return res.status(400).json({ message: 'Invalid status' });

    const b = await Booking.findById(req.params.id)
      .populate('user', 'name email')
      .populate('provider', 'name email')
      .populate('service', 'title');
    if (!b) return res.status(404).json({ message: 'Booking not found' });

    const isProvider = b.provider._id.toString() === req.user._id.toString();
    const isUser = b.user._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isProvider && !isUser && !isAdmin) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    // Rules
    if (isProvider && !['accepted', 'declined'].includes(status)) {
      return res.status(400).json({ message: 'Provider can only accept or decline' });
    }
    if (isUser && status !== 'cancelled') {
      return res.status(400).json({ message: 'User can only cancel' });
    }

    // Basic transition guard (optional)
    if (b.status === 'cancelled' || b.status === 'declined') {
      return res.status(400).json({ message: `Already ${b.status}` });
    }
    if (b.status === 'accepted' && isProvider && status !== 'cancelled') {
      // provider changing accepted→declined is odd; force user cancel for now
      return res.status(400).json({ message: 'Already accepted; user may cancel' });
    }

    b.status = status;
    await b.save();

    // Notify counterparty (best-effort)
    try {
      if (status === 'accepted' || status === 'declined') {
        await sendEmail(
          b.user.email,
          `Your booking was ${status} - LifeEase Japan`,
          `
            <h3>Hello ${b.user.name || ''}</h3>
            <p>Your request for <b>${b.service.title}</b> was <b>${status}</b>.</p>
          `
        );
      } else if (status === 'cancelled') {
        await sendEmail(
          b.provider.email,
          'Booking cancelled - LifeEase Japan',
          `
            <h3>Hello ${b.provider.name || 'Provider'}</h3>
            <p>The user cancelled a booking request for <b>${b.service.title}</b>.</p>
          `
        );
      }
    } catch (_) {}

    res.json({ message: 'Status updated', booking: b });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
