import { Model, model, Schema } from 'mongoose';
import { ITokenAction } from '../types';

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
