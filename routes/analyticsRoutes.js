const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

router.get('/live', protect, analyticsController.getLiveAnalytics);
router.patch('/emergency', protect, analyticsController.toggleEmergency);

module.exports = router;
