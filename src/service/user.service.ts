import bcrypt from 'bcrypt';
import type { ApiResponse } from '../types/response.type';
import { User, IUser, Token, TokenAction, TokenActions } from '../types/models';
import { HttpStatusCode } from '../types/response.type';
import { sendEmail, saveToken } from '../middleware';
import { v4 as uuidv4 } from "uuid"
import { returnBadRequestIfNull, returnUnauthorizedIfNotEqual } from '../middleware/handleResponse';

// TODO: Check causes and messages
class UserService {
  async register(payload: Pick<IUser, "email" | "password" | "firstName" | "lastName">): Promise<ApiResponse> {
    try {
      
      const exists: IUser | null = await User.findOne({ email: payload.email });
      
      if (exists) {
        return {
          status: 'success',
          code: HttpStatusCode.Ok,
          message: 'User already registered',
        };
      }
      
      const verificationToken = uuidv4();
      
      const user = new User({ ...payload, verificationToken });
      
      await user.save();
      
      
      await sendEmail(payload.email, user._id, verificationToken);
      
      // return a valid jwt so the user gets logged in right away
      const token = await saveToken(user)

      return {
        status: 'success',
        code: HttpStatusCode.Created,
        message: "User registered successfully",
        data: {
          token
        }
      }
    } catch (error) {
      return {
        status: 'error',
        code: HttpStatusCode.InternalServerError,
        message: 'Internal server error',
        cause: 'server-error'
      };
    }
  }
  
  async login(payload: Pick<IUser, 'email' | 'password'>): Promise<ApiResponse> {
    const MAX_LOGIN_ATTEMPTS = 5;
    const LOCK_TIME = 1 * 60 * 1000; // 1 min
    
    try {
      const user: IUser | null = await User.findOne({ email: payload.email });
      
      if (!user) {
        return {
          status: 'error',
          code: HttpStatusCode.Unauthorized,
          message: 'Invalid username or password',
          cause: 'unauthorized-error'
        };
      }
      
      const isPasswordValid = await bcrypt.compare(payload.password, user.password);
      if (!isPasswordValid) {
        if (user.accountLocked && user.lockedUntil && user.lockedUntil.getTime() > Date.now()) {
          return {
            status: 'error',
            code: HttpStatusCode.Unauthorized,
            message: 'Account locked. Please try again later.',
            cause: 'account-locked',
          };
        }
        
        user.failedLoginAttempts += 1;
        if (user.failedLoginAttempts >= MAX_LOGIN_ATTEMPTS) {
          // Lock the account
          user.accountLocked = true;
          user.lockedUntil = new Date(Date.now() + LOCK_TIME);
        }
        await user.save();
        
        if ((MAX_LOGIN_ATTEMPTS - user.failedLoginAttempts) > 0) {
          return {
            status: 'error',
            code: HttpStatusCode.Unauthorized,
            message: `Invalid username or password. Login attempts left: ${MAX_LOGIN_ATTEMPTS - user.failedLoginAttempts}`,
            cause: 'unauthorized-error'
          };
        } else {
          return {
            status: 'error',
            code: HttpStatusCode.Unauthorized,
            message: `Invalid username or password. Account locked.`,
            cause: 'unauthorized-error'
          };
        }
      }
      
      // If login is successful, reset failed attempts and unlock account if it was previously locked
      user.failedLoginAttempts = 0;
      user.accountLocked = false;
      user.lockedUntil = null;
      await user.save();
      
      const { password, failedLoginAttempts, ...userObject } = user.toObject();
      
      const token = await saveToken(user)

      return {
        status: 'success',
        code: HttpStatusCode.Ok,
        data: {
          user: {
            ...userObject,
            token: token,
          },
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

  async logout(userId: IUser['_id']): Promise<ApiResponse> {
    try {
        await Token.updateMany({ createdBy: userId }, { isInvalidated: true });
        
        return {
          status: 'success',
          code: HttpStatusCode.Ok,
          message: 'User logged out successfully',
        };
    } catch (error) {
      return {
        status: 'error',
        code: HttpStatusCode.InternalServerError,
        message: 'Internal server error',
        cause: 'server-error',
      };
    }
  }
  
  async verifyEmail(userId: IUser['_id'], verificationToken: string): Promise<ApiResponse> {
    try {
      const actionName: TokenActions = "emailVerification";
      
      const tokenAction = await TokenAction.findOne({
        token: verificationToken,
        actionName
      });

      const tokenBadRequest = returnBadRequestIfNull(tokenAction, 'Invalid or expired verification token');
      if (tokenBadRequest) return tokenBadRequest
      
      const unauthorized = returnUnauthorizedIfNotEqual(tokenAction!.createdBy, userId)
      if (unauthorized) return unauthorized;
      
      const user = await User.findById(tokenAction!.createdBy);
      
      if(Date.now() >= tokenAction!.expiresAt.getTime()) {
        return {
          status: "error",
          code: HttpStatusCode.InternalServerError,
          message: 'The verification token has expired',
          cause: "server_error",
        };
      }
  
      if (!user) {
        return {
          status: "error",
          code: HttpStatusCode.InternalServerError,
          message: 'Unable to find the associated user',
          cause: "server_error",
        };
      }
      
      if (user.emailVerified) {
        return {
          status: "success",
          code: HttpStatusCode.Ok,
          message: 'Email already verified',
        };
      }
  
      user.emailVerified = true;
      await user.save();
      
      tokenAction!.executedAt = new Date();
      await tokenAction!.save();
      
      return {
        status: "success",
        code: HttpStatusCode.Ok,
        message: 'Email successfully verified',
      };
    } catch (error) {
      return {
        status: "error",
        code: HttpStatusCode.InternalServerError,
        message: 'Unable to verify email',
        cause: "unable-to-verify-email"
      };
    }
  }

  async sendEmailAgain(userId: IUser['_id']): Promise<ApiResponse> {
    
    try {
      const user: IUser | null = await User.findOne({ _id: userId });
      
      const userNotFound = returnBadRequestIfNull(user, 'User not found');
      if (userNotFound) return userNotFound
      
      if (user!.emailVerified) {
        return {
          status: "success",
          code: HttpStatusCode.Ok,
          message: 'Email already verified',
        };
      }
      
      const verificationToken = uuidv4();
      
      user!.verificationToken = verificationToken
      
      await user!.save()
      
      await sendEmail(user!.email, userId, verificationToken)
      
      return {
        status: "success",
        code: HttpStatusCode.Ok,
        message: 'Email sent successfully',
      };
    } catch (error) {
      return {
        status: "error",
        code: HttpStatusCode.InternalServerError,
        message: 'Unable to verify email',
        cause: "unable-to-verify-email"
      };
    }
  } 
}



export default new UserService();
