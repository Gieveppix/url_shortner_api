import { app, server } from '../src/server';
import { afterAll } from '@jest/globals';

// Define a function to close the server
async function closeServer(): Promise<void> {
  return new Promise((resolve) => {
    // Close your server here
    server.close(() => {
      resolve();
    });
  });
}

// Share the common app instance and server with your test files
(globalThis as any).appInstance = app

afterAll(async () => {
  await closeServer();
});
