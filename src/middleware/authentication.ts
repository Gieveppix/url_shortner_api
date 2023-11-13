import { Request, Response, NextFunction } from 'express';
import { decodeToken } from './token';
import { HttpStatusCode, ResponseError } from '../types/response.type';

interface RequestUser {
  _id: string
  email: string
}

interface DecodedUser extends RequestUser {
  iat: number;
  exp: number;
}

declare module 'express' {
  interface Request {
    user?: RequestUser;
  }
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header('Authorization')?.split(' ')[1];

  const response: ResponseError = {
    status: 'error',
    code: HttpStatusCode.Unauthorized,
    message: 'Access denied. No token provided or the provided token is not valid.',
    cause: 'invalid-token'
  };

  if (!token) {
    return res.status(HttpStatusCode.Unauthorized).send(response);
  }

  try {
    const decoded = decodeToken(token) as DecodedUser;
    req.user = {
      _id: decoded._id,
      email: decoded.email,
    };
    next();
  } catch (error) {
    res.status(HttpStatusCode.Unauthorized).send(response);
  }
};