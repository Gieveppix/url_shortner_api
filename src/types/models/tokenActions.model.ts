import { Document, Model, model, Schema } from 'mongoose';
import { IUser } from './user.model';

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

const tokenActionSchema = new Schema<ITokenAction>({
  token: {
    type: String,
    required: true,
  },
  actionName: {
    type: String,
    required: true
  },
  executedAt: {
    type: Date,
    default: null
  },
  createdBy: {
    type: String,
    ref: 'User',
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

tokenActionSchema.set('timestamps', true);

export const TokenAction: Model<ITokenAction> = model('token_action', tokenActionSchema);
