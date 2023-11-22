import { Model, model, Schema } from 'mongoose';
import { IUser } from '../types/user';
import { hash } from '../middleware'

// User schema
const userSchema = new Schema<IUser>({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: {
    type: String,
    require: true
  },
  password: {
    type: String,
    required: true,
  },
  failedLoginAttempts: { 
    type: Number, 
    default: 0 
  },
  accountLocked: { 
    type: Boolean, 
    default: false 
  },
  lockedUntil: { 
    type: Date 
  },
  deletedAt: {
    type: Date,
    default: null,
  },
});

// Adds createdAt, updatedAt
userSchema.set('timestamps', true);

// Hashing the password
userSchema.pre('save', 
async function(this: IUser,next) { 
  await hash(this, next) 
});

// Won't return fields with deletedAt true 
userSchema.pre('find', function() {
  this.where({ deletedAt: null });
});

// Won't return fields with deletedAt true 
userSchema.pre('findOne', function() {
  this.where({ deletedAt: null });
});

// Define a virtual property for the full name
userSchema.virtual('full_name').get(function (this: IUser) {
  return `${this.firstName} ${this.lastName}`;
});

// Create the User model
export const User: Model<IUser> = model('User', userSchema);
