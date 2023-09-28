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
    const messages = await messageService.getMessages(userId, friendId);
    res.status(200).send(messages);
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

export const unviewedMessagesCount = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.params.userId;
    const friendId = req.params.friendId;
    const count = await messageService.unviewedMessagesCount(userId, friendId);
    res.status(200).send({ count });
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
    const result = await messageService.markMessagesAsViewed(userId, friendId);
    res.status(200).send(result);
  } catch (error) {
    if (error instanceof CustomError)
      res.status(error.status).json(error.message);
    else next(error);
  }
};
