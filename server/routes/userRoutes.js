const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  getProfile,
  updateProfile,
  getRewards,
  getReferrals,
  getLeaderboard,
  getStreak,
} = require('../controllers/userController');

const {
  submitPayout,
  getUserPayoutHistory,
} = require('../controllers/payoutController');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/rewards', protect, getRewards);
router.get('/referrals', protect, getReferrals);
router.get('/leaderboard', getLeaderboard);
router.get('/payout-history', protect, getUserPayoutHistory);
router.post('/request-payout', protect, submitPayout);
router.get('/streak', protect, getStreak);

module.exports = router;
