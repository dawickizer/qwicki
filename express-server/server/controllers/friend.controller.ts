import { Request, Response, NextFunction } from 'express';
import * as friendService from '../services/friend.service';
import CustomError from '../error/CustomError';

export const getFriendsByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.params.userId;
    const friends = await friendService.getFriendsByUserId(userId);
    res.status(200).send(friends);
  } catch (error) {
    if (error instanceof CustomError)
      res.status(error.status).json(error.message);
    else next(error);
  }
};

export const addFriend = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.params.userId;
    const friendRequestId = req.body.friendRequestId;
    const user = await friendService.addFriend(userId, friendRequestId);
    res.status(201).send(user);
  } catch (error) {
    if (error instanceof CustomError)
      res.status(error.status).json(error.message);
    else next(error);
  }
};

export const removeFriend = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.params.userId;
    const friendId = req.params.friendId;
    const friend = await friendService.removeFriend(userId, friendId);
    res.status(200).send(friend);
  } catch (error) {
    if (error instanceof CustomError)
      res.status(error.status).json(error.message);
    else next(error);
  }
};
