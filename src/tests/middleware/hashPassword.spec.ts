import { CallbackWithoutResultAndOptionalError } from 'mongoose';
import bcrypt from 'bcrypt';
import { IUser } from '../../types';
import { hash } from '../../models/utils/hashPassword';

describe('hash', () => {
  it('should hash the password if it is modified', async () => {
   
    const user: Partial<IUser> = {
      isModified: jest.fn().mockReturnValue(true), 
      password: 'plaintextpassword', 
    };
  
    const next: CallbackWithoutResultAndOptionalError = jest.fn();
   
    jest.spyOn(bcrypt, 'genSalt').mockImplementation(async () => 'salt');
    jest.spyOn(bcrypt, 'hash').mockImplementation(async () => 'hashedPassword');
  
    await hash(user as IUser, next);

    if (user.isModified) {
      expect(user.isModified('password')).toBe(true);
    }
    expect(next).toHaveBeenCalled();
  });
  
  it('should not hash the password if it is not modified', async () => {
    const user: Partial<IUser> = {
      isModified: jest.fn().mockReturnValue(false), 
      password: 'plaintextpassword', 
    };

    const next: CallbackWithoutResultAndOptionalError = jest.fn();
   
    jest.spyOn(bcrypt, 'genSalt').mockImplementation(async () => {
      throw new Error('Should not be called');
    });
    jest.spyOn(bcrypt, 'hash').mockImplementation(async () => {
      throw Error('Should not be called');
    });

    await hash(user as IUser, next); 

    if (user.isModified) {
      expect(user.isModified('password')).toBe(false);
    }
    expect(next).toHaveBeenCalled();
  });
});
