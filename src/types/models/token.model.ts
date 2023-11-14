import { Document, Model, model, Schema } from 'mongoose';
import { IUser } from './user.model';

export interface IToken extends Document {
  jwt: string;
  createdBy: IUser['_id'];
  isInvalidated?: boolean;
  expiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date | null;
}

const tokenSchema = new Schema<IToken>({
  jwt: {
    type: String,
    required: true,
  },
  createdBy: {
    type: String,
    ref: 'User',
    required: true,
  },
  isInvalidated: {
    type: Boolean,
    default: false,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

tokenSchema.set('timestamps', true);

export const Token: Model<IToken> = model('Token', tokenSchema);
