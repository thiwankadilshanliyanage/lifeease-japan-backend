const mongoose = require('mongoose');

const serviceProviderProfileSchema = new mongoose.Schema(
  {
    companyName: { type: String, trim: true },
    businessType: { type: String, trim: true },
    businessLicenseNumber: { type: String, trim: true },
    phoneNumber: { type: String, trim: true },
    website: { type: String, trim: true },
    address: { type: String, trim: true },
    description: { type: String, trim: true },

    // optional (used by your controllers/UI)
    services: [{ type: String, trim: true }],
    experienceYears: { type: Number, min: 0 },
    submittedAt: { type: Date },

    approvalStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },

    role: {
      type: String,
      enum: ['user', 'service_provider', 'admin'],
      default: 'user',
    },

    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    verificationTokenExpires: { type: Date },

    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },

    avatar: { type: String, default: '/uploads/default-avatar.png' },

    // only for service providers
    serviceProviderProfile: {
      type: serviceProviderProfileSchema,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
