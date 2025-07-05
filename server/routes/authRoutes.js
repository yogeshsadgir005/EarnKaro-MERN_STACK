const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');
const { sendOtp, verifyOtpAndSignup } = require('../controllers/otpController');
const User = require('../models/User');

router.post('/signup', signup);
router.post('/login', login);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtpAndSignup);


router.post('/check-email', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      return res.json({ exists: true });
    } else {
      return res.json({ exists: false });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router;
