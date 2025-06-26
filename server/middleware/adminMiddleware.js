const jwt = require('jsonwebtoken');
const User = require('../models/User');

const adminProtect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer')) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    req.user = user;
    req.userRole = 'admin';
    req.tokenPayload = decoded;

    next();
  } catch (error) {
    console.error('Admin auth error:', error);
    return res.status(401).json({ message: 'Not authorized' });
  }
};

module.exports = adminProtect;
