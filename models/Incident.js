const mongoose = require('mongoose');

/**
 * Incident Schema for ArenaSync
 * Tracks fan-reported issues and venue-wide emergency logs
 */
const incidentSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['Security', 'Medical', 'Fire', 'Facility', 'Crowd', 'Other'],
      required: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [200, 'Description cannot exceed 200 characters'],
    },
    location: {
      zoneId: { type: String, required: true }, // e.g., 'N1', 'E2'
      venue: { type: String, required: true }, // e.g., 'Narendra Modi Stadium'
    },
    status: {
      type: String,
      enum: ['Open', 'In-Progress', 'Resolved', 'Dismissed'],
      default: 'Open',
    },
    reportedBy: {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      userName: String,
    },
    resolutionNotes: String,
    resolvedAt: Date,
  },
  {
    timestamps: true,
  }
);

const Incident = mongoose.model('Incident', incidentSchema);
module.exports = Incident;
