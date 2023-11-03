import express from 'express';
import UserController from "../controller/user.controller"
import UserValidation from '../validation/user';
import { authenticate } from '../middleware/authentication';

export const userRoute = express.Router({ mergeParams: true });

userRoute.post('/auth/register', UserValidation.register, UserController.register);
userRoute.post('/auth/login', UserValidation.login, UserController.login)
userRoute.get('/verify-email/:token', authenticate, UserController.verifyEmail);