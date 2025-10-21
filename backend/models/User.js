const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
    trim: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  walletAddress: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  },
});

// Ensure at least email or phone is provided
userSchema.pre('save', function (next) {
  if (!this.email && !this.phone) {
    next(new Error('Either email or phone is required'));
  } else {
    next();
  }
});

module.exports = mongoose.model('User', userSchema);
