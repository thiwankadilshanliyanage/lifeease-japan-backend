// models/Booking.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true, index: true },

    startAt: { type: Date, required: true },
    endAt: { type: Date }, // optional
    notes: { type: String, trim: true, maxlength: 1000 },

    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined', 'cancelled'],
      default: 'pending',
      index: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
