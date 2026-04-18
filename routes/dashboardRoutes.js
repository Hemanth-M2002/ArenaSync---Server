const express = require('express');
const router = express.Router();
const {
  getDashboardSummary,
  getQueueInfo,
  getAlerts,
  getHeatmapData,
  getRealTimeStats,
} = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');
const { apiLimiter } = require('../middleware/rateLimit');

// All dashboard routes require authentication and have rate limiting
router.use(protect);
router.use(apiLimiter);

router.get('/summary', getDashboardSummary);
router.get('/queues', getQueueInfo);
router.get('/alerts', getAlerts);
router.get('/heatmap', getHeatmapData);
router.get('/stats', getRealTimeStats);

module.exports = router;