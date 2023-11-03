import bcrypt from 'bcrypt';
import { Response } from 'express';
import type { ResponseType } from '../types/response.type';
import { User, IUser } from '../types/models';
import { HttpStatusCode } from '../types/response.type';
import { generateToken } from '../middleware';
import { LoginResponse } from '../types/user.type';

class UserService {
  async login(email: string, pass: string): Promise<LoginResponse> {
    try {
      const user: IUser | null = await User.findOne({ email });
  
      if (user === null) {
        return {
          status: 'error',
          code: HttpStatusCode.Unauthorized,
          message: 'Invalid username or password',
          cause: 'unauthorized-error'
        };
      }
    
      const isPasswordValid = await bcrypt.compare(pass, user.password);
      if (!isPasswordValid) {
        return {
          status: 'error',
          code: HttpStatusCode.Unauthorized,
          message: 'Invalid username or password',
          cause: 'unauthorized-error'
        };
      }
      
      const { password, ...userObject } = user.toObject();
      return {
        status: 'success',
        code: HttpStatusCode.Ok,
        user: {
          ...userObject,
          token: generateToken(user),
        },
      };
    } catch (error) {
      return {
        status: 'error',
        code: HttpStatusCode.InternalServerError,
        message: 'Internal server error',
        cause: 'server-error'
      };
    }
  }

  handleLoginResponse(response: LoginResponse, res: Response): void {
    if (response.status === 'success') {
      res.status(response.code).send(response);
      return
    } 
    res.status(response.code).send(response);
    
  }

  async verifyEmail(verificationToken: string): Promise<ResponseType> {
    try {
      // Find the user by verification token
      const user = await User.findOne({ verificationToken });

      if (!user) {
        return {
          code: HttpStatusCode.BadRequest,
          message: 'Tokens do not match!',
        };
      }

      // Set emailVerified to true
      user.emailVerified = true;

      // Save the updated user
      await user.save();

      return {
        code: HttpStatusCode.Ok,
        message: 'Email successfully verified',
      };
    } catch (error) {
      return {
        code: HttpStatusCode.InternalServerError,
        message: 'Unable to verify email',
      };
    }
  }
}

export default new UserService();
