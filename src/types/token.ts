import { Document } from "mongoose";
import { IUser } from "./user";

export interface IToken extends Document {
  jwt: string;
  createdBy: IUser['_id'];
  isInvalidated?: boolean;
  expiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date | null;
}