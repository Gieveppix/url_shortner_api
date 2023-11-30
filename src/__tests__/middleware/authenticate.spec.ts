import supertest from 'supertest';
import { app } from '../../server';

const request = supertest(app);

describe('Authentication Middleware', () => {
  it('should return a 401 status code when no token is provided', async () => {
    // Has to be a protected route
    const response = await request.get('/api/ping');
    expect(response.status).toBe(401);
    expect(response.text).toBe('{\"status\":\"error\",\"code\":401,\"message\":\"Access denied. No token provided or the provided token is not valid.\",\"cause\":\"invalid-token\"}');
  });

  it('should return a 401 status code when an invalid token is provided', async () => {
    const response = await request
      .get('/api/ping')
      .set('Authorization', 'Bearer invalid_token');
    expect(response.status).toBe(401);
    expect(response.text).toBe('{\"status\":\"error\",\"code\":401,\"message\":\"Access denied. No token provided or the provided token is not valid.\",\"cause\":\"invalid-token\"}');
  });

  // it('should set the user in the request object when a valid token is provided', async () => {
  //   // If it fails, chances are that the token has expired
  //   const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTU3NWI0OTFiMDM4MmQwYWE1NjM5ZDciLCJlbWFpbCI6InByb2JhMTZAZ21haWwuY29tIiwiaWF0IjoxNzAwNzQ3MTc3LCJleHAiOjE3MDA3NDc3ODF9.-MSHnKqZ2xNnbtPwMEGm24cTyx2IWCwdeVjryjh-mEw';
  //   const response = await request
  //     .get('/api/ping')
  //     .set('Authorization', `Bearer ${validToken}`);
  //   expect(response.status).toBe(200); 
  //   expect(response.text).toBe('pong')

  // });
});
