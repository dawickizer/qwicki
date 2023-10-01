import { Schema } from 'mongoose';
import NotFoundError from '../error/NotFoundError';
import UnauthorizedError from '../error/UnauthorizedError';
import { User } from '../models/user';
import * as userService from './user.service';
import config from '../config/config';
import jwt from 'jsonwebtoken';

const env = process.env.NODE_ENV || 'development';

export const login = async (credentials: any): Promise<any> => {
  try {
    const user = await userService.getUserByCredentials(credentials);
    return {
      token: jwt.sign(
        { username: user.username, _id: user._id },
        config[env].secret
      ),
    };
  } catch (error) {
    if (error instanceof NotFoundError)
      throw new UnauthorizedError('Username or password is incorrect.');
    else throw error;
  }
};

export const signup = async (user: User): Promise<any> => {
  user = await userService.createUser(user);
  return {
    token: jwt.sign(
      { username: user.username, _id: user._id },
      config[env].secret
    ),
  };
};

export const logout = async (
  userId: string | Schema.Types.ObjectId
): Promise<User> => {
  return userService.getUserById(userId);
};

export const isLoggedIn = (authHeader: any): boolean => {
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    try {
      jwt.verify(token, config[env].secret);
      return true;
    } catch (err) {
      return false;
    }
  }
  return false;
};
