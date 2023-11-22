import { Document } from "mongoose";
import { IUser } from "./user";

export type TokenActions = "emailVerification"

export interface ITokenAction extends Document {
  token: string;
  actionName: TokenActions
  createdBy: IUser['_id'];
  executedAt: Date | null;
  expiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date | null;
}