import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service';
import { User } from '../models/user';
import CustomError from '../error/CustomError';

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const newUser: User = req.body;
    const user = await userService.createUser(newUser);
    res.status(201).json({ user });
  } catch (error) {
    if (error instanceof CustomError)
      res.status(error.status).json(error.message);
    else next(error);
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    if (error instanceof CustomError)
      res.status(error.status).json(error.message);
    else next(error);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.params.userId;
    const query = {
      friends: req.query.friends === 'true',
      friendRequests: req.query.friendRequests === 'true',
      invites: req.query.invites === 'true',
    };
    const user = await userService.getUserById(userId, query);

    res.status(200).json(user);
  } catch (error) {
    if (error instanceof CustomError)
      res.status(error.status).json(error.message);
    else next(error);
  }
};

export const updateUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId: string = req.params.userId;
    const updatedUser: User = req.body;
    const user = await userService.updateUserById(userId, updatedUser, {
      friends: true,
      friendRequests: true,
      invites: true,
    });
    res.status(200).json(user);
  } catch (error) {
    if (error instanceof CustomError)
      res.status(error.status).json(error.message);
    else next(error);
  }
};

export const deleteUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.params.userId;
    const result = await userService.deleteUserById(userId);
    res.status(204).send(result);
  } catch (error) {
    if (error instanceof CustomError)
      res.status(error.status).json(error.message);
    else next(error);
  }
};
