import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;

console.log('\n--- MongoDB Connection Test ---');

if (!uri) {
  console.error('❌ MONGODB_URI is not set in your .env file.');
  process.exit(1);
}

if (uri.includes('<db_password>')) {
  console.error('⚠️  Your .env still has the placeholder "<db_password>".');
  console.error('👉 Please open .env and put your real password in MONGODB_URI before running this test.\n');
  process.exit(1);
}

console.log('Connecting to MongoDB...');
try {
  await mongoose.connect(uri);
  console.log('✅ Connection successful!');
  console.log(`Database name: ${mongoose.connection.name}`);
  console.log(`Host: ${mongoose.connection.host}`);
  await mongoose.disconnect();
  console.log('Connection closed cleanly.\n');
} catch (err) {
  console.error('❌ Connection failed:', err.message);
  if (err.message.includes('bad auth') || err.message.includes('Authentication failed')) {
    console.error('👉 Please check that your username and password are correct in .env');
  } else if (err.message.includes('querySrv') || err.message.includes('ETIMEOUT')) {
    console.error('👉 Network timeout: Check that your IP is allowed in MongoDB Atlas -> Network Access (allow 0.0.0.0/0 for anywhere).');
  }
  process.exit(1);
}
