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

// ✅ GET /api/user/profile — Get user info
router.get('/profile', protect, getProfile);

// ✅ PUT /api/user/profile — Update name/contact
router.put('/profile', protect, updateProfile);

// ✅ GET /api/user/rewards — Get rewards array
router.get('/rewards', protect, getRewards);

// ✅ GET /api/user/referrals — Get referralCode and list
router.get('/referrals', protect, getReferrals);

router.get('/leaderboard', getLeaderboard);

module.exports = router;
