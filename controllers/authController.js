const User = require('../models/User');
const { generateToken } = require('../utils/generateToken');
const googleAuth = require('../config/google');

/**
 * Register a new user with email and password
 * @route POST /api/auth/register
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      provider: 'local',
      isVerified: true, // Set to false if email verification is implemented
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login user with email and password
 * @route POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if user exists and include password field
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check if user uses local provider
    if (user.provider !== 'local') {
      return res.status(401).json({
        success: false,
        message: `Please login using ${user.provider} authentication`,
      });
    }

    // Check password
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login or register with Google
 * @route POST /api/auth/google
 */
const googleLogin = async (req, res, next) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: 'Google credential token is required',
      });
    }

    // Verify Google token
    const googleUser = await googleAuth.verifyToken(credential);
    
    // Check if user exists
    let user = await User.findOne({ 
      $or: [
        { email: googleUser.email },
        { googleId: googleUser.googleId }
      ]
    });

    if (user) {
      // Update existing user with Google ID if not already set
      if (!user.googleId && user.provider === 'local') {
        user.googleId = googleUser.googleId;
        user.provider = 'google';
        user.avatar = googleUser.avatar || user.avatar;
        user.isVerified = googleUser.emailVerified;
        await user.save();
      }
      
      // Update last login
      user.lastLogin = Date.now();
      await user.save();
    } else {
      // Create new user
      user = await User.create({
        name: googleUser.name,
        email: googleUser.email,
        googleId: googleUser.googleId,
        avatar: googleUser.avatar,
        provider: 'google',
        isVerified: googleUser.emailVerified,
        password: null, // No password for Google users
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Google authentication successful',
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current authenticated user
 * @route GET /api/auth/me
 */
const getCurrentUser = async (req, res, next) => {
  try {
    // User is already attached by auth middleware
    res.status(200).json({
      success: true,
      user: req.user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Logout user
 * @route POST /api/auth/logout
 */
const logout = async (req, res, next) => {
  try {
    // In a production app with Redis, we would blacklist the token here
    // For now, just return success response
    
    // TODO: Implement token blacklisting with Redis
    // await redisClient.set(`blacklist:${token}`, 'true', 'EX', tokenExpiry);
    
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  googleLogin,
  getCurrentUser,
  logout,
};