import { Model, model, Schema } from 'mongoose';
import { IToken } from '../types';

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
