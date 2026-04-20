const mongoose = require('mongoose');

const ticketDetailSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    ticketType: {
      type: String,
      enum: ['e-ticket', 'physical'],
      required: true,
      default: 'e-ticket',
    },
    bookingId: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['Cricket', 'Concert', 'Football', 'Kabaddi', 'Other'],
      required: true,
      default: 'Cricket',
    },
    eventName: {
      type: String,
      required: true,
      trim: true,
    },
    venueName: {
      type: String,
      required: true,
      trim: true,
    },
    eventDate: {
      type: Date,
      required: true,
    },
    gate: {
      type: String,
      trim: true,
    },
    stand: {
      type: String,
      trim: true,
    },
    seat: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: 'Ticket_Details', // The user requested the collection to specifically be named "Ticket_Details"
  }
);

// Create compound index so same user doesn't duplicate same ticket
ticketDetailSchema.index({ userName: 1, bookingId: 1 }, { unique: true });

const TicketDetail = mongoose.model('TicketDetail', ticketDetailSchema);

module.exports = TicketDetail;
