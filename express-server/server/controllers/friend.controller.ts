import { Request, Response, NextFunction } from 'express';
import * as friendService from '../services/friend.service';
import CustomError from '../error/CustomError';

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
    await friendService.removeFriend(userId, friendId);
    res.status(204).send();
  } catch (error) {
    if (error instanceof CustomError)
      res.status(error.status).json(error.message);
    else next(error);
  }
};
