import jwt, { JwtPayload } from 'jsonwebtoken';
import { generateToken } from '../../middleware';
import { IUser } from '../../types';
import { config } from '../../config';

// The expect is extended because it behaves weird on its own. This is a more straight forward implementation of the expect.toBeCloseTo assertion
expect.extend({
  toBeCloseTo(received: number, expected: number, precision: number) {
    const pass = Math.abs(received - expected) < precision;
    return {
      pass,
      message: () =>
        `expected ${received} to be close to ${expected} with precision ${precision}`,
    };
  },
});

describe('generateToken', () => {
  it('should generate a valid JWT token', () => {
    const user: Pick<IUser, "_id" | "email"> = {
      _id: "123",
      email: 'example@example.com',
    };
    const token = generateToken(user);

    expect(typeof token).toBe('string');
    expect(token).not.toBeNull();
  });

  it('should include the user data in the decoded token', () => {
    const user: Pick<IUser, "_id" | "email"> = {
      _id: "123",
      email: 'example@example.com',
    };
    const token = generateToken(user);

    const decodedToken = jwt.verify(token, config.jwtSecret) as JwtPayload; 

    expect(decodedToken).toBeDefined();
    expect(decodedToken._id).toEqual(user._id);
    expect(decodedToken.email).toEqual(user.email);
  });

  it('should set the token expiration to 7 days', () => {
    const user: Pick<IUser, "_id" | "email"> = {
      _id: "123",
      email: 'example@example.com',
    };
    const token = generateToken(user);

    const decodedToken = jwt.verify(token, config.jwtSecret, { ignoreExpiration: false }) as JwtPayload; 
    const now = Date.now();
    const expiration = decodedToken.exp! * 1000;
    const expectedExpiration = 7 * 24 * 60 * 60; // 7 days
    const tolerance = 86400; // 1 day

    expect(expiration! - now).toBeCloseTo(expectedExpiration, tolerance);
  });
  
});
