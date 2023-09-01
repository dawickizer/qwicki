// Import dependencies
import jwt from 'jsonwebtoken';
import config from '../config/config';
import { User } from '../models/user';
import UserService from '../services/user-service';

// determine environment
const env = process.env.NODE_ENV || 'development';

export const isAuthenticatedJWT = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, config[env].secret, (err: any, decodedJWT: any) => {
      if (err) return res.sendStatus(403);
      req.body.decodedJWT = decodedJWT;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

export const isAdmin = async (req: any, res: any, next: any) => {
  const userService = new UserService();
  const user: User | null = await userService.get(req.body.decodedJWT._id);
  if (!user || user.role !== 'admin') req.body.isAdmin = false;
  else req.body.isAdmin = true;
  next();
};

export const isAuthorized = async (req: any, res: any, next: any) => {
  if (req.body.decodedJWT._id === req.params.id) req.body.isAuthorized = true;
  else req.body.isAuthorized = false;
  next();
};

export const isLoggedIn = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, config[env].secret, (err: any) => {
      if (err) req.body.isLoggedIn = false;
      else req.body.isLoggedIn = true;
    });
  } else req.body.isLoggedIn = false;
  next();
};
