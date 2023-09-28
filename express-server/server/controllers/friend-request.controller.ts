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
    if (error instanceof CustomError)
      res.status(error.status).json(error.message);
    else next(error);
  }
};

export const deleteFriendRequestById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.params.userId;
    const friendRequestId = req.params.friendRequestId;
    const user = await friendRequestService.deleteFriendRequestById(
      userId,
      friendRequestId
    );
    res.status(200).send(user);
  } catch (error) {
    if (error instanceof CustomError)
      res.status(error.status).json(error.message);
    else next(error);
  }
};
