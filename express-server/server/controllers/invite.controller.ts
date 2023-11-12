import { Request, Response, NextFunction } from 'express';

import * as inviteService from '../services/invite.service';
import CustomError from '../error/CustomError';

export const getInvitesByUserId = async (
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
    const invites = await inviteService.getInvitesByUserId(userId, params);
    res.status(200).send(invites);
  } catch (error: any) {
    if (error instanceof CustomError) {
      res.status(error.status).json(error.message);
    } else {
      next(error);
    }
  }
};

export const createInvite = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.params.userId;
    let invite = req.body;
    invite = await inviteService.createInvite(userId, invite);
    res.status(201).send(invite);
  } catch (error: any) {
    if (error instanceof CustomError)
      res.status(error.status).json(error.message);
    else next(error);
  }
};

export const deleteInviteById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.params.userId;
    const inviteId = req.params.inviteId;
    const invite = await inviteService.deleteInviteById(userId, inviteId);
    res.status(200).send(invite);
  } catch (error) {
    if (error instanceof CustomError)
      res.status(error.status).json(error.message);
    else next(error);
  }
};
