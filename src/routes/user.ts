import express from 'express';
import UserController from "../controller/user"
import UserValidation from '../validation/user';
import { authenticate } from '../middleware';

export const userRoute = express.Router({ mergeParams: true });

userRoute.post('/auth/register', UserValidation.register, UserController.register);
userRoute.post('/auth/login', UserValidation.login, UserController.login)
userRoute.post('/auth/logout', authenticate, UserController.logout);
userRoute.get('/auth/verify-email/:token', authenticate, UserController.verifyEmail);
// This route is here if the user does not receive the email
userRoute.post('/auth/verify-email/send', authenticate, UserController.sendEmailAgain);