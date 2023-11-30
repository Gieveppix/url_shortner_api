import { Request, Response, NextFunction } from 'express';
import { RequestUser, DecodedUser, HttpStatusCode, ResponseError } from '../types';
import { Token } from '../models';
import TokenService from '../service/token'

declare module 'express' {
  interface Request {
    user?: RequestUser;
  }
}

export const authenticate = async (
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
    const decoded = TokenService.decodeToken(token) as DecodedUser;
    const userToken = await Token.findOne({ jwt: token, isInvalidated: false });
    
    if (!userToken) {
      return res.status(HttpStatusCode.Unauthorized).send(response);
    }
    
    req.user = {
      _id: decoded._id,
      email: decoded.email,
    };
    next();
  } catch (error) {
    res.status(HttpStatusCode.Unauthorized).send(response);
  }
};