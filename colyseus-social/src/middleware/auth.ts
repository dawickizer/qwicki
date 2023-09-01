// Import dependencies
import jwt from 'jsonwebtoken';
import config from '../config/config';

// determine environment
const env = process.env.NODE_ENV || 'development';

export const isAuthenticatedJWT = (accessToken: string): any => {
  return jwt.verify(accessToken, config[env].secret);
};
