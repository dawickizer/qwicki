import { connect } from 'mongoose';
import config from '../config/config';

const env = process.env.NODE_ENV || 'development';

// This async function establishes the MongoDB connection
export const establishDbConnection = async () => {
  try {
    await connect(config[env].db);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
};
