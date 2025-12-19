// Quick script to test Atlas connection
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testConnection = async () => {
  try {
    console.log('🔍 Testing MongoDB Atlas connection...');
    console.log('Connection string:', process.env.MONGODB_URI?.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Successfully connected to MongoDB Atlas!');
    
    // Test a simple query
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('📊 Collections found:', collections.map(c => c.name));
    
    await mongoose.disconnect();
    console.log('✅ Connection test passed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    
    if (error.message.includes('whitelist') || error.message.includes('IP')) {
      console.log('\n💡 SOLUTION: Add your IP to Atlas Network Access');
      console.log('1. Go to: https://cloud.mongodb.com/v2#/security/network/whitelist');
      console.log('2. Click "Add IP Address"');
      console.log('3. Enter: 0.0.0.0/0 (for development) OR your specific IP');
      console.log('4. Wait 1-2 minutes for changes to propagate');
    } else if (error.message.includes('authentication')) {
      console.log('\n💡 SOLUTION: Check your username and password in MONGODB_URI');
    } else if (error.message.includes('ENOTFOUND')) {
      console.log('\n💡 SOLUTION: Check your cluster name in MONGODB_URI');
    }
    
    process.exit(1);
  }
};

testConnection();

