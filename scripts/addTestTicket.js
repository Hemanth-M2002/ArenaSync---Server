require('dotenv').config();
const mongoose = require('mongoose');
const TicketDetail = require('../models/TicketDetail');

const MONGO_URI = process.env.MONGO_URI;
const userName = process.argv[2];

if (!userName) {
  console.error('❌ Error: Please provide a User Name as an argument.');
  console.log('Usage: node scripts/addTestTicket.js "John Doe"');
  process.exit(1);
}

async function addTestTicket() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    
    // Check if ticket already exists
    const existing = await TicketDetail.findOne({ bookingId: 'ARENA-12345' });
    if (existing) {
       await TicketDetail.deleteOne({ bookingId: 'ARENA-12345' });
       console.log('🗑️ Deleted existing duplicate test ticket...');
    }

    const testTicket = new TicketDetail({
      userName: userName,
      ticketType: 'e-ticket',
      bookingId: 'ARENA-12345',
      category: 'Cricket',
      cricketLeague: 'IPL',
      eventName: 'IPL Final: GT vs CSK',
      venueName: 'Narendra Modi Stadium, Ahmedabad',
      eventDate: new Date('2026-05-28'),
      gate: 'Gate 4',
      stand: 'VIP South Stand',
      seat: 'A-101'
    });

    await testTicket.save();
    
    console.log('\n✅ Success! Test ticket created for: ' + userName);
    console.log('-------------------------------------------');
    console.log('Use these details in the frontend:');
    console.log('Booking ID: ARENA-12345');
    console.log('Category: Cricket');
    console.log('League: IPL');
    console.log('Event: IPL Final: GT vs CSK');
    console.log('Venue: Narendra Modi Stadium, Ahmedabad');
    console.log('Date: 2026-05-28');
    console.log('Gate: Gate 4');
    console.log('Stand: VIP South Stand');
    console.log('Seat: A-101');
    console.log('-------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating ticket:', error.message);
    process.exit(1);
  }
}

addTestTicket();
