const User = require('../models/User');

/**
 * Get user profile
 * @route GET /api/users/profile
 */
const getProfile = async (req, res, next) => {
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
 * Update user profile
 * @route PUT /api/users/profile
 */
const updateProfile = async (req, res, next) => {
  try {
    const { name, email, preferences } = req.body;
    const userId = req.user._id;

    // Check if email is being changed and if it's already taken
    if (email && email !== req.user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use by another account',
        });
      }
    }

    // Update user properties
    if (name) req.user.name = name;
    if (email && email !== req.user.email) req.user.email = email;
    
    // Update preferences - careful merge
    if (preferences) {
      if (!req.user.preferences) req.user.preferences = {};
      
      if (preferences.selectedSport) req.user.preferences.selectedSport = preferences.selectedSport;
      if (preferences.selectedVenue) req.user.preferences.selectedVenue = preferences.selectedVenue;
      if (preferences.notifications !== undefined) req.user.preferences.notifications = preferences.notifications;
      if (preferences.language) req.user.preferences.language = preferences.language;
    }

    // Save and return
    const updatedUser = await req.user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all users (Admin only)
 * @route GET /api/users
 */
const getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find({})
      .select('-password')
      .skip(skip)
      .limit(limit)
      .sort('-createdAt');

    const total = await User.countDocuments();

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user by ID (Admin only)
 * @route GET /api/users/:id
 */
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user (Admin only)
 * @route DELETE /api/users/:id
 */
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account through this route',
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get raw details from the collection (for testing/verification)
 * @route GET /api/users/all-details
 */
const getDetails = async (req, res, next) => {
  try {
    const details = await User.find({});
    
    res.status(200).json({
      success: true,
      count: details.length,
      data: details,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getAllUsers,
  getUserById,
  deleteUser,
  getDetails,
};