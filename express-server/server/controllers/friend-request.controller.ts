import { Request, Response, NextFunction } from 'express';

import * as friendRequestService from '../services/friend-request.service';
import CustomError from '../error/CustomError';

export const getFriendRequestsByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.params.userId;
    // Construct params object based on query parameters
    const params = {
      inbound: req.query.inbound === 'true',
      outbound: req.query.outbound === 'true',
    };
    // Pass params to service function
    const friendRequests = await friendRequestService.getFriendRequestsByUserId(
      userId,
      params
    );
    res.status(200).send(friendRequests);
  } catch (error: any) {
    if (error instanceof CustomError) {
      res.status(error.status).json(error.message);
    } else {
      next(error);
    }
  }
};

export const createFriendRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.params.userId;
    const toUsername = req.body.username;

    const friendRequest = await friendRequestService.createFriendRequest(
      userId,
      toUsername
    );

    res.status(201).send(friendRequest);
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
    const friendRequest = await friendRequestService.deleteFriendRequestById(
      userId,
      friendRequestId
    );
    res.status(200).send(friendRequest);
  } catch (error) {
    if (error instanceof CustomError)
      res.status(error.status).json(error.message);
    else next(error);
  }
};
