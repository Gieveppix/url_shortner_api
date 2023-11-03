import jwt from 'jsonwebtoken';
import { IUser } from '../types/models';
import { config } from '../config'

export function generateToken(user: Pick<IUser, "_id" | "email"> ): string {
  const payload = {
    _id: user._id,
    email: user.email,
  };

  const options = {
    expiresIn: '7d',
  };

  return jwt.sign(payload, config.jwtSecret, options);
}