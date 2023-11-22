import { Model, model, Schema } from 'mongoose';
import { IUrl } from '../types/url';

const urlSchema = new Schema<IUrl>({
  urlName: {
    type: String,
    default: "Unnamed Url"
  },
  originalUrl: {
    type: String,
    required: true,
  },
  shortUrl: {
    type: String,
    required: true,
    unique: true,
  },
  accessCount: {
    type: Number,
    default: 0,
  },
  createdBy: {
    type: String,
    ref: 'User',
    required: true,
  },
  deletedAt: {
    type: Date,
    default: null,
  },
});

urlSchema.set('timestamps', true);

// Won't return fields with deletedAt true 
urlSchema.pre('find', function() {
  this.where({ deletedAt: null });
});

// Won't return fields with deletedAt true 
urlSchema.pre('findOne', function() {
  this.where({ deletedAt: null });
});

export const Url: Model<IUrl> = model('Url', urlSchema);