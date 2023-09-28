import { Request, Response, NextFunction } from 'express';
import * as messageService from '../services/message.service';
import CustomError from '../error/CustomError';

export const getMessages = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.params.userId;
    const friendId = req.params.friendId;

    await messageService.getMessages();
    res
      .status(200)
      .send(
        `Fetching all messages between user with ID: ${userId} and user with ID: ${friendId}`
      );
  } catch (error) {
    next(error);
  }
};

export const createMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.params.userId;
    const friendId = req.params.friendId;
    const content = req.body.content;
    const message = await messageService.createMessage(
      userId,
      friendId,
      content
    );
    res.status(201).send(message);
  } catch (error) {
    if (error instanceof CustomError)
      res.status(error.status).json(error.message);
    else next(error);
  }
};

export const checkUnviewedMessages = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.params.userId;
    const friendId = req.params.friendId;

    await messageService.checkUnviewedMessages();
    res
      .status(200)
      .send(
        `Checking unviewed messages between user with ID: ${userId} and user with ID: ${friendId}`
      );
  } catch (error) {
    if (error instanceof CustomError)
      res.status(error.status).json(error.message);
    else next(error);
  }
};

export const markMessagesAsViewed = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.params.userId;
    const friendId = req.params.friendId;

    await messageService.markMessagesAsViewed();

    res
      .status(200)
      .send(
        `Marking unviewed messages as viewed between user with ID: ${userId} and user with ID: ${friendId}`
      );
  } catch (error) {
    if (error instanceof CustomError)
      res.status(error.status).json(error.message);
    else next(error);
  }
};
