const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');
const connectDB = require('./config/db');

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    // Clean start for seeding to avoid duplicate key errors
    await Admin.deleteMany({ 
      $or: [
        { staffId: 'ADM-101' },
        { email: 'admin@arenasync.ai' }
      ]
    });

    console.log('🧹 Cleanup: Prior staff credentials purged.');

    // Create default admin
    // Email: admin@arenasync.ai
    // Password: ArenaSync2026
    await Admin.create({
      staffId: 'ADM-101',
      name: 'Arena Overseer',
      email: 'admin@arenasync.ai',
      password: 'ArenaSync2026',
      accessLevel: 'Overseer'
    });

    console.log('🚀 STAFF CREDENTIALS INITIALIZED');
    console.log('-------------------------------');
    console.log('EMAIL: admin@arenasync.ai');
    console.log('KEY:   ArenaSync2026');
    console.log('-------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedAdmin();
