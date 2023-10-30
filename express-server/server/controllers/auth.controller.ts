import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import CustomError from '../error/CustomError';

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const credentials = req.body;
    const token = await authService.login(credentials);
    res.status(200).json(token);
  } catch (error) {
    if (error instanceof CustomError)
      res.status(error.status).json(error.message);
    else next(error);
  }
};

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = await authService.signup(req.body);
    res.status(201).json(token);
  } catch (error) {
    if (error instanceof CustomError)
      res.status(error.status).json(error.message);
    else next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await authService.logout(req.body.decodedJWT._id);
    res.status(200).json();
  } catch (error) {
    if (error instanceof CustomError)
      res.status(error.status).json(error.message);
    else next(error);
  }
};

export const currentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    res.status(200).json(req.body.decodedJWT);
  } catch (error) {
    if (error instanceof CustomError)
      res.status(error.status).json(error.message);
    else next(error);
  }
};

export const isLoggedIn = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    res.status(200).json(authService.isLoggedIn(req.headers.authorization));
  } catch (error) {
    if (error instanceof CustomError)
      res.status(error.status).json(error.message);
    else next(error);
  }
};
