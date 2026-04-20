const VenueAnalytics = require('../models/VenueAnalytics');

// Initial "Empty" stadium data for seeding if a venue doesn't exist
const getDefaultVenueData = (venueName) => ({
  venueName,
  gateStatus: [
    { gateId: 'Gate A', waitTime: 5, walkingOffset: 2 },
    { gateId: 'Gate B', waitTime: 12, walkingOffset: 0 },
    { gateId: 'Gate C', waitTime: 8, walkingOffset: 4 },
    { gateId: 'Gate D', waitTime: 3, walkingOffset: 6 },
    { gateId: 'Gate E (East)', waitTime: 18, walkingOffset: 1 },
  ],
  zoneDensity: [
    { zoneId: 'N1', occupancyPercentage: 12 },
    { zoneId: 'N2', occupancyPercentage: 45 },
    { zoneId: 'E1', occupancyPercentage: 88 },
    { zoneId: 'E2', occupancyPercentage: 52 },
    { zoneId: 'S1', occupancyPercentage: 38 },
    { zoneId: 'S2', occupancyPercentage: 15 },
    { zoneId: 'W1', occupancyPercentage: 92 },
    { zoneId: 'W2', occupancyPercentage: 41 },
  ],
  activeAlerts: [
    { type: 'info', message: 'Welcome to the Arena! Match starts in 45 minutes.' }
  ]
});

/**
 * Get live analytics for a venue (includes auto-simulation pulse)
 * @route GET /api/analytics/live
 */
exports.getLiveAnalytics = async (req, res, next) => {
  try {
    const { venue } = req.query;
    if (!venue) {
      return res.status(400).json({ success: false, message: 'Venue name is required' });
    }

    let analytics = await VenueAnalytics.findOne({ venueName: venue });

    // 1. Initial Seed if not exists
    if (!analytics) {
      analytics = await VenueAnalytics.create(getDefaultVenueData(venue));
    }

    // 2. Pulse Simulation (if last update > 30s)
    const now = new Date();
    const timeDiff = (now - new Date(analytics.lastPulseUpdate)) / 1000;

    if (timeDiff > 30 && !analytics.emergencyMode) {
      // Simulate minor fluctuations
      analytics.gateStatus.forEach(gate => {
        // Fluctuat waitTime by -2 to +2, min 2
        const drift = Math.floor(Math.random() * 5) - 2;
        gate.waitTime = Math.max(2, gate.waitTime + drift);
      });

      analytics.zoneDensity.forEach(zone => {
        // Fluctuate density by -5% to +5%, bound 5-98%
        const drift = Math.floor(Math.random() * 11) - 5;
        const offset = analytics.simulationOffset || 0;
        zone.occupancyPercentage = Math.min(98, Math.max(5, zone.occupancyPercentage + drift + offset));
        
        // Update status string based on density
        if (zone.occupancyPercentage < 30) zone.status = 'Optimal';
        else if (zone.occupancyPercentage < 70) zone.status = 'Steady';
        else zone.status = 'Congested';
      });

      analytics.lastPulseUpdate = now;
      await analytics.save();
    }

    res.status(200).json({
      success: true,
      data: analytics
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Manually trigger or toggle Emergency Mode (Admin Simulator)
 * @route PATCH /api/analytics/emergency
 */
exports.toggleEmergency = async (req, res, next) => {
  try {
    const { venue, enabled } = req.body;
    let analytics = await VenueAnalytics.findOne({ venueName: venue });

    if (!analytics) {
      return res.status(404).json({ success: false, message: 'Venue not found' });
    }

    analytics.emergencyMode = enabled;
    
    if (enabled) {
      analytics.activeAlerts.unshift({
        type: 'emergency',
        message: 'CRITICAL: Emergency Evacuation in progress. Follow Green paths on your map immediately!',
        timestamp: new Date()
      });
      // Mark specific zones as danger
      analytics.zoneDensity.forEach(zone => {
        if (zone.occupancyPercentage > 60) {
          zone.isSafe = false;
          zone.status = 'Danger';
        } else {
          zone.isSafe = true;
          zone.status = 'Optimal';
        }
      });
    } else {
      // Clear emergency alerts
      analytics.activeAlerts = analytics.activeAlerts.filter(a => a.type !== 'emergency');
      analytics.zoneDensity.forEach(zone => {
        zone.isSafe = true;
        if (zone.occupancyPercentage > 70) zone.status = 'Congested';
        else zone.status = 'Steady';
      });
    }

    await analytics.save();
    res.status(200).json({ success: true, emergencyMode: analytics.emergencyMode, data: analytics });
  } catch (error) {
    next(error);
  }
};
/**
 * Update Simulation Parameters (Admin Only)
 * @route PATCH /api/analytics/simulate
 */
exports.updateSimulation = async (req, res, next) => {
  try {
    const { venue, simulationOffset } = req.body;
    const analytics = await VenueAnalytics.findOneAndUpdate(
      { venueName: venue },
      { simulationOffset },
      { new: true }
    );
    res.status(200).json({ success: true, data: analytics });
  } catch (error) {
    next(error);
  }
};
