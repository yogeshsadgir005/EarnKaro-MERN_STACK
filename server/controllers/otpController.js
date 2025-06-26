const Otp = require('../models/Otp');
const sendOtpEmail = require('../utils/sendEmail');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// ✅ 1. Send OTP to email
exports.sendOtp = async (req, res) => {
  const { email, contact } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit

  try {
    await Otp.create({ email, contact, otp });

    // ✅ Send real email (Gmail SMTP)
    await sendOtpEmail(email, otp);

    res.status(200).json({ message: "OTP sent successfully to your email" });

  } catch (err) {
    console.error("OTP SEND ERROR:", err);
    res.status(500).json({ message: "Failed to send OTP", error: err.message });
  }
};

// ✅ 2. Verify OTP and create user
exports.verifyOtpAndSignup = async (req, res) => {
  const { name, email, password, contact, age, referralCode, otp } = req.body;

  try {
    // 1. Check if OTP is valid
    const existingOtp = await Otp.findOne({ email, otp });
    if (!existingOtp) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 3. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create new user object
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      contact,
      age,
      rewards: [],
      points: 0
    });

    // ✅ 5. Handle referral logic
    if (referralCode) {
      const referrer = await User.findOne({ referralCode });
      if (referrer) {
        // Prevent self-referral
        if (referrer.email === newUser.email) {
          return res.status(400).json({ message: "You cannot refer yourself" });
        }

        // 💰 Give referral rewards as objects (not strings!)
        referrer.points += 100;
        referrer.referrals.push(newUser.name);
        referrer.rewards.push({
          title: `Referral bonus from ${newUser.name}`,
          amount: 100
        });
        await referrer.save();

        newUser.points += 50;
        newUser.rewards.push({
          title: `Signup bonus for using referral code`,
          amount: 50
        });
      } else {
        return res.status(400).json({ message: "Invalid referral code" });
      }
    }

    // 6. Save new user to DB
    await newUser.save();

    // 7. Delete the used OTP
    await Otp.deleteOne({ _id: existingOtp._id });

    // 8. Return token and user
    const token = generateToken(newUser._id);
    res.status(201).json({
      message: "Signup successful",
      token,
      user: newUser
    });

  } catch (err) {
    console.error("❌ Signup Error:", err.message);
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
};
