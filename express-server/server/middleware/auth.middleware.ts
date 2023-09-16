import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/config';

const env = process.env.NODE_ENV || 'development';

export const isAuthenticatedJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, config[env].secret, (err: any, decodedJWT: any) => {
      if (err) return res.status(403).send('Token verification failed.');
      req.body.decodedJWT = decodedJWT;
      next();
    });
  } else {
    res.status(401).send('Authentication required.');
  }
};
