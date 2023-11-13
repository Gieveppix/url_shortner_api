import { Document, Model, model, Schema } from 'mongoose';
import { IUser } from './user.model';

// Interface for the JWT document
export interface IJWT extends Document {
  jwt: string;
  createdBy: IUser['_id'];
  isInvalidated?: boolean;
  expiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date | null;
}

const jwtSchema = new Schema<IJWT>({
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

jwtSchema.set('timestamps', true);

export const JWT: Model<IJWT> = model('JWT', jwtSchema);
