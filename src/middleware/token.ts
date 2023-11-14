import jwt from 'jsonwebtoken';
import { IUser } from '../types/models';
import { config } from '../config'

export const tokenExpiryInSeconds: number = 60 * 60 * 24 * 7; // 7 days

export function generateToken(user: Pick<IUser, "_id" | "email"> ): string {
  const payload = {
    _id: user._id,
    email: user.email,
  };

  const options = {
    expiresIn: tokenExpiryInSeconds,
  };

  return jwt.sign(payload, config.jwtSecret, options);
}

export function decodeToken(token: string) {
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch (error) {
    return null;
  }
}