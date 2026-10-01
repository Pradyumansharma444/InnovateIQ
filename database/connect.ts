import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://pradyumansharma104_db_user:EqOXcmqEhBf56M1X@cluster0.qovz0dg.mongodb.net/innovateiq?retryWrites=true&w=majority';

export const connectDatabase = async (): Promise<typeof mongoose> => {
  try {
    if (mongoose.connection.readyState >= 1) {
      return mongoose;
    }
    
    console.log('Connecting to MongoDB Atlas...');
    const conn = await mongoose.connect(MONGODB_URI, {
      dbName: 'innovateiq',
    });
    console.log(`MongoDB Atlas Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('Error connecting to MongoDB Atlas:', error);
    throw error;
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    console.log('MongoDB Atlas Disconnected');
  }
};
