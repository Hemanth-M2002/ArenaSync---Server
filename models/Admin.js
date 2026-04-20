const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * Admin Schema for ArenaSync Command Center
 * Stored in a separate isolated collection: 'StaffCards'
 */
const adminSchema = new mongoose.Schema(
  {
    staffId: {
      type: String,
      required: [true, 'Staff ID is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
    },
    accessLevel: {
      type: String,
      enum: ['Moderator', 'Overseer', 'Admin'],
      default: 'Moderator',
    },
    role: {
      type: String,
      default: 'admin',
    },
    lastCommandIssued: {
      type: Date,
      default: Date.now,
    }
  },
  {
    timestamps: true,
    collection: 'StaffCards', // Isolated collection
  }
);

// Hash password before saving
adminSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
adminSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;
