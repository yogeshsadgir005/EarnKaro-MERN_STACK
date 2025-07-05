const mongoose = require('mongoose');

const payoutSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: Number,
    deducted: {
      type: Boolean,
      default: false, 
       },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    method: {
      type: String,
      enum: ['upi', 'bank'],
      required: true,
    },
    upiId: String,
    bank: {
      holderName: String,
      accountNumber: String,
      ifsc: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payout', payoutSchema);
