require('dotenv').config();
const { MongoClient } = require('mongodb');

const MONGO_URI = process.env.MONGO_URI;

// We need to strip the DB name from the URI to connect to the cluster root
const CLUSTER_URI = MONGO_URI.substring(0, MONGO_URI.lastIndexOf('/'));

async function syncDatabases() {
  const client = new MongoClient(CLUSTER_URI);

  try {
    console.log('🔌 Connecting to MongoDB Cluster...');
    await client.connect();
    console.log('✅ Connected successfully.\n');

    const targetDb = client.db('ArenaSync');

    // --- TASK 1: Copy from UserID to ArenaSync ---
    console.log('📦 Task 1: Migrating data from [UserID] to [ArenaSync]...');
    const sourceDbUserID = client.db('UserID');
    const collectionsToMigrate = [
      'Details', 
      'StaffCards', 
      'Ticket_Details', 
      'Venue_Analytics', 
      'incidents'
    ];

    for (const colName of collectionsToMigrate) {
      console.log(`   copying collection: ${colName}...`);
      const data = await sourceDbUserID.collection(colName).find({}).toArray();
      
      if (data.length > 0) {
        // Clear target collection first to avoid duplicates
        await targetDb.collection(colName).deleteMany({});
        await targetDb.collection(colName).insertMany(data);
        console.log(`   ✅ Migrated ${data.length} records for ${colName}`);
      } else {
        console.log(`   ⚠️ Collection ${colName} was empty or not found in UserID.`);
      }
    }

    // --- TASK 2: Copy Knowledge_Base from ArenaAI to ArenaSync ---
    console.log('\n🧠 Task 2: Migrating [Knowledge_Base] from [ArenaAI] to [ArenaSync]...');
    const sourceDbArenaAI = client.db('ArenaAI');
    const kbData = await sourceDbArenaAI.collection('Knowledge_Base').find({}).toArray();

    if (kbData.length > 0) {
      await targetDb.collection('Knowledge_Base').deleteMany({});
      await targetDb.collection('Knowledge_Base').insertMany(kbData);
      console.log(`   ✅ Migrated ${kbData.length} records to ArenaSync Knowledge_Base`);
    } else {
      console.log('   ⚠️ Knowledge_Base was empty in ArenaAI.');
    }

    console.log('\n🎉 ALL DATA SYNCED TO [ArenaSync] DATABASE! 🎉');
    console.log('You can now use "/ArenaSync" in your MONGO_URI.');

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
  } finally {
    await client.close();
    process.exit(0);
  }
}

syncDatabases();
