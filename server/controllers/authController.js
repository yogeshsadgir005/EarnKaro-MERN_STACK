const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const signup = async (req, res) => {
  const { name, email, password, contact, age, referralCode } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, contact, age });

    if (referralCode) {
      const referrer = await User.findOne({ referralCode });
      if (!referrer) return res.status(400).json({ message: 'Invalid referral code' });

      referrer.referrals.push(newUser._id.toString());
      referrer.points += 100;
      referrer.rewards.push({
        title: 'Referral Bonus',
        amount: 100,
        credited: true,
        status: 'completed',
      });
      await referrer.save();

      newUser.points += 50;
      newUser.rewards.push({
        title: 'Signup Bonus via Referral',
        amount: 50,
        credited: true,
        status: 'completed',
      });
    }

    await newUser.save();

    res.status(201).json({
      token: generateToken(newUser._id),
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        isAdmin: newUser.isAdmin || false,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Signup failed', error: err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    res.status(200).json({
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin || false,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login' });
  }
};

module.exports = { signup, login };
