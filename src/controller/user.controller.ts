import { Request, Response } from 'express';
import { IUser } from '../types/models';
import UserService from '../service/user.service';
import { handleResponse } from '../middleware';

class UserController {
  async register(req: Request, res: Response): Promise<void> {
    const user: Pick<IUser, 'email' | 'password' | 'firstName' | 'lastName'> = {
      email: req.body.email,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    }

    const registerResult = await UserService.register(user);
    handleResponse(registerResult, res)
  }

  async login(req: Request, res: Response): Promise<void> {
    const user: Pick<IUser, 'email' | 'password'> = {
      email: req.body.email,
      password: req.body.password,
    };

    const loginResult = await UserService.login(user);
    handleResponse(loginResult, res)
  }

  async logout(req: Request, res: Response): Promise<void> {
    const userId = req.user?._id;

    const logoutResult = await UserService.logout(userId);
    handleResponse(logoutResult, res);
}


  async verifyEmail(req: Request, res: Response): Promise<void> {
    const result = await UserService.verifyEmail(req.user?._id, req.params.token);
    res.status(result.code).send(result.message);
  }

  async sendEmailAgain(req: Request, res: Response): Promise<void> {
    const result = await UserService.sendEmailAgain(req.user?._id);
    res.status(result.code).send(result.message);
  }
}

export default new UserController();
