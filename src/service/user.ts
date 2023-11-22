import bcrypt from 'bcrypt';
import type { ApiResponse } from '../types/response';
import { User, Token, TokenAction } from '../models';
import { IUser } from '../types';
import { HttpStatusCode } from '../types/response';
import { sendEmail, saveToken } from '../middleware';
import { v4 as uuidv4 } from "uuid"
import { HandleService } from '../middleware/errorCodes';

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 1 * 60 * 1000; // 1 min

class UserService {
  @HandleService
  async register(payload: Pick<IUser, "email" | "password" | "firstName" | "lastName">): Promise<ApiResponse> {      
    const exists: IUser | null = await User.findOne({ email: payload.email });
    
    if (exists) {
      throw 'ALREADY_REGISTERED'
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
  }
  
  @HandleService
  async login(payload: Pick<IUser, 'email' | 'password'>): Promise<ApiResponse> {
    const user: IUser | null = await User.findOne({ email: payload.email });
    
    if (!user) {
      throw "WRONG_CREDENTIALS"
    }
    
    const isPasswordValid = await bcrypt.compare(payload.password, user.password);
    if (isPasswordValid) {
      // If login is successful, reset failed attempts and unlock account if it was previously locked
      user.failedLoginAttempts = 0;
      user.accountLocked = false;
      user.lockedUntil = null;
      await user.save();
    
      const { password, failedLoginAttempts, ...userObject } = user.toObject();
    
      const token = await saveToken(userObject);
    
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
    }
    
    if (user.accountLocked && user.lockedUntil && user.lockedUntil.getTime() > Date.now()) {
      throw 'ACCOUNT_LOCKED'
    }
    
    user.failedLoginAttempts += 1;
    // Lock the account
    if (user.failedLoginAttempts >= MAX_LOGIN_ATTEMPTS) {
      user.accountLocked = true;
      user.lockedUntil = new Date(Date.now() + LOCK_TIME);
      await user.save();
    
      throw 'ACCOUNT_LOCKED'
    }
    
    await user.save();
    
    throw 'WRONG_CREDENTIALS'
  }

  @HandleService
  async logout(userId: IUser['_id']): Promise<ApiResponse | void> {
    await Token.updateMany({ createdBy: userId }, { isInvalidated: true });

    return {
      status: 'success',
      code: HttpStatusCode.Ok,
      message: 'User logged out successfully',
    };
  }
  
  @HandleService
  async verifyEmail(userId: IUser['_id'], verificationToken: string): Promise<ApiResponse> {
    const tokenAction = await TokenAction.findOne({
      token: verificationToken,
      actionName: "emailVerification"
    });

    if (!tokenAction) {
      throw 'INVALID_TOKEN'
    }
    
    if (tokenAction!.createdBy !== userId) {
      throw 'PERMISSION_DENIED'
    }
    
    const user = await User.findById(tokenAction!.createdBy);

    if (!user) {
      throw 'USER_NOT_FOUND'
    }
    
    if(Date.now() >= tokenAction!.expiresAt.getTime()) {
      throw 'VERIFICATION_TOKEN_EXPIRED'
    }
    
    if (user.emailVerified) {
      return {
        status: "success",
        code: HttpStatusCode.Ok,
        message: 'Email already verified',
      }
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
  }

  @HandleService
  async sendEmailAgain(userId: IUser['_id']): Promise<ApiResponse> {
    const user: IUser | null = await User.findOne({ _id: userId });
    
    if (!user) {
      throw "USER_NOT_FOUND"
    }
    
    if (user!.emailVerified) {
      return {
        status: "success",
        code: HttpStatusCode.Ok,
        message: 'Email already verified',
      }
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
  } 
}

export default new UserService();
