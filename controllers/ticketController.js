const TicketDetail = require('../models/TicketDetail');

/**
 * Register a new ticket
 * @route POST /api/tickets
 */
const registerTicket = async (req, res, next) => {
  try {
    const { 
      ticketType, 
      bookingId, 
      category, 
      cricketLeague,   // IPL | TNPL — only sent when category === 'Cricket'
      eventName, 
      venueName, 
      eventDate, 
      gate, 
      stand, 
      seat 
    } = req.body;

    // ── Cricket League Guard ────────────────────────────────────────────────
    // If the sport is Cricket, the user MUST pick IPL or TNPL on the frontend.
    // Any other value (or missing value) is rejected before even hitting the DB.
    if (category === 'Cricket') {
      const validLeagues = ['IPL', 'TNPL'];
      if (!cricketLeague || !validLeagues.includes(cricketLeague)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid Cricket League. Please select either IPL or TNPL on your ticket.',
        });
      }
    }
    
    // 1. Simulate a 3rd-party ticket verification delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 2. Cross-check with DB records field by field
    // We treat the pre-loaded DB records as the trusted BoxOffice source
    const ticket = await TicketDetail.findOne({ 
      userName: req.user.name, 
      bookingId: bookingId
    });

    if (!ticket) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Booking/PNR ID. No ticket found under your account name.',
      });
    }

    if (ticket.category !== category) {
      return res.status(400).json({ success: false, message: `Category mismatch: The provided sport category is incorrect.` });
    }

    // ── Cricket League DB Verification ─────────────────────────────────────
    // If the DB record has a cricketLeague stored, it must match what the user submitted.
    // If the DB record has no cricketLeague yet (legacy data), we skip this check
    // (the migration script below will backfill those records).
    if (category === 'Cricket' && ticket.cricketLeague) {
      if (ticket.cricketLeague !== cricketLeague) {
        return res.status(400).json({
          success: false,
          message: `Wrong Cricket League: This ticket is for ${ticket.cricketLeague}, not ${cricketLeague}. Please select the correct league.`,
        });
      }
    }
    
    if (ticket.venueName !== venueName) {
      return res.status(400).json({ success: false, message: `Location mismatch: The ticket does not match the selected venue.` });
    }
    
    if (ticket.eventName.toLowerCase().trim() !== eventName.toLowerCase().trim()) {
      return res.status(400).json({ success: false, message: `Event Name mismatch: The provided event name is incorrect.` });
    }
    
    // Check Date (convert DB ISO string to YYYY-MM-DD for standard html date input check)
    if (ticket.eventDate) {
      const dbDate = new Date(ticket.eventDate).toISOString().split('T')[0];
      if (dbDate !== eventDate) {
         return res.status(400).json({ success: false, message: `Event Date mismatch: The provided date is incorrect.` });
      }
    }
    
    if (ticket.gate.toLowerCase().trim() !== gate.toLowerCase().trim()) {
      return res.status(400).json({ success: false, message: `Incorrect Gate/Entry details provided.` });
    }
    
    if (ticket.stand.toLowerCase().trim() !== stand.toLowerCase().trim()) {
      return res.status(400).json({ success: false, message: `Incorrect Stand/Block details provided.` });
    }
    
    if (ticket.seat.toLowerCase().trim() !== seat.toLowerCase().trim()) {
      return res.status(400).json({ success: false, message: `Incorrect Seat Number provided.` });
    }

    // ── Success message ─────────────────────────────────────────────────────
    let successMsg = 'Ticket authenticated and registered successfully!';
    if (category === 'Cricket') {
      const league = ticket.cricketLeague || cricketLeague;
      successMsg = `${league} ticket verified! Get ready for the match. 🏏`;
    } else if (category === 'Concert') {
      successMsg = 'VIP Pass verified! Enjoy the show.';
    }

    res.status(200).json({
      success: true,
      message: successMsg,
      ticket: ticket,
    });
  } catch (error) {
    next(error);
  }
};


/**
 * Get user's registered tickets
 * @route GET /api/tickets/my-tickets
 */
const getMyTickets = async (req, res, next) => {
  try {
    const tickets = await TicketDetail.find({ userName: req.user.name })
                                      .sort('-createdAt'); // freshest first

    res.status(200).json({
      success: true,
      count: tickets.length,
      tickets,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerTicket,
  getMyTickets,
};
