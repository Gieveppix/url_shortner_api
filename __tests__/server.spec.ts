import request from 'supertest';

describe('Test server.ts', () => {
  it('Ping route', async () => {
    const response = await request((globalThis as any).appInstance).get('/ping');
    expect(response.status).toBe(200);
    expect(response.text).toBe('pong');
  });
});
