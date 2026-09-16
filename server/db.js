import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('❌ MONGODB_URI is not defined in your .env file!');
    process.exit(1);
  }

  if (uri.includes('<db_password>')) {
    console.error('⚠️  ACTION REQUIRED: Replace <db_password> in your .env file with your actual MongoDB Atlas password.');
    console.error('File location: .env (in the project root)');
    return false;
  }

  try {
    console.log('⏳ Connecting to MongoDB Atlas...');
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB successfully!');
    return true;
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    if (err.message.includes('bad auth') || err.message.includes('Authentication failed')) {
      console.error('👉 Please verify your username and password in .env');
    } else if (err.message.includes('querySrv')) {
      console.error('👉 DNS/Network issue. Ensure your IP address is whitelisted in MongoDB Atlas (Network Access -> Add IP Address -> 0.0.0.0/0 or Current IP).');
    }
    return false;
  }
};
