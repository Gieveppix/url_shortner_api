import jwt from 'jsonwebtoken';
import { config } from '../config';
import { IUser } from '../types';
import { Token } from '../models';

class TokenService {
  generateToken(user: Pick<IUser, '_id' | 'email'>): string {
    const payload = {
      _id: user._id,
      email: user.email,
    };

    const options = {
      expiresIn: config.jwtExpiryInSeconds,
    };

    return jwt.sign(payload, config.jwtSecret, options);
  }

  decodeToken(token: string) {
    try {
      return jwt.verify(token, config.jwtSecret);
    } catch (error) {
      return null;
    }
  }

  async saveToken(user: IUser) {
    try {
      const token = this.generateToken(user);

      const jwtInstance = new Token({
        jwt: token,
        createdBy: user._id,
        expiresAt: new Date(Date.now() + config.jwtExpiryInSeconds * 1000),
      });

      await jwtInstance.save();

      return token;
    } catch (error) {
      throw error;
    }
  }
}

export default new TokenService();
