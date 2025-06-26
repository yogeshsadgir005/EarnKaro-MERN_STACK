const User = require('../models/User');

// 📌 Get all users with their rewards
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
};

// ✅ Update task status for a specific reward
exports.updateTaskStatus = async (req, res) => {
  const { userId, rewardTitle, newStatus } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Find reward by title
    const reward = user.rewards.find(r => r.title === rewardTitle);
    if (!reward) return res.status(404).json({ message: 'Reward not found' });

    // Update status
    reward.status = newStatus;

    // Only add amount to wallet when approved
    if (newStatus === 'approved' && !reward.credited) {
      user.points += reward.amount;
      reward.credited = true;
    }

    await user.save();

    res.json({ message: 'Reward status updated' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update reward', error: err.message });
  }
};
