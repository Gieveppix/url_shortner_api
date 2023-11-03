import supertest from 'supertest';
// import { Express, Request, Response } from 'express'; // Import the Request and Response types from Express
import { app } from '../../server'; // Replace with the path to your Express app
// import { authenticate } from '../../src/middleware'; // Replace with the path to your authentication middleware

const request = supertest(app);

describe('Authentication Middleware', () => {
  it('should return a 401 status code when no token is provided', async () => {
    const response = await request.get('/api/ping'); // Replace with your protected route
    expect(response.status).toBe(401);
    expect(response.text).toBe('Access denied. No token provided.');
  });

  it('should return a 400 status code when an invalid token is provided', async () => {
    const response = await request
      .get('/api/ping')
      .set('Authorization', 'Bearer invalid_token');
    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid token.');
  });

  it('should set the user in the request object when a valid token is provided', async () => {
    const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTNmYjRiNzhkYzQzOWI5MmQwZjYxOGUiLCJlbWFpbCI6InByb2JhQGdtYWlsLmNvbSIsImlhdCI6MTY5ODk5OTMyMiwiZXhwIjoxNjk5NjA0MTIyfQ.nlmZ3xxIn1zZPZfjogENMZBwNKfuT68r4Thzhz-_AlQ'; // Replace with a valid token for testing
    const response = await request
      .get('/api/ping')
      .set('Authorization', `Bearer ${validToken}`);
    expect(response.status).toBe(200); 
    expect(response.text).toBe('pong')

  });
});
