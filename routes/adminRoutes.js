const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/roleMiddleware');
const {
  getDashboardStats,
  getIncidents,
  updateIncident,
  broadcastAlert,
  createIncident
} = require('../controllers/adminController');
const { updateSimulation } = require('../controllers/analyticsController');

// Fan reporting route (Required Auth, but not Admin)
router.post('/incidents/public', protect, createIncident);

// All other admin routes are protected and require admin role
router.use(protect);
router.use(isAdmin);

router.get('/stats', getDashboardStats);
router.get('/incidents', getIncidents);
router.patch('/incidents/:id', updateIncident);
router.post('/broadcast', broadcastAlert);
router.patch('/simulate', updateSimulation);

module.exports = router;
