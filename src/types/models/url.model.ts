// src/types/models/url.model.ts
import { Document, Model, model, Schema } from 'mongoose';
import { IUser } from './user.model';

export interface IUrl extends Document {
  originalUrl: string;
  shortCode: string;
  user: IUser['_id'];
  accessCount: number;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date | null;
}

const urlSchema = new Schema<IUrl>({
  originalUrl: {
    type: String,
    required: true,
  },
  shortCode: {
    type: String,
    required: true,
    unique: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  accessCount: {
    type: Number,
    default: 0,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

urlSchema.set('timestamps', true);

export const Url: Model<IUrl> = model('Url', urlSchema);