import { Request, Response, NextFunction } from 'express';
import { HttpStatusCode, ResponseError } from '../types/response.type';
import { IUser } from '../types/models/user.model';

export const isVerified = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user as IUser;

  const response: ResponseError = {
    status: 'error',
    code: HttpStatusCode.Forbidden,
    message: 'Email not verified. Please verify your email address.',
    cause: 'email-not-verified',
  };

  if (!user.emailVerified) {
    return res.status(HttpStatusCode.Forbidden).send(response);
  }

  next();
};
