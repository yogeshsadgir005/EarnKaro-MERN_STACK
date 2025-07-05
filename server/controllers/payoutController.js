const Payout = require('../models/Payout');
const User = require('../models/User');

exports.submitPayout = async (req, res) => {
  const { amount, method, upiId, bank } = req.body;
  const userId = req.user._id;

  try {
    if (!amount || amount <= 0 || !method) {
      return res.status(400).json({ message: 'Amount and method are required' });
    }

    if (method === 'upi' && !upiId) {
      return res.status(400).json({ message: 'UPI ID is required' });
    }

    if (
      method === 'bank' &&
      (!bank || !bank.holderName || !bank.accountNumber || !bank.ifsc)
    ) {
      return res.status(400).json({ message: 'Bank details incomplete' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.points < amount) {
      return res.status(400).json({ message: 'Insufficient wallet balance' });
    }


    user.points -= amount;
    await user.save();

    const payout = await Payout.create({
      user: userId,
      amount,
      deducted: true, 
      method,
      upiId: method === 'upi' ? upiId : undefined,
      bank: method === 'bank' ? bank : undefined,
      status: 'pending',
    });

    res
      .status(200)
      .json({ message: 'Payout request submitted successfully!', payoutId: payout._id });
  } catch (err) {
    console.error('Error submitting payout request:', err);
    res.status(500).json({ message: 'Server error submitting payout' });
  }
};

exports.updatePayoutStatus = async (req, res) => {
  const { payoutId, newStatus } = req.body;

  if (!['completed', 'failed'].includes(newStatus)) {
    return res.status(400).json({ message: 'Invalid status update' });
  }

  try {
    const payout = await Payout.findById(payoutId).populate('user');
    if (!payout) return res.status(404).json({ message: 'Payout not found' });

    const user = payout.user;

    if (newStatus === 'failed' && payout.deducted) {
 
      user.points += payout.amount;
      await user.save();

      payout.deducted = false; 
    }

    payout.status = newStatus;
    await payout.save();

    res.json({ message: `Payout marked as ${newStatus}` });
  } catch (err) {
    console.error('Error updating payout status:', err);
    res.status(500).json({ message: 'Failed to update payout status' });
  }
};

exports.getAllPayoutRequests = async (req, res) => {
  try {
    const payouts = await Payout.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(payouts);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch payout requests' });
  }
};

exports.getUserPayoutHistory = async (req, res) => {
  try {
    const payouts = await Payout.find({
      user: req.user._id,
      status: { $in: ['pending', 'completed', 'failed'] },
    }).sort({ createdAt: -1 });
    res.json(payouts);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch history' });
  }
};

