import bcrypt from 'bcrypt';
import type { ApiResponse } from '../types/response.type';
import { User, IUser } from '../types/models';
import { HttpStatusCode } from '../types/response.type';
import { generateToken, tokenExpiryInSeconds, sendEmail } from '../middleware';
import { v4 as uuidv4 } from "uuid"
import { JWT } from '../types/models/jwt.model';

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
  
      sendEmail(payload.email, "Confirm Email", `go to link http://localhost:3000/api/verify-email/${verificationToken}`)
  
      const user = new User({ ...payload, verificationToken });
  
      await user.save();
  
      return {
        status: 'success',
        code: HttpStatusCode.Created,
        message: "User registered successfully"
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
      
      const token = generateToken(user);

      const jwt = new JWT({
        jwt: token,
        createdBy: userObject._id,
        expiresAt: new Date(Date.now() + tokenExpiryInSeconds * 1000), 
      });

      await jwt.save();
      

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
        await JWT.updateMany({ createdBy: userId }, { isInvalidated: true });
        
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


  async verifyEmail(verificationToken: string): Promise<ApiResponse> {
    // TODO: Decode the user and check if that is the right user
    try {
      const user = await User.findOne({ verificationToken });

      if (!user) {
        return {
          status: "error",
          code: HttpStatusCode.BadRequest,
          message: 'Tokens do not match!',
          cause: 'tokens-do-not-match'
        };
      }

      user.emailVerified = true;

      await user.save();

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
}

export default new UserService();
