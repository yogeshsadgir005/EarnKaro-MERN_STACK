const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const adminProtect = require('../middleware/adminMiddleware');
const {
  submitPayout,
  getUserPayoutHistory,
  getAllPayoutRequests,
  updatePayoutStatus
} = require('../controllers/payoutController');

router.post('/', protect, submitPayout);
router.get('/history', protect, getUserPayoutHistory);

router.get('/admin/all', adminProtect, getAllPayoutRequests);
router.patch('/admin/update-status', adminProtect, updatePayoutStatus);

module.exports = router;
