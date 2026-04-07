import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.error(
      '\nTip: If using MongoDB Atlas with mongodb+srv:// and getting DNS errors,' +
      '\ntry using the standard connection string (mongodb://) from Atlas instead.' +
      '\nIn Atlas: Connect > Drivers > "I am using an older driver" for the non-SRV string.\n'
    );
    process.exit(1);
  }
};
