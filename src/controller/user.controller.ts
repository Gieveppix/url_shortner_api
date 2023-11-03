import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { IUser, User } from '../types/models/index';
import UserService from '../service/user.service';
import { sendEmail } from '../middleware';
import { v4 as uuidv4 } from "uuid"

class UserController {
  async login(req: Request, res: Response): Promise<void> {
    const user: Pick<IUser, 'email' | 'password'> = {
      email: req.body.email,
      password: req.body.password,
    };

    const loginResult = await UserService.login(user.email, user.password);
    UserService.handleLoginResponse(loginResult, res)
  }

  async register(req: Request, res: Response): Promise<void> {
    try {
      const validationResultObject = validationResult(req);
      const errors = validationResultObject.array();

      if (errors[0]) {
        res.status(422).send(errors[0].msg);
        return;
      }

      const { firstName, lastName, email, password } = req.body as IUser;
      const verificationToken = uuidv4();

      sendEmail(email, "Confirm Email", `go to link http://localhost:3000/api/verify-email/${verificationToken}`)

      // Create a new User instance
      const user = new User({ firstName, lastName, email, password, verificationToken });
       
  
      await user.save();
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async verifyEmail(req: Request, res: Response): Promise<void> {
    const verifyResult = await UserService.verifyEmail(req.params.token);
    res.status(verifyResult.code).send(verifyResult.message);
  }
}

export default new UserController();
