const mongoose = require('mongoose');

const venueAnalyticsSchema = new mongoose.Schema(
  {
    venueName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    // Gate statuses: wait times, closed state, etc.
    gateStatus: [
      {
        gateId: { type: String, required: true }, // e.g., 'Gate A'
        waitTime: { type: Number, default: 5 }, // In minutes
        isClosed: { type: Boolean, default: false },
        walkingOffset: { type: Number, default: 0 }, // Extra minutes to walk here from a central point
      }
    ],
    // Density mapping for zones
    zoneDensity: [
      {
        zoneId: { type: String, required: true }, // e.g., 'N1', 'E2'
        occupancyPercentage: { type: Number, default: 10 },
        isSafe: { type: Boolean, default: true },
        status: { type: String, enum: ['Optimal', 'Steady', 'Congested', 'Danger'], default: 'Optimal' },
      }
    ],
    // High level alerts
    activeAlerts: [
      {
        type: { type: String, enum: ['warning', 'info', 'emergency'], default: 'info' },
        message: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      }
    ],
    emergencyMode: {
      type: Boolean,
      default: false,
    },
    lastPulseUpdate: {
      type: Date,
      default: Date.now,
    },
    simulationOffset: {
      type: Number,
      default: 0,
    }
  },
  {
    timestamps: true,
    collection: 'Venue_Analytics',
  }
);

const VenueAnalytics = mongoose.model('VenueAnalytics', venueAnalyticsSchema);

module.exports = VenueAnalytics;
