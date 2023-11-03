import mongoose from 'mongoose';
import { logger } from '../helpers/logger.helper';
import { IUser, User } from '../types/models';

const connectDB = async (MONGO_URI: string) => {
  try {
    await mongoose.connect(MONGO_URI);
    logger.info('Database connection established');
  } catch (error) {
    logger.error('Database connection failed', error);
    throw error
  }
};

export { 
  connectDB,
  IUser, 
  User 
}