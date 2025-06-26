const Otp = require('../models/Otp');
const sendOtpEmail = require('../utils/sendEmail');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

exports.sendOtp = async (req, res) => {
  const { email, contact } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString(); 

  try {
    await Otp.create({ email, contact, otp });

    await sendOtpEmail(email, otp);

    res.status(200).json({ message: "OTP sent successfully to your email" });

  } catch (err) {
    console.error("OTP SEND ERROR:", err);
    res.status(500).json({ message: "Failed to send OTP", error: err.message });
  }
};

exports.verifyOtpAndSignup = async (req, res) => {
  const { name, email, password, contact, age, referralCode, otp } = req.body;

  try {

    const existingOtp = await Otp.findOne({ email, otp });
    if (!existingOtp) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }


    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }


    const hashedPassword = await bcrypt.hash(password, 10);

 
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      contact,
      age,
      rewards: [],
      points: 0
    });


    if (referralCode) {
      const referrer = await User.findOne({ referralCode });
      if (referrer) {
       
        if (referrer.email === newUser.email) {
          return res.status(400).json({ message: "You cannot refer yourself" });
        }

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

    await newUser.save();

    await Otp.deleteOne({ _id: existingOtp._id });

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
