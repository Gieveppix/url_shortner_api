import { Request, Response } from 'express';
import { ApiResponse, IUser } from '../types';
import UserService from '../service/user';
import { HandleController } from '../utils';

class UserController {
  @HandleController
  async register(req: Request, res: Response): Promise<ApiResponse | void> {
    const user: Pick<IUser, 'email' | 'password' | 'firstName' | 'lastName'> = {
      email: req.body.email,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    }

    return UserService.register(user);
  }

  @HandleController
  async login(req: Request, res: Response): Promise<ApiResponse | void> {
    const user: Pick<IUser, 'email' | 'password'> = {
      email: req.body.email,
      password: req.body.password,
    };

    return UserService.login(user);
  }

  @HandleController
  async logout(req: Request, res: Response): Promise<ApiResponse | void> {
    const userId = req.user?._id;

    return UserService.logout(userId);
  }

  @HandleController
  async verifyEmail(req: Request, res: Response): Promise<ApiResponse | void> {
    return UserService.verifyEmail(req.user?._id, req.params.token);
  }

  @HandleController
  async sendEmailAgain(req: Request, res: Response): Promise<ApiResponse | void> {
    return UserService.sendEmailAgain(req.user?._id);
  }
}

export default new UserController();
