const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { submitPayout } = require('../controllers/payoutController');
const {checkPayoutStatus } = require('../controllers/payoutController');

router.get('/status/:utr', protect, checkPayoutStatus);
router.post('/', protect, submitPayout);

module.exports = router;
