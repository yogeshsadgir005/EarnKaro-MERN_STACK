const express = require('express');
const router = express.Router();

const protect = require('../middleware/authMiddleware');
const {
  getProfile,
  updateProfile,
  getRewards,
  getReferrals,
  getLeaderboard
} = require('../controllers/userController');

router.get('/profile', protect, getProfile);

router.put('/profile', protect, updateProfile);

router.get('/rewards', protect, getRewards);

router.get('/referrals', protect, getReferrals);

router.get('/leaderboard', getLeaderboard);

module.exports = router;
