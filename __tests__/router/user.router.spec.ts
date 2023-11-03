import request from 'supertest';

describe('User Router', () => {
  it('should log in a user', async () => {
    const userData = {
      email: "proba@gmail.com",
      password: "pass"
    };

    const response = await request((globalThis as any).appInstance)
      .post('/api/auth/login')
      .send(userData);

      expect(response.status).toBe(200); // Adjust the expected status code
    // Add more assertions as needed to test the response data.
  });
});
