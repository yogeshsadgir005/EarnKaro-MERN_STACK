const express = require('express');
const router = express.Router();
const User = require('../models/User');
const adminProtect = require('../middleware/adminMiddleware');

router.get('/users', adminProtect, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

router.put('/make-admin/:id', adminProtect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isAdmin = true;
    await user.save();

    res.json({ message: `${user.name} is now an admin.` });
  } catch (err) {
    res.status(500).json({ message: 'Failed to promote user' });
  }
});


router.patch('/update-task-status', adminProtect, async (req, res) => {
  const { userId, rewardIndex, newStatus } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const reward = user.rewards[rewardIndex];
    if (!reward) return res.status(404).json({ message: 'Reward not found at given index' });

    const wasCredited = reward.credited;
    const amount = reward.amount;

    reward.status = newStatus;

    if (newStatus === 'completed' && !reward.credited) {
      reward.credited = true;
      user.points += amount;
    } else if (newStatus === 'failed') {
      if (reward.credited) {
        reward.credited = false;
        user.points -= amount;
      }
    }

    await user.save();

    res.json({ message: `Task status updated to ${newStatus}` });
  } catch (error) {
    console.error('Admin task update error:', error);
    res.status(500).json({ message: 'Failed to update task' });
  }
});





module.exports = router;
