import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service';
import { User } from '../models/user';

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
    next(error);
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
    next(error);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.params.userId;
    const user = await userService.getUserById(userId);

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).send(`User with ID ${userId} not found.`);
    }
  } catch (error) {
    next(error);
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

    const user = await userService.updateUserById(userId, updatedUser);

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).send(`User with ID ${userId} not found.`);
    }
  } catch (error) {
    next(error);
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

    if (result) {
      res.status(204).send();
    } else {
      res.status(404).send('User not found.');
    }
  } catch (error) {
    next(error);
  }
};
