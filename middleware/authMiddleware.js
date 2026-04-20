const { verifyToken } = require('../utils/generateToken');
const User = require('../models/User');
const Admin = require('../models/Admin');

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request object
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Check for token in cookies (optional)
    else if (req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route. Please login.',
      });
    }

    // Verify token
    const decoded = verifyToken(token);
    
    // Check both collections for the identity
    let identity = await User.findById(decoded.id).select('-password');
    let isStaff = false;

    if (!identity) {
      identity = await Admin.findById(decoded.id).select('-password');
      if (identity) isStaff = true;
    }
    
    if (!identity) {
      return res.status(401).json({
        success: false,
        message: 'Account no longer exists. Please login again.',
      });
    }

    // Attach user to request object
    req.user = identity;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    
    if (error.message === 'Invalid token' || error.message === 'Token expired') {
      return res.status(401).json({
        success: false,
        message: error.message,
      });
    }
    
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route',
    });
  }
};

module.exports = { protect };