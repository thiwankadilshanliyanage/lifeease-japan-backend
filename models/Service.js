// models/Service.js
const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    title: { type: String, required: true, trim: true, maxlength: 140 },

    // keep your free-form category, but allow common values
    category: { type: String, trim: true },

    description: { type: String, required: true, trim: true, maxlength: 5000 },

    price: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'JPY' },

    // store relative paths like /uploads/services/xxx.jpg
    images: [{ type: String }],

    location: { type: String, trim: true },

    isActive: { type: Boolean, default: true, index: true },

    adminStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      // keep your behavior (no service-level moderation by default)
      default: 'approved',
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Service', serviceSchema);
