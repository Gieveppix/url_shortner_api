import { Request, Response } from 'express';
import { IUser } from '../types/models';
import UserService from '../service/user.service';
import { handleResponse } from '../middleware';

class UserController {
  async login(req: Request, res: Response): Promise<void> {
    const user: Pick<IUser, 'email' | 'password'> = {
      email: req.body.email,
      password: req.body.password,
    };

    const loginResult = await UserService.login(user);
    handleResponse(loginResult, res)
  }

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

  async verifyEmail(req: Request, res: Response): Promise<void> {
    const verifyResult = await UserService.verifyEmail(req.params.token);
    res.status(verifyResult.code).send(verifyResult.message);
  }
}

export default new UserController();
