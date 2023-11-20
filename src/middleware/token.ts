import jwt from 'jsonwebtoken';
import { IUser, Token } from '../models';
import { config } from '../config'


export function generateToken(user: Pick<IUser, "_id" | "email"> ): string {
  const payload = {
    _id: user._id,
    email: user.email,
  };

  const options = {
    expiresIn: config.jwtExpiryInSeconds,
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

export async function saveToken(user: IUser) {
  try {
    const token = generateToken(user);
  
    const jwt = new Token({
      jwt: token,
      createdBy: user._id,
      expiresAt: new Date(Date.now() + config.jwtExpiryInSeconds * 1000), 
    });
    
    await jwt.save();
    
    return token
  } catch (error) {
    throw error
  }
}

