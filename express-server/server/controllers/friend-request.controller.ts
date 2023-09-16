import { Request, Response, NextFunction } from 'express';

export const getAllFriendRequests = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const userId = req.params.userId;
    // Logic to fetch all friend requests for the user...
    res.status(200).send(`All friend requests for user with ID: ${userId}`);
  } catch (error) {
    next(error);
  }
};

export const createFriendRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const userId = req.params.userId;
    // Logic to send a friend request...
    res.status(201).send(`Friend request sent by user with ID: ${userId}`);
  } catch (error) {
    next(error);
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
    next(error);
  }
};

export const acceptFriendRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const userId = req.params.userId;
    const friendRequestId = req.params.friendRequestId;
    // Logic to accept the friend request...
    res
      .status(200)
      .send(
        `Friend request with ID: ${friendRequestId} accepted by user with ID: ${userId}`
      );
  } catch (error) {
    next(error);
  }
};
