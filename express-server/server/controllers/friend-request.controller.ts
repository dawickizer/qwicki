import { Request, Response, NextFunction } from 'express';

import * as friendRequestService from '../services/friend-request.service';
import CustomError from '../error/CustomError';

export const createFriendRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.params.userId;
    const toUsername = req.body.username;

    const user = await friendRequestService.createFriendRequest(
      userId,
      toUsername
    );

    res.status(201).send(user);
  } catch (error: any) {
    console.log(error);
    if (error instanceof CustomError)
      res.status(error.status).json(error.message);
    else next(error);
  }
};

export const deleteFriendRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const userId = req.params.userId;
    const friendRequestId = req.params.friendRequestId;
    // Logic to delete the friend request...
    res.status(204).send();
  } catch (error) {
    console.log(error);
    if (error instanceof CustomError)
      res.status(error.status).json(error.message);
    else next(error);
  }
};
