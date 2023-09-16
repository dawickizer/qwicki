import { Request, Response, NextFunction } from 'express';

// Fetch all friends for a user
export const getAllFriendsForUser = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const userId = req.params.userId;
    // Implement logic here...
    res.status(200).send(`Fetching all friends for user with ID: ${userId}`); // 200: OK
  } catch (error) {
    next(error);
  }
};

// Add a friend for a user
export const addFriendForUser = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const userId = req.params.userId;
    // Implement logic here...
    res.status(201).send(`Adding a friend for user with ID: ${userId}`); // 201: Created
  } catch (error) {
    next(error);
  }
};

// Delete a specific friend from a user's friend list
export const deleteFriendFromUser = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const userId = req.params.userId;
    const friendId = req.params.friendId;
    // Implement logic here...
    res.status(204).send(); // 204: No Content (typically used for successful DELETE operations)
  } catch (error) {
    next(error);
  }
};
