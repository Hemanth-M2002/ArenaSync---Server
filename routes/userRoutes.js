const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  getAllUsers,
  getUserById,
  deleteUser,
  getDetails,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validateProfileUpdate, checkValidation } = require('../utils/validators');

// Public testing route
router.get('/all-details', getDetails);

// All routes below require authentication
router.use(protect);

// User routes
router.get('/profile', getProfile);
router.put('/profile', validateProfileUpdate, checkValidation, updateProfile);

// Admin only routes
router.get('/', authorize('admin'), getAllUsers);
router.get('/:id', authorize('admin'), getUserById);
router.delete('/:id', authorize('admin'), deleteUser);

module.exports = router;