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
    const friendsParam = req.query.friends === 'true';
    const friendRequestsParam = req.query.friendRequests === 'true';
    let user: User;

    if (friendsParam && friendRequestsParam) {
      user = await userService.getUserByIdAndPopulateChildren(userId);
    } else if (friendsParam) {
      user = await userService.getUserByIdAndPopulateFriends(userId);
    } else if (friendRequestsParam) {
      user = await userService.getUserByIdAndPopulateFriendRequests(userId);
    } else {
      user = await userService.getUserById(userId);
    }

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
    const user = await userService.updateUserByIdAndPopulateChildren(
      userId,
      updatedUser
    );
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
