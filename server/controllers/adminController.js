const User = require('../models/User');


exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
};

exports.updateTaskStatus = async (req, res) => {
  const { userId, rewardTitle, newStatus } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const reward = user.rewards.find(r => r.title === rewardTitle);
    if (!reward) return res.status(404).json({ message: 'Reward not found' });

    reward.status = newStatus;

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
