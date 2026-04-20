/**
 * Migration: Backfill cricketLeague field on existing Cricket tickets
 *
 * Based on what's in your DB from Compass:
 *   - Ticket with eventName "IPL"         → cricketLeague: "IPL"
 *   - Ticket with eventName "Mumbai Indians vs Chennai Super Kings" → cricketLeague: "IPL"
 *   - Tickets with eventName containing "TNPL" or "Tamil Nadu" → cricketLeague: "TNPL"
 *
 * Run: node scripts/migrateTicketLeague.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/UserID';

async function migrate() {
  console.log('🔌 Connecting to UserID database...');
  await mongoose.connect(MONGO_URI);
  console.log(`✅ Connected to: ${MONGO_URI}\n`);

  const db = mongoose.connection.db;
  const collection = db.collection('Ticket_Details');

  // ── Step 1: Find all Cricket tickets that don't have cricketLeague set ──
  const cricketTickets = await collection.find({
    category: 'Cricket',
    $or: [
      { cricketLeague: { $exists: false } },
      { cricketLeague: null },
    ],
  }).toArray();

  console.log(`📋 Found ${cricketTickets.length} Cricket ticket(s) without cricketLeague set.`);

  if (cricketTickets.length === 0) {
    console.log('✅ Nothing to migrate. All tickets are up to date.');
    await mongoose.disconnect();
    return;
  }

  let updated = 0;
  for (const ticket of cricketTickets) {
    const name = ticket.eventName || '';
    const nameLower = name.toLowerCase();

    // Determine league from eventName heuristic
    let league = 'IPL'; // default to IPL for now
    if (nameLower.includes('tnpl') || nameLower.includes('tamil nadu premier')) {
      league = 'TNPL';
    }

    await collection.updateOne(
      { _id: ticket._id },
      { $set: { cricketLeague: league } }
    );

    console.log(`   ✓ Ticket [${ticket.bookingId}] "${ticket.eventName}" → cricketLeague: "${league}"`);
    updated++;
  }

  console.log(`\n🎉 Migration complete! Updated ${updated} ticket(s).`);
  await mongoose.disconnect();
  console.log('🔌 Disconnected.');
}

migrate().catch((err) => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
