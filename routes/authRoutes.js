const express = require('express');
const router = express.Router();
const {
  register,
  login,
  googleLogin,
  getCurrentUser,
  logout,
  adminLogin
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimit');
const {
  validateRegister,
  validateLogin,
  validateGoogleLogin,
  checkValidation,
} = require('../utils/validators');

// Public routes
router.post('/register', authLimiter, validateRegister, checkValidation, register);
router.post('/login', authLimiter, validateLogin, checkValidation, login);
router.post('/google', authLimiter, validateGoogleLogin, checkValidation, googleLogin);
router.post('/admin/login', authLimiter, adminLogin);

// Protected routes
router.get('/me', protect, getCurrentUser);
router.post('/logout', protect, logout);

module.exports = router;