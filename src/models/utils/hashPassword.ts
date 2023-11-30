import { CallbackWithoutResultAndOptionalError } from "mongoose";
import bcrypt from "bcrypt"
import { IUser } from "../../types";

export const hash = async (user: IUser, next: CallbackWithoutResultAndOptionalError) => {
  if (!user.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(user.password, salt);
  user.password = hashedPassword;
  return next();
}