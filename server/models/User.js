const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
  title: String,
  amount: Number,
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'completed'
  },
  credited: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  contact: String,
  age: Number,
  phone: String,
  phoneVerified: { type: Boolean, default: false },

  referralCode: String,
  referrals: [String],
  rewards: [rewardSchema],
  points: { type: Number, default: 0 },

  streakCount: { type: Number, default: 0 },
  lastLoginDate: { type: Date, default: null },

  bank: {
    accountHolder: String,
    accountNumber: String,
    ifsc: String,
    bankName: String
  },
  upiId: { type: String, default: '' },
  isAdmin: { type: Boolean, default: false }
}, { timestamps: true });

userSchema.pre('save', function (next) {
  if (!this.referralCode) {
    this.referralCode = this.name.toLowerCase().split(' ')[0] + Math.floor(1000 + Math.random() * 9000);
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
