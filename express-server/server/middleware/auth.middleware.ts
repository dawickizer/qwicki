import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import UnauthorizedError from '../error/UnauthorizedError';
import CustomError from '../error/CustomError';
import ForbiddenError from '../error/ForbiddenError';

const env = process.env.NODE_ENV || 'development';

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      jwt.verify(token, config[env].secret, (err: any, decodedJWT: any) => {
        if (err) throw new UnauthorizedError('Token verification failed.');
        req.body.decodedJWT = decodedJWT;
        req.body.isAuthenticated = true;
        next();
      });
    } else {
      throw new UnauthorizedError('Authentication required.');
    }
  } catch (error) {
    if (error instanceof CustomError)
      res.status(error.status).json(error.message);
    else next(error);
  }
};

export const isAuthorized = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.body.decodedJWT._id === req.params.userId)
      req.body.isAuthorized = true;
    else {
      req.body.isAuthorized = false;
      throw new ForbiddenError(
        'You do not have permission to make requests for this user'
      );
    }
    next();
  } catch (error) {
    if (error instanceof CustomError)
      res.status(error.status).json(error.message);
    else next(error);
  }
};
