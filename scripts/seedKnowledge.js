/**
 * ArenaSync Knowledge Base Seeder
 * Populates the `ArenaAI.Knowledge_Base` collection with rich,
 * detailed venue data for all venues listed in the app.
 * Run: node scripts/seedKnowledge.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');

// ── DB Connection ──────────────────────────────────────────────────────────────
const originalUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/UserID';
const aiDatabaseUri = originalUri.replace('/UserID', '/ArenaAI');

// ── Schema (mirrors ArenaKnowledge.js) ────────────────────────────────────────
const arenaKnowledgeSchema = new mongoose.Schema(
  {
    venueName: { type: String, required: true, index: true },
    sport:     { type: String, required: true },
    structuredData: { type: String, required: true },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// ── Venue Knowledge Data ───────────────────────────────────────────────────────
const knowledgeData = [

  // ════════════════════════════════════════════════════════
  //  CRICKET VENUES
  // ════════════════════════════════════════════════════════
  {
    venueName: 'Narendra Modi Stadium, Ahmedabad',
    sport: 'Cricket',
    structuredData: JSON.stringify({
      overview: {
        fullName: 'Narendra Modi Stadium',
        city: 'Ahmedabad, Gujarat',
        capacity: 132000,
        opened: 2020,
        surface: 'Bermuda grass',
        description: 'The largest cricket stadium in the world, located in Motera, Ahmedabad.',
      },
      gates: [
        { id: 'Gate-1', name: 'Gate 1 (North)', location: 'North End off SG Road', nearbyParking: 'P1, P2', stands: ['Adani Stand', 'Reliance Stand'], wheelchair: true },
        { id: 'Gate-2', name: 'Gate 2 (East)', location: 'East side off Sarkhej-Gandhinagar Highway', nearbyParking: 'P3', stands: ['Pavilion Stand A', 'Pavilion Stand B'], wheelchair: true },
        { id: 'Gate-3', name: 'Gate 3 (South)', location: 'South End', nearbyParking: 'P4, P5', stands: ['BCCI Stand', 'Tata Stand'], wheelchair: false },
        { id: 'Gate-4', name: 'Gate 4 (West / VIP)', location: 'West side, VIP & Press entry', nearbyParking: 'P6 (VIP)', stands: ['VIP Lounge', 'Press Box', 'Corporate Box'], wheelchair: true },
      ],
      stands: [
        { name: 'Adani Stand', level: 'Lower Tier North', capacity: 18000, features: 'Great straight-on view of pitch, covered.' },
        { name: 'Reliance Stand', level: 'Upper Tier North', capacity: 15000, features: 'Elevated panoramic view, open air.' },
        { name: 'Pavilion Stand A', level: 'East Lower', capacity: 20000, features: 'Side-on view of pitch, partly covered.' },
        { name: 'Pavilion Stand B', level: 'East Upper', capacity: 18000, features: 'Elevated side-on view.' },
        { name: 'BCCI Stand', level: 'South Lower', capacity: 22000, features: 'Behind-bowler view covering the pavilion end.' },
        { name: 'Tata Stand', level: 'South Upper', capacity: 19000, features: 'High panoramic view from south.' },
        { name: 'VIP Lounge', level: 'West Ground', capacity: 2000, features: 'Air-conditioned, premium seating, exclusive catering.' },
        { name: 'Corporate Box', level: 'West Upper', capacity: 500, features: 'Private air-conditioned suites, dedicated waitstaff.' },
      ],
      foodAndDrinks: [
        { name: 'Café Motera', location: 'Level 1, near Gate 1 concourse', type: 'Café', items: ['Tea', 'Coffee', 'Samosa', 'Vada Pav'], timing: 'Opens 90 mins before match' },
        { name: 'Spice Route Food Court', location: 'Level 2, East Concourse', type: 'Food Court', items: ['Biryani', 'Dal Baati Churma', 'Thali', 'Noodles', 'Cold Drinks'], timing: 'Opens 2 hours before match' },
        { name: 'North Snack Bar', location: 'Gate 1 concourse, Row C', type: 'Snack Counter', items: ['Popcorn', 'Chips', 'Cold Drinks', 'Ice Cream'], timing: 'Opens at match start' },
        { name: 'South Bites', location: 'Gate 3 inner concourse', type: 'Snack Counter', items: ['Pav Bhaji', 'Sandwich', 'Fruit Juice'], timing: 'Opens at match start' },
        { name: 'VIP Dining Hall', location: 'West Wing, Level 1 (VIP only)', type: 'Fine Dining', items: ['Buffet lunch/dinner', 'Premium bar', 'Dessert counter'], timing: 'Exclusive to VIP ticket holders' },
        { name: 'Hydration Zone', location: 'All gates, every 200m', type: 'Water Point', items: ['Free drinking water kiosks'], timing: 'Always open' },
      ],
      restrooms: [
        { location: 'Gate 1 North Concourse', genderNeutral: false, wheelchairAccessible: true, count: 24 },
        { location: 'Gate 2 East Concourse, Level 1 & 2', genderNeutral: false, wheelchairAccessible: true, count: 32 },
        { location: 'Gate 3 South concourse', genderNeutral: false, wheelchairAccessible: false, count: 20 },
        { location: 'Gate 4 VIP lobby', genderNeutral: false, wheelchairAccessible: true, count: 8 },
      ],
      transport: {
        metro: 'Motera Metro Station on Ahmedabad Metro Line 1 (15 min walk from Gate 2)',
        bus: 'AMTS bus stop "Sardar Patel Ring Road" opposite Gate 1',
        parking: ['P1 & P2: North lot (2000 cars)', 'P3: East lot (1500 cars)', 'P4 & P5: South lot (2500 cars)', 'P6: West VIP lot (500 cars)'],
        autoRickshaw: 'Designated auto stand at Gate 1 and Gate 3 exits',
        taxi: 'Ola/Uber drop-off point: Gate 2 East approach road',
      },
      medicalAid: [
        { location: 'Gate 1 Concourse, first-aid room behind Section A-7', services: 'Basic first aid, defibrillator' },
        { location: 'Gate 3 inner concourse', services: 'Doctor on call, stretcher team' },
        { location: 'VIP section lobby', services: 'Private medical team' },
      ],
      dos_and_donts: {
        allowed: ['Water bottles up to 1 L (sealed)', 'Caps and hats', 'Prescription medicines (with prescription)', 'Binoculars (without case)', 'Infants and children with valid ticket'],
        notAllowed: ['Outside food or beverages in sealed containers > 1 L', 'Selfie sticks', 'Drones', 'Professional cameras with detachable lens', 'Banners larger than 1m x 1m', 'Glass bottles', 'Alcohol'],
      },
      crowdTips: [
        'Gates open 3 hours before the first ball.',
        'North (Gate 1) is usually most crowded; arrive 30 mins early if entering from there.',
        'The East concourse (Gate 2) is the least crowded during peak entry time.',
        'Use the dedicated family queue at Gate 1 if you are with children.',
        'South (Gate 3) food stalls have shorter queues during mid-innings breaks.',
      ],
    }),
  },

  {
    venueName: 'Eden Gardens, Kolkata',
    sport: 'Cricket',
    structuredData: JSON.stringify({
      overview: {
        fullName: 'Eden Gardens Cricket Stadium',
        city: 'Kolkata, West Bengal',
        capacity: 68000,
        opened: 1864,
        surface: 'Natural grass',
        description: 'One of the oldest and most iconic cricket stadiums in the world, located in the heart of Kolkata near the Maidan.',
      },
      gates: [
        { id: 'Gate-A', name: 'Gate A (Main / High Court Gate)', location: 'Facing High Court, north side', nearbyParking: 'Maidan P1', stands: ['B Block', 'C Block'], wheelchair: true },
        { id: 'Gate-B', name: 'Gate B (VIP)', location: 'South side, near pavilion', nearbyParking: 'VIP Lot', stands: ['Pavilion', 'Club House', 'Press Box'], wheelchair: true },
        { id: 'Gate-C', name: 'Gate C (East)', location: 'East wing', nearbyParking: 'Maidan P2', stands: ['Club House Stand', 'E Block'], wheelchair: false },
        { id: 'Gate-D', name: 'Gate D (West / General)', location: 'West side near Park Street', nearbyParking: 'Maidan P3', stands: ['A Block', 'D Block'], wheelchair: false },
      ],
      stands: [
        { name: 'B Block', level: 'North Lower', capacity: 8000, features: 'Head-on view from the High Court end.' },
        { name: 'C Block', level: 'North Upper', capacity: 7000, features: 'Elevated view, partially covered.' },
        { name: 'Pavilion', level: 'South Ground Level', capacity: 3000, features: 'Traditional members pavilion, covered, best central view.' },
        { name: 'Club House Stand', level: 'East', capacity: 10000, features: 'Side-on view, modern seating.' },
        { name: 'A Block', level: 'West Lower', capacity: 9000, features: 'Behind-bowler view from the west side.' },
        { name: 'D Block', level: 'West Upper', capacity: 8000, features: 'High elevated side view.' },
      ],
      foodAndDrinks: [
        { name: 'Rosogolla Café', location: 'Gate A concourse, Level 1', type: 'Café', items: ['Rosogolla', 'Mishti Doi', 'Chai', 'Kachori', 'Jalebi'], timing: 'Opens 90 minutes before match' },
        { name: 'Mughal Corner', location: 'Gate D inner walkway', type: 'Food Stall', items: ['Biryani', 'Rolls', 'Kebabs', 'Cold Drinks'], timing: 'Opens at match start' },
        { name: 'East Wing Snack Bar', location: 'Gate C concourse row B', type: 'Snack Counter', items: ['Samosa', 'Chips', 'Pepsi', 'Ice Cream'], timing: 'Opens at match start' },
        { name: 'Pavilion Lounge Pantry', location: 'Pavilion, ground floor (member only)', type: 'Member Pantry', items: ['Hot meals', 'Coffee', 'Juices', 'Sweets'], timing: 'Members only' },
      ],
      restrooms: [
        { location: 'Gate A, Level 1 and Level 2', genderNeutral: false, wheelchairAccessible: true, count: 16 },
        { location: 'Gate D West concourse, behind Row J', genderNeutral: false, wheelchairAccessible: false, count: 12 },
        { location: 'Club House Stand, Level 1', genderNeutral: false, wheelchairAccessible: true, count: 10 },
      ],
      transport: {
        metro: 'Esplanade Metro Station (1 km walk) or Maidan Metro Station (800m walk)',
        bus: 'Buses stop at "Eden Gardens" bus stop on Strand Road',
        parking: ['Maidan P1: North lot off B.B.D. Bagh (limited)', 'Maidan P2: East lot (restricted on match days)', 'Maidan P3: West overflow lot near Queens Way'],
        taxi: 'Ola/Uber pick-up designated at Gate D west exit',
      },
      medicalAid: [
        { location: 'Gate A, behind Section B-5', services: 'First aid, ambulance on standby' },
        { location: 'Pavilion south side', services: 'Medical room with doctor on duty' },
      ],
      dos_and_donts: {
        allowed: ['Sealed water bottles up to 500ml', 'Hats and caps', 'Raincoats', 'Small handbags (checked at entry)'],
        notAllowed: ['Outside food', 'Alcohol', 'Flag poles', 'Glass items', 'Laser pointers', 'Professional cameras'],
      },
      crowdTips: [
        'Arrive at least 90 minutes early as queues at Gate A (Main gate) are extremely long on match days.',
        'Gate D is historically less crowded for entry.',
        'During rain breaks, the covered Pavilion and B Block areas fill quickly — stay in your seat.',
        'Biryani at Mughal Corner runs out fast — order within the first 30 minutes of the match.',
      ],
    }),
  },

  {
    venueName: 'Wankhede Stadium, Mumbai',
    sport: 'Cricket',
    structuredData: JSON.stringify({
      overview: {
        fullName: 'Wankhede Stadium',
        city: 'Mumbai, Maharashtra',
        capacity: 33108,
        opened: 1975,
        surface: 'Natural grass',
        description: 'Home of Mumbai cricket and the venue of the 2011 World Cup final. Located in South Mumbai near Marine Drive.',
      },
      gates: [
        { id: 'D', name: 'Gate D (North / Main)', location: 'Vinoo Mankad Road, north end', nearbyParking: 'MCA Parking', stands: ['North Stand', 'Sunil Gavaskar Stand'], wheelchair: true },
        { id: 'A', name: 'Gate A (VIP / Media)', location: 'West side near Churchgate', nearbyParking: 'VIP Lot', stands: ['Sachin Tendulkar Stand', 'Members Pavilion', 'Vijay Merchant Stand'], wheelchair: true },
        { id: 'B', name: 'Gate B (South)', location: 'South end', nearbyParking: 'Street parking only', stands: ['Divecha Stand', 'Garware Pavilion'], wheelchair: false },
      ],
      stands: [
        { name: 'Sunil Gavaskar Stand', level: 'North', capacity: 6000, features: 'Head-on view from north side.' },
        { name: 'Sachin Tendulkar Stand', level: 'West', capacity: 8000, features: 'Side-on angle, best view for slip fielders.' },
        { name: 'Vijay Merchant Stand', level: 'East', capacity: 7000, features: 'Side-on view from east.' },
        { name: 'Garware Pavilion', level: 'South', capacity: 5000, features: 'Popular with fans, great atmosphere.' },
        { name: 'Divecha Stand', level: 'South Upper', capacity: 4000, features: 'High view from south end.' },
      ],
      foodAndDrinks: [
        { name: 'Wankhede Café', location: 'Gate D concourse near turnstiles', type: 'Café', items: ['Cutting Chai', 'Vada Pav', 'Poha', 'Sandwiches', 'Cold Drinks'], timing: 'Opens 2 hours before match' },
        { name: 'Tandoor Express', location: 'Gavaskar Stand Concourse Level 1', type: 'Food Counter', items: ['Paneer Tikka Roll', 'Chicken Burger', 'Dhokla', 'Lassi', 'Pepsi'], timing: 'Opens 1 hour before match' },
        { name: 'Snack Box', location: 'Gate B inner concourse near Garware', type: 'Snack Counter', items: ['Bhelpuri', 'Pani Puri', 'Chips', 'Ice Cream'], timing: 'Opens at commencement of play' },
        { name: 'Hydration Point', location: 'Every stand exit stairwell', type: 'Water Point', items: ['Free RO drinking water'], timing: 'Always open' },
      ],
      restrooms: [
        { location: 'Gate D, behind North Stand Row 5', genderNeutral: false, wheelchairAccessible: true, count: 12 },
        { location: 'Gate B near Garware Pavilion entry', genderNeutral: false, wheelchairAccessible: false, count: 10 },
        { location: 'Sachin Tendulkar Stand, Level 2 exit corridor', genderNeutral: false, wheelchairAccessible: true, count: 8 },
      ],
      transport: {
        metro: 'Churchgate Railway Station (Western Railway) — 10-minute walk from Gate A',
        bus: 'BEST Bus Stand "Wankhede Stadium" stop on Marine Drive',
        parking: ['MCA Parking Lot behind Gate D (very limited, ~100 cars)', 'Public parking at Churchgate Station lot (15 min walk)'],
        taxi: 'Ola/Uber: Drop-off at Marine Drive end (Gate A approach). Pick-up from Churchgate Station post-match.',
      },
      medicalAid: [
        { location: 'Gate D, ground floor first-aid room', services: 'Paramedics, first aid' },
        { location: 'Gavaskar Stand Level 1', services: 'First aid kit station' },
      ],
      dos_and_donts: {
        allowed: ['Sealed water bottles up to 500ml', 'Raincoats', 'Children with valid tickets'],
        notAllowed: ['Outside food', 'Alcohol', 'E-cigarettes', 'Flag poles above 1m', 'Professional cameras', 'Glass bottles'],
      },
      crowdTips: [
        'Wankhede has limited parking — strongly recommended to use Churchgate Station and walk.',
        'The stadium fills extremely fast for IPL and India matches; arrive at least 2 hours before start.',
        'Gate A is VIP only — ensure you have the correct ticket before queuing.',
        'Vada Pav at the Wankhede Café is legendary and sells out within the first 30 minutes of the match.',
      ],
    }),
  },

  {
    venueName: 'M. Chinnaswamy Stadium, Bengaluru',
    sport: 'Cricket',
    structuredData: JSON.stringify({
      overview: {
        fullName: 'M. Chinnaswamy Stadium',
        city: 'Bengaluru, Karnataka',
        capacity: 40000,
        opened: 1969,
        surface: 'Natural grass',
        description: 'One of India\'s premier cricket venues, known for its flat pitch and batsman-friendly surface. Located in the heart of Bengaluru.',
      },
      gates: [
        { id: 'Gate-1', name: 'Gate 1 (East / Main)', location: 'Cubbon Park Road, east side', nearbyParking: 'P1 East', stands: ['East Stand Lower', 'East Stand Upper'], wheelchair: true },
        { id: 'Gate-2', name: 'Gate 2 (VIP / Pavilion)', location: 'North side, Pavilion Road', nearbyParking: 'VIP Lot', stands: ['Pavilion Stand', 'KSCA President Stand'], wheelchair: true },
        { id: 'Gate-3', name: 'Gate 3 (West / General)', location: 'West side', nearbyParking: 'P2 West', stands: ['West Stand', 'South-West Terrace'], wheelchair: false },
      ],
      stands: [
        { name: 'East Stand Lower', level: 'East Ground Level', capacity: 8000, features: 'Side-on view from the east.' },
        { name: 'East Stand Upper', level: 'East Upper Tier', capacity: 7000, features: 'Elevated side-on view.' },
        { name: 'Pavilion Stand', level: 'North', capacity: 5000, features: 'Traditional covered members area, central view.' },
        { name: 'West Stand', level: 'West', capacity: 9000, features: 'Popular general stand, lively atmosphere.' },
        { name: 'South-West Terrace', level: 'South-West', capacity: 7000, features: 'Behind-bowler angle with steep terrace seating.' },
      ],
      foodAndDrinks: [
        { name: 'Bengaluru Bites', location: 'Gate 1 east concourse', type: 'Food Counter', items: ['Masala Dosa', 'Idli Vada', 'Filter Coffee', 'Cold Drinks'], timing: 'Opens 2 hours before match' },
        { name: 'IPL Fan Zone Food Hub', location: 'West Stand concourse outer ring', type: 'Food Court', items: ['Pizza', 'Burger', 'Fries', 'Momos', 'Biryani', 'Pepsi'], timing: 'Opens 1 hour before match' },
        { name: 'Chai Corner', location: 'North pavilion lobby', type: 'Snack Corner', items: ['Tea', 'Coffee', 'Biscuits', 'Banana'], timing: 'Members/VIP area only' },
        { name: 'Free Drinking Water', location: 'All concourse exits', type: 'Water Point', items: ['Drinking water'], timing: 'Always open' },
      ],
      restrooms: [
        { location: 'Gate 1 East, Level 1 and Level 2', genderNeutral: false, wheelchairAccessible: true, count: 14 },
        { location: 'West Stand, central concourse behind Row G', genderNeutral: false, wheelchairAccessible: false, count: 12 },
        { location: 'Pavilion Stand lobby', genderNeutral: false, wheelchairAccessible: true, count: 6 },
      ],
      transport: {
        metro: 'Cubbon Park Metro Station (Purple Line) — 7-minute walk from Gate 1',
        bus: 'BMTC Bus stop at "Chinnaswamy Stadium" on MG Road',
        parking: ['P1 East: Limited 200 cars off Cubbon Park Road', 'P2 West: 150 cars, highly congested on match days'],
        taxi: 'Drop-off at Cubbon Park Road Gate 1 approach. Post-match pick-up from MG Road.',
      },
      medicalAid: [
        { location: 'Gate 1 inner concourse, east side', services: 'First aid, AED defibrillator' },
        { location: 'West Stand, behind section W-7', services: 'Paramedic team, first aid' },
      ],
      dos_and_donts: {
        allowed: ['Small sealed water bottles', 'Hats and caps', 'Light raincoats'],
        notAllowed: ['Outside food', 'Alcohol', 'Selfie sticks', 'Large bags', 'Professional cameras with zoom lens'],
      },
      crowdTips: [
        'Use the Cubbon Park Metro to avoid traffic — parking is extremely scarce.',
        'IPL matches here sell out fast, double-check your ticket block number against the gate map.',
        'Masala Dosa at Bengaluru Bites is the crowd favourite — queues form 30 minutes before opening.',
        'The West Stand is notoriously lively and rowdy during IPL — ideal for intense fan experience, challenging if you prefer quiet.',
      ],
    }),
  },

  {
    venueName: 'M. A. Chidambaram Stadium, Chennai',
    sport: 'Cricket',
    structuredData: JSON.stringify({
      overview: {
        fullName: 'M. A. Chidambaram Stadium (Chepauk)',
        city: 'Chennai, Tamil Nadu',
        capacity: 50000,
        opened: 1916,
        surface: 'Natural grass',
        description: 'One of India\'s oldest cricket grounds, home to the Chennai Super Kings in IPL and the Tamil Nadu team. Known for the passionate Yellow Army fanbase.',
      },
      gates: [
        { id: 'Gate-A', name: 'Gate A (Pavilion / VIP)', location: 'Anna Salai (Mount Road) north-west side', nearbyParking: 'VIP Lot', stands: ['Pavilion Stand', 'Ladies Stand', 'Press Box'], wheelchair: true },
        { id: 'Gate-B', name: 'Gate B (North / General)', location: 'North side near Wallajah Road', nearbyParking: 'P1', stands: ['Anna Stand', 'Karunanidhi Stand'], wheelchair: true },
        { id: 'Gate-C', name: 'Gate C (South / General)', location: 'South side off Cathedral Road', nearbyParking: 'P2', stands: ['Tiruvalluvar Stand', 'Periyar Stand'], wheelchair: false },
        { id: 'Gate-D', name: 'Gate D (East)', location: 'East end near Alwarpet', nearbyParking: 'P3', stands: ['Rajaji Stand', 'Kamraj Stand'], wheelchair: false },
      ],
      stands: [
        { name: 'Pavilion Stand', level: 'West (Members)', capacity: 4000, features: 'Covered, best central view, traditional teak seating.' },
        { name: 'Anna Stand', level: 'North', capacity: 10000, features: 'Known for the loudest CSK fans, head-on view from north.' },
        { name: 'Karunanidhi Stand', level: 'North Upper', capacity: 9000, features: 'Elevated north view.' },
        { name: 'Tiruvalluvar Stand', level: 'South', capacity: 11000, features: 'Lively CSK ultras section.' },
        { name: 'Rajaji Stand', level: 'East', capacity: 8000, features: 'Side-on east view.' },
        { name: 'Kamraj Stand', level: 'East Upper', capacity: 7000, features: 'Higher angled east view.' },
      ],
      foodAndDrinks: [
        { name: 'Chennai Mess', location: 'Gate B North Concourse', type: 'Food Counter', items: ['Curd Rice', 'Sambar Vada', 'Pongal', 'Filter Coffee', 'Tender Coconut'], timing: 'Opens 90 minutes before match' },
        { name: 'Fan Zone Snack Bar', location: 'Gate C South inner ring', type: 'Snack Bar', items: ['Murukku', 'Sundal', 'Cold Drinks', 'Popcorn', 'Ice Cream'], timing: 'Opens at match start' },
        { name: 'Madurai Biryani Point', location: 'Gate D East Concourse Level 1', type: 'Food Stall', items: ['Biryani', 'Parotta', 'Salna', 'Lassi'], timing: 'Opens 1 hour before match' },
        { name: 'VIP Lounge Pantry', location: 'Pavilion west lobby (Gate A only)', type: 'Member Pantry', items: ['South Indian Thali', 'Fresh Juices', 'Desserts'], timing: 'Members/VIP only' },
        { name: 'Water Kiosks', location: 'All four gate concourses', type: 'Water Point', items: ['Sealed drinking water available for Rs 20'], timing: 'Always open' },
      ],
      restrooms: [
        { location: 'Gate B, Level 1 and Level 2 (Anna Stand)', genderNeutral: false, wheelchairAccessible: true, count: 18 },
        { location: 'Gate C South inner concourse', genderNeutral: false, wheelchairAccessible: false, count: 14 },
        { location: 'Gate D East concourse behind Row F', genderNeutral: false, wheelchairAccessible: false, count: 10 },
        { location: 'Pavilion Stand lobby (Gate A — members only)', genderNeutral: false, wheelchairAccessible: true, count: 6 },
      ],
      transport: {
        metro: 'Chennai Metro not directly adjacent; nearest station is LIC Metro (1.5 km walk)',
        bus: 'MTC Bus stops at "Chepauk" on Anna Salai (Mount Road)',
        parking: ['P1: North lot off Wallajah Road (very limited)', 'P2: South overflow near Cathedral Road (limited)', 'P3: East near Rajaji Bhavan (further, 10-min walk)'],
        suburban: 'Chepauk suburban railway station (southern railway) — 5-minute walk from Gate C',
        taxi: 'Ola/Uber: Drop-off on Anna Salai (Gate A/B). Post-match pick-up is congested — walk to Marina Beach Road for better pickup',
      },
      medicalAid: [
        { location: 'Gate B, North Stand inner lobby', services: 'First aid, paramedic on duty' },
        { location: 'Gate C South concourse', services: 'First aid station, AED' },
      ],
      dos_and_donts: {
        allowed: ['Sealed water up to 500ml', 'Caps', 'Raincoats', 'Vuvuzelas (within limits)', 'Children with valid ticket'],
        notAllowed: ['Outside food', 'Alcohol', 'Glass items', 'Selfie sticks', 'Large bags', 'Professional cameras'],
      },
      crowdTips: [
        'Chepauk fills completely for CSK IPL matches — arrive 2 hours before gates open.',
        'The Tiruvalluvar and Anna stands are the loudest; avoid them if noise is a concern.',
        'Chennai Mess filter coffee is a must — it sells out by the 10th over.',
        'Suburban train from Chepauk station is the fastest post-match exit option.',
        'Heavy traffic on Anna Salai on match days — strongly prefer rail/bus.',
      ],
    }),
  },

  // ════════════════════════════════════════════════════════
  //  TNPL VENUES
  // ════════════════════════════════════════════════════════
  {
    venueName: 'MA Chidambaram Stadium, Chennai',
    sport: 'TNPL',
    structuredData: JSON.stringify({
      overview: {
        fullName: 'M. A. Chidambaram Stadium (Chepauk) — TNPL Edition',
        city: 'Chennai, Tamil Nadu',
        capacity: 50000,
        description: 'Hosts TNPL playoffs and finals. Same iconic Chepauk ground used for IPL and Tests, re-dressed with TNPL branding.',
      },
      gates: [
        { id: 'Gate-A', name: 'Gate A (Pavilion / Officials)', location: 'Anna Salai north-west', nearbyParking: 'VIP Lot', stands: ['Pavilion', 'Officials Box'], wheelchair: true },
        { id: 'Gate-B', name: 'Gate B (North General)', location: 'North side, Wallajah Road', nearbyParking: 'P1', stands: ['Anna Stand', 'Karunanidhi Stand'], wheelchair: true },
        { id: 'Gate-C', name: 'Gate C (South General)', location: 'South, Cathedral Road', nearbyParking: 'P2', stands: ['Tiruvalluvar Stand', 'Periyar Stand'], wheelchair: false },
      ],
      foodAndDrinks: [
        { name: 'TNPL Fan Mess', location: 'Gate B concourse', type: 'Food Counter', items: ['Curd Rice', 'Sambar Rice', 'Filter Coffee', 'Tender Coconut Water', 'Murukku'], timing: 'Opens 90 mins before match' },
        { name: 'Snack Zone', location: 'Gate C inner ring', type: 'Snack Bar', items: ['Cold Drinks', 'Popcorn', 'Sundal', 'Ice Cream'], timing: 'Opens at toss time' },
        { name: 'Water Point', location: 'All gate concourses', type: 'Water Point', items: ['Potable water Rs 15/bottle'], timing: 'Always available' },
      ],
      restrooms: [
        { location: 'Gate B Level 1', genderNeutral: false, wheelchairAccessible: true, count: 14 },
        { location: 'Gate C inner ring', genderNeutral: false, wheelchairAccessible: false, count: 10 },
      ],
      transport: {
        suburban: 'Chepauk suburban station — 5-min walk from Gate C',
        bus: 'MTC bus "Chepauk" stop on Anna Salai',
        taxi: 'Drop-off Anna Salai Gate A/B. Post-match use Marina Beach Road for Ola/Uber pickup.',
      },
      crowdTips: [
        'TNPL crowds are generally smaller than IPL — gates open 1 hour before match, no need to rush.',
        'Filter coffee at the TNPL Fan Mess is a must-try.',
        'Parking is still very limited — prefer suburban train or ride-share.',
      ],
    }),
  },

  {
    venueName: 'SCF Cricket Ground, Salem',
    sport: 'TNPL',
    structuredData: JSON.stringify({
      overview: {
        fullName: 'Salem Cricket Foundation Cricket Ground',
        city: 'Salem, Tamil Nadu',
        capacity: 12000,
        description: 'A well-maintained ground used for TNPL league stage matches. Known for its intimate atmosphere and vocal local crowd.',
      },
      gates: [
        { id: 'Gate-1', name: 'Gate 1 (Main North)', location: 'Beside SCF office, north entrance', nearbyParking: 'Outer Ground lot', stands: ['North Stand', 'VIP Box'], wheelchair: true },
        { id: 'Gate-2', name: 'Gate 2 (South General)', location: 'South side, road entry', nearbyParking: 'Street parking', stands: ['South Stand', 'East Terrace'], wheelchair: false },
      ],
      foodAndDrinks: [
        { name: 'Salem Snack Corner', location: 'Gate 1 inner concourse', type: 'Food Counter', items: ['Biryani', 'Parotta Salna', 'Filter Coffee', 'Cold Drinks', 'Ice Cream'], timing: 'Opens 60 mins before match' },
        { name: 'Tender Coconut Stall', location: 'Outside Gate 2', type: 'Refreshment', items: ['Tender Coconut Water (Rs 40)'], timing: 'Opens from afternoon' },
        { name: 'Water Point', location: 'Both gates', type: 'Water Point', items: ['Free drinking water'], timing: 'Always open' },
      ],
      restrooms: [
        { location: 'Gate 1, behind VIP Box', genderNeutral: false, wheelchairAccessible: true, count: 6 },
        { location: 'Gate 2, South Stand corridor', genderNeutral: false, wheelchairAccessible: false, count: 4 },
      ],
      transport: {
        bus: 'City bus stop "SCF Ground" on Omalur Main Road',
        taxi: 'Auto-rickshaws available near Gate 1. No dedicated Ola zone — book from nearby Omalur Road.',
        parking: ['Outer Ground lot: ~200 vehicles', 'Street parking on Omalur Main Road (limited)'],
      },
      crowdTips: [
        'Arrive 45 minutes early — gates can have short but slow queues due to manual checking.',
        'Salem Biryani at the snack corner is legendary locally — order early.',
        'South Stand is in direct afternoon sun during day matches — carry a cap and sunscreen.',
      ],
    }),
  },

  // ════════════════════════════════════════════════════════
  //  ISL FOOTBALL VENUES
  // ════════════════════════════════════════════════════════
  {
    venueName: 'Jawaharlal Nehru Stadium, Kochi',
    sport: 'ISL Football',
    structuredData: JSON.stringify({
      overview: {
        fullName: 'Jawaharlal Nehru Stadium, Kochi',
        city: 'Kochi, Kerala',
        capacity: 60000,
        opened: 1996,
        surface: 'Natural grass',
        description: 'Home of Kerala Blasters FC in ISL. One of the most atmospheric football venues in India, known for the passionate "Yellow Wall" fan base.',
      },
      gates: [
        { id: 'Gate-1', name: 'Gate 1 (Main / East)', location: 'NH 66 east side, near Jawaharlal Nehru International Stadium Road', nearbyParking: 'P1 East', stands: ['East Lower', 'East Upper', 'Press Box'], wheelchair: true },
        { id: 'Gate-2', name: 'Gate 2 (Yellow Wall / South)', location: 'South side near Kaloor Junction', nearbyParking: 'P2 South', stands: ['South Stand (Yellow Wall)', 'South Upper (Away Fan Zone — away matches only)'], wheelchair: true },
        { id: 'Gate-3', name: 'Gate 3 (VIP / West)', location: 'West side, VIP entrance', nearbyParking: 'VIP Lot', stands: ['VIP Box', 'Club Lounge', 'West Stand'], wheelchair: true },
        { id: 'Gate-4', name: 'Gate 4 (North)', location: 'North end near flyover', nearbyParking: 'P3 North', stands: ['North Stand'], wheelchair: false },
      ],
      stands: [
        { name: 'South Stand (Yellow Wall)', level: 'South', capacity: 15000, features: 'Hardcore Kerala Blasters ultras, extremely loud, standing only. Not for faint-hearted.' },
        { name: 'East Lower', level: 'East Ground Level', capacity: 14000, features: 'Side-on view of pitch, seated, family-friendly.' },
        { name: 'East Upper', level: 'East Upper Tier', capacity: 12000, features: 'Elevated panoramic side-on view.' },
        { name: 'North Stand', level: 'North', capacity: 8000, features: 'Head-on view from north end.' },
        { name: 'West Stand', level: 'West', capacity: 8000, features: 'Side-on view, good atmosphere.' },
        { name: 'VIP Box', level: 'West Level 2', capacity: 500, features: 'Covered, padded seating, in-seat catering service.' },
      ],
      foodAndDrinks: [
        { name: 'Kerala Kitchen', location: 'Gate 1 East Concourse Level 1', type: 'Food Court', items: ['Fish Biryani', 'Chicken Curry Rice', 'Parotta', 'Kadala Curry', 'Tender Coconut', 'Chai'], timing: 'Opens 2 hours before kick-off' },
        { name: 'Fan Zone BBQ', location: 'Gate 2 outer plaza near Yellow Wall entry', type: 'BBQ Stall', items: ['Grilled Chicken Wings', 'Shawarma', 'Cold Drinks', 'Energy Drinks'], timing: 'Opens 90 mins before kick-off' },
        { name: 'North Snack Bar', location: 'Gate 4 inner concourse', type: 'Snack Counter', items: ['Burger', 'Fries', 'Hot Dog', 'Pepsi'], timing: 'Opens 90 mins before kick-off' },
        { name: 'VIP Lounge Bar', location: 'West Level 2 VIP Box lobby (VIP ticket required)', type: 'Fine Dining', items: ['Full buffet', 'Premium drinks', 'Live cooking station'], timing: 'VIP ticket holders only' },
        { name: 'Water Stations', location: 'All gate concourses inner ring', type: 'Water Point', items: ['Free water', 'Bottled water Rs 20'], timing: 'Always open' },
      ],
      restrooms: [
        { location: 'Gate 1 East, Level 1 and Level 2', genderNeutral: false, wheelchairAccessible: true, count: 20 },
        { location: 'Gate 2 South (Yellow Wall entry)', genderNeutral: false, wheelchairAccessible: true, count: 16 },
        { location: 'Gate 4 North inner concourse', genderNeutral: false, wheelchairAccessible: false, count: 10 },
        { location: 'VIP wing West Level 2', genderNeutral: false, wheelchairAccessible: true, count: 6 },
      ],
      transport: {
        bus: 'KSRTC and city bus stop at "Kaloor Stadium" junction — 5-minute walk from Gate 2',
        taxi: 'Ola/Uber drop-off: Gate 1 approach road. Post-match: major congestion; recommended to walk to NH-66 for pickup.',
        parking: ['P1 East: 800 cars near Gate 1', 'P2 South: 600 cars near Gate 2', 'P3 North: 400 cars, 10-min walk from Gate 4', 'VIP Lot: 100 cars, Gate 3 only'],
        metro: 'Kochi Metro: Maharaja\'s College station (2 km, 20-min walk or 5-min auto)',
      },
      medicalAid: [
        { location: 'Gate 1 East, ground floor first-aid room', services: 'Paramedic, first aid, AED' },
        { location: 'Gate 2 South inner ring, near Section S-4', services: 'First aid, ambulance standby on match days' },
      ],
      dos_and_donts: {
        allowed: ['Sealed water up to 1L', 'Club scarves and flags (legal size)', 'Drums and percussion (South Stand only — with marshal approval)', 'Raincoats', 'Children with valid ticket'],
        notAllowed: ['Flares/fireworks', 'Glass bottles', 'Alcohol', 'Selfie sticks/poles', 'Away fan colors in Yellow Wall (South Stand)', 'Professional cameras without media pass'],
      },
      crowdTips: [
        'South Stand (Yellow Wall) sells out first — book well in advance for home fixtures.',
        'Use Gate 1 for family-friendly entry; Gate 2 is the ultra zone and extremely crowded.',
        'Fish Biryani at Kerala Kitchen is worth every rupee — queues form 45 mins before kick-off.',
        'Post-match: exit via Gate 4 north side first — least congested. Gate 2 exits take 20+ minutes on sold-out nights.',
        'Kochi weather can be unpredictable — a light raincoat is always smart.',
      ],
    }),
  },

  // ════════════════════════════════════════════════════════
  //  PRO KABADDI VENUES
  // ════════════════════════════════════════════════════════
  {
    venueName: 'Gachibowli Indoor Stadium, Hyderabad',
    sport: 'Pro Kabaddi',
    structuredData: JSON.stringify({
      overview: {
        fullName: 'Gachibowli Indoor Stadium',
        city: 'Hyderabad, Telangana',
        capacity: 5000,
        opened: 2003,
        surface: 'Synthetic mat (kabaddi specification)',
        description: 'State-of-the-art indoor stadium hosting Pro Kabaddi League matches for Telugу Titans. Fully air-conditioned.',
      },
      gates: [
        { id: 'Main-Gate', name: 'Main Entry Gate', location: 'Gachibowli Stadium Road, south side', nearbyParking: 'Stadium Lot A', stands: ['East Grandstand', 'West Grandstand', 'VIP Box'], wheelchair: true },
        { id: 'Side-Gate', name: 'Side Entry Gate (Players/Media)', location: 'West end, players tunnel side', nearbyParking: 'Reserved', stands: ['Press Box', 'Courtside Seats'], wheelchair: false },
      ],
      stands: [
        { name: 'East Grandstand', level: 'East', capacity: 1800, features: 'Great head-on view of the kabaddi mat.' },
        { name: 'West Grandstand', level: 'West', capacity: 1800, features: 'Head-on view from west, close to players tunnel.' },
        { name: 'VIP Box', level: 'Elevated West', capacity: 200, features: 'Air-conditioned premium box, best sightlines.' },
        { name: 'Courtside Seats', level: 'Mat Level', capacity: 100, features: 'Media and officials only, right next to the mat.' },
      ],
      foodAndDrinks: [
        { name: 'Hyderabadi Bites', location: 'Main gate lobby, left side', type: 'Snack Counter', items: ['Samosa', 'Mirchi Bajji', 'Cold Drinks', 'Hot Tea', 'Biryani Box'], timing: 'Opens 60 mins before match' },
        { name: 'Refreshment Kiosk', location: 'East Grandstand mid-aisle exit', type: 'Kiosk', items: ['Chips', 'Biscuits', 'Water', 'Energy Drinks', 'Ice Cream'], timing: 'Opens at match start' },
      ],
      restrooms: [
        { location: 'Main Gate lobby, east corridor', genderNeutral: false, wheelchairAccessible: true, count: 8 },
        { location: 'West Grandstand exit staircase landing', genderNeutral: false, wheelchairAccessible: false, count: 6 },
      ],
      transport: {
        bus: 'TSRTC bus to "Gachibowli" from Hitech City or MGBS',
        taxi: 'Ola/Uber: Drop at Stadium Road Gate. Post-match pickup easily available on Stadium Rd',
        parking: ['Stadium Lot A: 500 cars (main lot, fill fast)', 'Overflow: HITEC City Parking Area (10-min walk or shuttle)'],
        metro: 'No direct Metro; nearest MMTS station Lingampally (3.5 km away)',
      },
      medicalAid: [
        { location: 'Main Gate lobby, first-aid desk', services: 'First aid, paramedic on duty' },
      ],
      dos_and_donts: {
        allowed: ['Sealed water bottles up to 500ml', 'Horns and clappers (not vuvuzelas)', 'Banners up to 1m x1m'],
        notAllowed: ['Outside food', 'Alcohol', 'Flash photography during mat action', 'Noisemakers in VIP zone'],
      },
      crowdTips: [
        'Indoor stadium — highly air-conditioned. Carry a light jacket even in summer.',
        'Capacity is small; tickets sell out quickly, especially for playoff matches.',
        'Mirchi Bajji at Hyderabadi Bites is a local favourite — get it during the half-time break.',
        'Parking on Stadium Road fills within the first hour before match; arrive early or use ride-hailing.',
      ],
    }),
  },

  // ════════════════════════════════════════════════════════
  //  CONCERT VENUES
  // ════════════════════════════════════════════════════════
  {
    venueName: 'DY Patil Stadium, Navi Mumbai',
    sport: 'Concerts',
    structuredData: JSON.stringify({
      overview: {
        fullName: 'DY Patil Sports Stadium',
        city: 'Navi Mumbai, Maharashtra',
        capacity: 55000,
        opened: 2008,
        surface: 'Natural grass (converted to flat floor for concerts)',
        description: 'Premier outdoor concert venue in the Mumbai Metropolitan Region. Hosted major artists including Coldplay, Ed Sheeran, and Dua Lipa. Fully covered stadium with excellent acoustics.',
      },
      gates: [
        { id: 'Gate-1', name: 'Gate 1 (North / Main)', location: 'North approach road off Nerul Flyover', nearbyParking: 'P1 North (5000 cars)', stands: ['General Admission Pit (Floor)', 'North Grandstand', 'VIP Lounge'], wheelchair: true },
        { id: 'Gate-2', name: 'Gate 2 (South)', location: 'South access road from Palm Beach Marg', nearbyParking: 'P2 South (3000 cars)', stands: ['South Grandstand', 'East Bleachers'], wheelchair: true },
        { id: 'Gate-3', name: 'Gate 3 (VIP / Platinum)', location: 'West wing, VIP entrance off main Boulevard', nearbyParking: 'VIP reserved lot', stands: ['Platinum Lounge', 'VIP Floor Barricade', 'Executive Suite'], wheelchair: true },
      ],
      stands: [
        { name: 'General Admission Pit (Floor)', level: 'Ground Floor', capacity: 20000, features: 'Standing, closest to stage. High energy zone. No seats.' },
        { name: 'North Grandstand', level: 'North Tiered', capacity: 12000, features: 'Elevated seated view of the stage, covered.' },
        { name: 'South Grandstand', level: 'South Tiered', capacity: 12000, features: 'Elevated seated view from behind mixing desk.' },
        { name: 'East Bleachers', level: 'East Side', capacity: 6000, features: 'Side angle view, affordable seats.' },
        { name: 'Platinum Lounge', level: 'West Wing, Level 2', capacity: 1000, features: 'Air-conditioned, premium buffet included, best sightlines.' },
        { name: 'VIP Floor Barricade', level: 'Stage Barricade, Floor Level', capacity: 500, features: 'Right at the front. Very close to stage. Standing.' },
      ],
      foodAndDrinks: [
        { name: 'Mumbai Street Food Zone', location: 'Gate 1 outer plaza, North concourse', type: 'Food Court', items: ['Vada Pav', 'Pav Bhaji', 'Pani Puri', 'Bhelpuri', 'Cold Drinks', 'Lassi'], timing: 'Opens 3 hours before show' },
        { name: 'Global Bites', location: 'South Grandstand Level 1 walkway', type: 'Food Counter', items: ['Pizza', 'Burger', 'Nachos', 'Hot Dogs', 'Fries', 'Coffee'], timing: 'Opens 2 hours before show' },
        { name: 'Bar & Grill Zone', location: 'Gate 1 east ring (21+ only, ID required)', type: 'Licensed Bar', items: ['Beer', 'Wi Spirits', 'Cocktails', 'Mocktails', 'Grilled snacks'], timing: 'Opens 2 hours before, closes 30 mins before show end' },
        { name: 'Platinum Buffet', location: 'West Wing Platinum Lounge (ticket required)', type: 'Buffet', items: ['Multi-cuisine live counter', 'Dessert bar', 'Premium bar'], timing: 'Opens 3 hours before show, continuous during show' },
        { name: 'Water Stations', location: 'All gates and floor pit access points', type: 'Water Point', items: ['Free water refill stations'], timing: 'Always available during event' },
      ],
      restrooms: [
        { location: 'Gate 1 North outer plaza and inner concourse', genderNeutral: true, wheelchairAccessible: true, count: 30 },
        { location: 'Gate 2 South inner ring, Level 1', genderNeutral: true, wheelchairAccessible: true, count: 24 },
        { location: 'Floor Pit, near east and west walls (temporary units)', genderNeutral: true, wheelchairAccessible: false, count: 20 },
        { location: 'Platinum Lounge West Wing Level 2', genderNeutral: true, wheelchairAccessible: true, count: 8 },
      ],
      transport: {
        metro: 'No direct metro connectivity currently. Nearest Navi Mumbai Metro station is under construction.',
        suburban: 'Nerul Station (Central/Harbour Line) — 15-min walk or 5-min auto from Gate 1',
        bus: 'NMMT buses to "DY Patil Stadium" from Belapur and Vashi',
        parking: ['P1 North: 5000 cars, recommended for Gate 1 entry', 'P2 South: 3000 cars, recommended for Gate 2 entry', 'VIP Reserved: 200 cars, Gate 3 only'],
        taxi: 'Ola/Uber: Drop-off at North Gate 1 boulevard. Post-show pickup — extreme congestion near gates; designated pickup zone on Palm Beach Road, 400m walk from Gate 2.',
      },
      medicalAid: [
        { location: 'Gate 1 North inner concourse, first-aid room', services: 'EMT team, AED, ambulance standby' },
        { location: 'Floor Pit, centre-rear medical station', services: 'Paramedics dedicated for floor crowd crushing emergencies' },
        { location: 'Gate 2 South concourse', services: 'First aid station' },
      ],
      dos_and_donts: {
        allowed: ['Sealed water bottles up to 1L', 'Light jacket (it can get cold indoors during shows)', 'Merchandise purchased outside (sealed/bagged)', 'Valid ID for bar zone (21+)', 'Earplugs', 'Raincoats for outdoor zones'],
        notAllowed: ['Professional cameras (DSLR with zoom)', 'Go Pro or action cameras on mounts', 'Selfie sticks', 'Alcohol from outside', 'Fireworks/sparklers', 'Flags or crowd surfing paraphernalia'],
      },
      crowdTips: [
        'Floor Pit fills up 2 hours before show — arrive early if you want front-of-stage position.',
        'Post-show exit via south Gate 2 is fastest; north Gate 1 is most congested.',
        'Nerul suburban station train is the best post-show option — avoid ride-share surge pricing for at least 60 minutes.',
        'The Bar & Grill Zone closes early — if you want a drink, get it before the headliner starts.',
        'Bring a light jacket even in summer; the standing floor area gets cold with air circulation at capacity.',
        'Earplugs are strongly recommended for floor pit positions; sound levels can exceed 110dB at DY Patil.',
      ],
    }),
  },

  {
    venueName: 'Jio World Garden, BKC Mumbai',
    sport: 'Concerts',
    structuredData: JSON.stringify({
      overview: {
        fullName: 'Jio World Convention Centre — Garden & Exhibition Grounds, BKC',
        city: 'Mumbai, Maharashtra (Bandra-Kurla Complex)',
        capacity: 60000,
        opened: 2022,
        description: 'Premium open-air concert venue in BKC, Mumbai. Used for high-profile international concerts with state-of-the-art sound and lighting infrastructure. Modular layout changes per event.',
      },
      gates: [
        { id: 'Gate-A', name: 'Gate A (Main BKC Entry)', location: 'G Block BKC, Bandra Kurla Complex, near Jio World Drive Mall', nearbyParking: 'BKC Parking P1', stands: ['General Lawn', 'VIP Lounge Zone'], wheelchair: true },
        { id: 'Gate-B', name: 'Gate B (East Approach)', location: 'East side off C.S.T. Road, near MMRDA Grounds', nearbyParking: 'MMRDA Lot', stands: ['East Grandstand (if applicable)', 'General Admission'], wheelchair: true },
        { id: 'Gate-C', name: 'Gate C (Premium / Platinum)', location: 'North access near Jio World Convention Centre drop-off', nearbyParking: 'Premium Valet', stands: ['Platinum Zone', 'Premium Floor'], wheelchair: true },
      ],
      stands: [
        { name: 'General Lawn', level: 'Open Grounds Zone B', capacity: 30000, features: 'Open-air, standing/lawn sitting. Light atmosphere. Basic view.' },
        { name: 'Floor Standing Area', level: 'Stage Front', capacity: 15000, features: 'Closest to stage, high energy, standing only.' },
        { name: 'VIP Lounge Zone', level: 'Raised Platform, left and right of stage', capacity: 3000, features: 'Exclusive viewing decks, in-zone bar access.' },
        { name: 'Platinum Zone', level: 'Stage Barricade', capacity: 500, features: 'Best sightlines, premium comfort, dedicated staff.' },
      ],
      foodAndDrinks: [
        { name: 'Jio Garden Food Alley', location: 'Right-side perimeter, parallel to Gate A', type: 'Food Court', items: ['Loaded Fries', 'Tacos', 'Burger', 'Pizza', 'Pav Bhaji', 'Biryani', 'Falooda', 'Cold Drinks'], timing: 'Opens 2 hours before show' },
        { name: 'Craft Beer Lounge', location: 'VIP Zone perimeter (wristband verified)', type: 'Licensed Bar', items: ['Craft beers', 'Cocktails', 'Mocktails', 'Wine'], timing: 'Opens 2 hours before show, closes with intermission' },
        { name: 'Hydration Stations', location: 'Distributed every 50m across General Lawn', type: 'Water Point', items: ['Free refillable water'], timing: 'Always open during event' },
      ],
      restrooms: [
        { location: 'Gate A outer plaza and inner grounds', genderNeutral: true, wheelchairAccessible: true, count: 40 },
        { location: 'Gate B east perimeter temporary blocks', genderNeutral: true, wheelchairAccessible: false, count: 30 },
        { location: 'VIP and Platinum Zone dedicated block', genderNeutral: true, wheelchairAccessible: true, count: 12 },
      ],
      transport: {
        metro: 'Bandra-Kurla Complex Metro Station (Metro Line 3) — 5-minute walk from Gate B',
        bus: 'BEST bus routes 302, 313 stop at "BKC" bus stop — 7-minute walk from Gate A',
        parking: ['BKC P1: 1000 cars (near Gate A)', 'MMRDA Overflow Lot: 2000 cars (Gate B side)', 'Premium Valet: Gate C only'],
        taxi: 'Ola/Uber: Drop at BKC Gate A. Post-show: Use BKC Metro for fastest exit. Cars will be heavily congested on CST Road.',
      },
      medicalAid: [
        { location: 'Gate A inner plaza, designated first-aid tent', services: 'EMT, AED, ambulance' },
        { location: 'Lawn Zone, central medical tent (marked with red cross banner)', services: 'Paramedics for heat exhaustion, crowd pressure cases' },
      ],
      dos_and_donts: {
        allowed: ['Sealed water up to 1L', 'Small bags (A4 size)', 'Merch purchased on site', 'Valid ID for bar access (21+)', 'Earplugs', 'Raincoats'],
        notAllowed: ['Professional cameras', 'Drone cameras', 'Outside food or beverages', 'Alcohol from outside', 'Selfie sticks longer than 20cm', 'Glass containers'],
      },
      crowdTips: [
        'Metro Line 3 BKC station is your best bet — Post-show cabs will surge and take 30–60 minutes to arrive.',
        'General Lawn is open-air; night events can get cool — carry a light layer.',
        'Platinum Zone entry is via Gate C only — wrong gate means a long walk.',
        'Food queues thin out during the headliner set — good time to grab something to eat.',
        'Designated water stations are free — skip buying overpriced bottles inside.',
      ],
    }),
  },

];

// ── Seed Logic ─────────────────────────────────────────────────────────────────
async function seed() {
  console.log('🌱 Connecting to ArenaAI database...');
  await mongoose.connect(aiDatabaseUri);
  console.log(`✅ Connected to: ${aiDatabaseUri}`);

  // Build model on default connection for the seed script
  let KnowledgeModel;
  if (mongoose.models['ArenaKnowledge']) {
    KnowledgeModel = mongoose.model('ArenaKnowledge');
  } else {
    KnowledgeModel = mongoose.model('ArenaKnowledge', arenaKnowledgeSchema, 'Knowledge_Base');
  }

  console.log(`\n🗑  Clearing existing Knowledge_Base records...`);
  await KnowledgeModel.deleteMany({});
  console.log('   Cleared.');

  console.log(`\n📥 Inserting ${knowledgeData.length} venue knowledge records...`);
  for (const entry of knowledgeData) {
    await KnowledgeModel.create(entry);
    console.log(`   ✓ Seeded: ${entry.venueName} [${entry.sport}]`);
  }

  console.log(`\n🎉 Knowledge Base seeded successfully with ${knowledgeData.length} venues!`);
  await mongoose.disconnect();
  console.log('🔌 Disconnected. Done.');
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
