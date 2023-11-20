import { CallbackWithoutResultAndOptionalError } from "mongoose";
import { IUser } from "../config/db";
import bcrypt from "bcrypt"

export const hash = async (user: IUser, next: CallbackWithoutResultAndOptionalError) => {
  if (!user.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(user.password, salt);
  user.password = hashedPassword;
  return next();
} // TODO Move to helper