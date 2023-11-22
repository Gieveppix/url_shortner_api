import { Document } from "mongoose";

export interface IUser extends Document {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: Boolean;
  verificationToken: string;
  password: string;
  failedLoginAttempts: number,
  accountLocked: boolean,
  lockedUntil: Date | null,
  createdAt?: Date;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
}