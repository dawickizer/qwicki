import { Request, Response, NextFunction } from 'express';
import * as friendService from '../services/friend.service';
import CustomError from '../error/CustomError';

// COME BACK TO THIS AFTER FRIEND REQUEST LOGIC...this should take the friend request in the body,
// ensure the friend request is in the users inbound friend requests, add the friends to each other,
// remove inbound/outbound friend request from each other, and then returns the entire user since multiple
// state updates happened to the user
export const addFriendForUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.params.userId;
    const friendId = req.body.friendId;
    const friend = await friendService.addFriendForUser(userId, friendId);
    await friendService.addFriendForUser(friendId, userId);
    res.status(201).send(friend);
  } catch (error) {
    if (error instanceof CustomError)
      res.status(error.status).json(error.message);
    else next(error);
  }
};

export const deleteFriendFromUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.params.userId;
    const friendId = req.params.friendId;
    await friendService.deleteFriendFromUser(userId, friendId);
    await friendService.deleteFriendFromUser(friendId, userId);
    res.status(204).send();
  } catch (error) {
    if (error instanceof CustomError)
      res.status(error.status).json(error.message);
    else next(error);
  }
};
