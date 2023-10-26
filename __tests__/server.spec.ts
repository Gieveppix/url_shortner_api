import { defineTestENV } from './testHelpers';
defineTestENV()

import request from 'supertest';
import { app, server } from '../src/server';

describe('Test server.ts', () => {
  it('Ping route', async () => {
    const response = await request(app).get('/ping');
    expect(response.status).toBe(200);
    expect(response.text).toBe('pong');
  });

  afterAll((done) => {
    // Close the server after all tests are done
    server.close(done);
  });
});
