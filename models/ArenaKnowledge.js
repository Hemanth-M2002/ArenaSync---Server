const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Ensure env variables are accessible
dotenv.config();

// The user specifically requested a completely separate database for AI knowledge to avoid confusion with the main "UserID" database.
const originalUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/UserID';
// Replacing the default DB string with 'ArenaAI' to spin up a standalone database context
const aiDatabaseUri = originalUri.replace('/UserID', '/ArenaAI');

// Create a dedicated connection instance for the AI Database
const aiDbConnection = mongoose.createConnection(aiDatabaseUri);

const arenaKnowledgeSchema = new mongoose.Schema(
  {
    venueName: {
      type: String,
      required: true,
      index: true,
    },
    sport: {
      type: String,
      required: true,
    },
    // This will hold raw JSON data stringified (Food locations, rules, gate layouts)
    // We parse this and feed it to Gemini dynamically.
    structuredData: {
      type: String,
      required: true,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    }
  },
  { timestamps: true }
);

// We bind the model directly to the new Connection rather than the global mongoose instance.
// This forces it to save in the `ArenaAI` database under the `Knowledge_Base` collection.
const ArenaKnowledge = aiDbConnection.model('ArenaKnowledge', arenaKnowledgeSchema, 'Knowledge_Base');

module.exports = ArenaKnowledge;
