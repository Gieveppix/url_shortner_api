import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';

interface RequestUser {
  _id: number
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

  if (!token) {
    return res.status(401).send('Access denied. No token provided.');
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as DecodedUser;
    req.user = {
      _id: decoded._id,
      email: decoded.email,
    };
    next();
  } catch (error) {
    res.status(400).send('Invalid token.');
  }
};