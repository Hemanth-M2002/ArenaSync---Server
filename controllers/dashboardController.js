/**
 * Get dashboard summary data
 * @route GET /api/dashboard/summary
 */
const getDashboardSummary = async (req, res, next) => {
  try {
    // Mock data for frontend integration
    // In production, this would come from real-time analytics and sensors
    const summary = {
      fastestGate: "Gate B",
      waitTime: "3 mins",
      crowdLevel: "Moderate",
      alerts: 2,
      event: "IPL Final",
      timestamp: new Date().toISOString(),
      statistics: {
        totalVisitors: 45230,
        currentOccupancy: 28450,
        capacity: 75000,
        occupancyRate: "38%",
      }
    };

    res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get queue information for all gates
 * @route GET /api/dashboard/queues
 */
const getQueueInfo = async (req, res, next) => {
  try {
    // Mock queue data
    const queues = [
      {
        gateId: "Gate A",
        gateName: "North Entrance A",
        waitTime: "8 mins",
        queueLength: 45,
        status: "busy",
        estimatedThroughput: "120 persons/min",
      },
      {
        gateId: "Gate B",
        gateName: "North Entrance B",
        waitTime: "3 mins",
        queueLength: 18,
        status: "normal",
        estimatedThroughput: "95 persons/min",
      },
      {
        gateId: "Gate C",
        gateName: "East Entrance",
        waitTime: "12 mins",
        queueLength: 67,
        status: "very busy",
        estimatedThroughput: "110 persons/min",
      },
      {
        gateId: "Gate D",
        gateName: "West Entrance",
        waitTime: "5 mins",
        queueLength: 28,
        status: "normal",
        estimatedThroughput: "100 persons/min",
      },
      {
        gateId: "Gate E",
        gateName: "South Entrance",
        waitTime: "2 mins",
        queueLength: 12,
        status: "quiet",
        estimatedThroughput: "85 persons/min",
      },
    ];

    res.status(200).json({
      success: true,
      data: queues,
      totalGates: queues.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get active alerts for the venue
 * @route GET /api/dashboard/alerts
 */
const getAlerts = async (req, res, next) => {
  try {
    // Mock alerts data
    const alerts = [
      {
        id: "alert_001",
        type: "crowd",
        severity: "medium",
        title: "High congestion at Gate C",
        message: "Gate C is experiencing higher than normal traffic. Estimated wait time 12+ minutes.",
        location: "Gate C - East Entrance",
        timestamp: new Date(Date.now() - 5 * 60000).toISOString(), // 5 minutes ago
        status: "active",
        suggestedAction: "Direct visitors to Gate B or Gate E",
      },
      {
        id: "alert_002",
        type: "security",
        severity: "low",
        title: "Suspicious activity detected",
        message: "Unattended bag reported near concession stand 3.",
        location: "Concession Stand 3 - North Wing",
        timestamp: new Date(Date.now() - 15 * 60000).toISOString(), // 15 minutes ago
        status: "investigating",
        suggestedAction: "Security team dispatched",
      },
      {
        id: "alert_003",
        type: "maintenance",
        severity: "low",
        title: "Restroom maintenance",
        message: "Restroom B is temporarily closed for cleaning.",
        location: "Restroom B - West Wing",
        timestamp: new Date(Date.now() - 30 * 60000).toISOString(), // 30 minutes ago
        status: "resolved",
        suggestedAction: "Direct visitors to nearest alternative restrooms",
      },
    ];

    // Filter by status if query param provided
    let filteredAlerts = alerts;
    if (req.query.status) {
      filteredAlerts = alerts.filter(alert => alert.status === req.query.status);
    }

    res.status(200).json({
      success: true,
      data: filteredAlerts,
      total: filteredAlerts.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get heatmap data for crowd visualization
 * @route GET /api/dashboard/heatmap
 */
const getHeatmapData = async (req, res, next) => {
  try {
    // Mock heatmap data for different zones
    const heatmapData = [
      { 
        zone: "North Wing", 
        level: "high",
        coordinates: { x: 150, y: 50 },
        density: 0.85,
        visitors: 1250,
        capacity: 1500,
      },
      { 
        zone: "East Gate", 
        level: "low",
        coordinates: { x: 350, y: 150 },
        density: 0.25,
        visitors: 380,
        capacity: 1500,
      },
      { 
        zone: "South Plaza", 
        level: "medium",
        coordinates: { x: 200, y: 400 },
        density: 0.55,
        visitors: 825,
        capacity: 1500,
      },
      { 
        zone: "West Concourse", 
        level: "high",
        coordinates: { x: 50, y: 250 },
        density: 0.78,
        visitors: 1170,
        capacity: 1500,
      },
      { 
        zone: "Main Stage Area", 
        level: "critical",
        coordinates: { x: 250, y: 200 },
        density: 0.95,
        visitors: 2850,
        capacity: 3000,
      },
      { 
        zone: "Food Court", 
        level: "high",
        coordinates: { x: 300, y: 300 },
        density: 0.82,
        visitors: 1230,
        capacity: 1500,
      },
      { 
        zone: "VIP Lounge", 
        level: "low",
        coordinates: { x: 100, y: 100 },
        density: 0.15,
        visitors: 75,
        capacity: 500,
      },
    ];

    res.status(200).json({
      success: true,
      data: heatmapData,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get real-time statistics
 * @route GET /api/dashboard/stats
 */
const getRealTimeStats = async (req, res, next) => {
  try {
    const stats = {
      totalVisitorsToday: 45230,
      currentOccupancy: 28450,
      peakOccupancy: 32100,
      peakTime: "19:30",
      averageWaitTime: "6.5 mins",
      gateEfficiency: {
        "Gate A": 78,
        "Gate B": 92,
        "Gate C": 65,
        "Gate D": 85,
        "Gate E": 94,
      },
      popularAreas: [
        { area: "Main Stage", percentage: 35 },
        { area: "Food Court", percentage: 25 },
        { area: "Merchandise", percentage: 15 },
        { area: "Rest Zones", percentage: 10 },
        { area: "Other", percentage: 15 },
      ],
    };

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardSummary,
  getQueueInfo,
  getAlerts,
  getHeatmapData,
  getRealTimeStats,
};