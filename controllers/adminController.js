const Incident = require('../models/Incident');
const VenueAnalytics = require('../models/VenueAnalytics');
const User = require('../models/User');

/**
 * Get aggregate dashboard stats
 * @route GET /api/admin/stats
 */
exports.getDashboardStats = async (req, res, next) => {
  try {
    const { venue } = req.query;
    if (!venue) return res.status(400).json({ success: false, message: 'Venue required' });

    const analytics = await VenueAnalytics.findOne({ venueName: venue });
    const incidentStats = await Incident.aggregate([
      { $match: { 'location.venue': venue } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const totalUsers = await User.countDocuments({ 'preferences.selectedVenue': venue });

    res.status(200).json({
      success: true,
      stats: {
        totalAttendees: totalUsers + 1240, // Simulated baseline + tracked users
        activeAlerts: analytics?.activeAlerts?.length || 0,
        incidentStatus: incidentStats,
        emergencyMode: analytics?.emergencyMode || false,
        avgWaitTime: analytics ? (analytics.gateStatus.reduce((acc, g) => acc + g.waitTime, 0) / analytics.gateStatus.length).toFixed(1) : 0
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all incidents for a venue
 * @route GET /api/admin/incidents
 */
exports.getIncidents = async (req, res, next) => {
  try {
    const { venue } = req.query;
    const incidents = await Incident.find({ 'location.venue': venue }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, incidents });
  } catch (error) {
    next(error);
  }
};

/**
 * Update incident status
 * @route PATCH /api/admin/incidents/:id
 */
exports.updateIncident = async (req, res, next) => {
  try {
    const { status, resolutionNotes } = req.body;
    const incident = await Incident.findByIdAndUpdate(
      req.params.id,
      { 
        status, 
        resolutionNotes, 
        resolvedAt: status === 'Resolved' ? new Date() : null 
      },
      { new: true }
    );
    res.status(200).json({ success: true, incident });
  } catch (error) {
    next(error);
  }
};

/**
 * Broadcast custom alert
 * @route POST /api/admin/broadcast
 */
exports.broadcastAlert = async (req, res, next) => {
  try {
    const { venue, message, type } = req.body;
    const analytics = await VenueAnalytics.findOne({ venueName: venue });
    if (!analytics) return res.status(404).json({ success: false, message: 'Venue not found' });

    analytics.activeAlerts.unshift({
      type: type || 'info',
      message,
      timestamp: new Date()
    });

    await analytics.save();
    res.status(200).json({ success: true, message: 'Alert broadcasted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new incident (Public endpoint for Fans)
 * @route POST /api/admin/incidents/public
 */
exports.createIncident = async (req, res, next) => {
  try {
    const { type, description, location } = req.body;
    
    const incident = await Incident.create({
      type,
      description,
      location,
      reportedBy: {
        userId: req.user._id,
        userName: req.user.name
      }
    });

    res.status(201).json({ success: true, incident });
  } catch (error) {
    next(error);
  }
};
