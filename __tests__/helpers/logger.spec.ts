import { logger } from '../../src/helpers/logger.helper';
// import { mock, when, anything } from 'ts-mockito';
// import { IncomingMessage, ServerResponse } from 'http';

describe('Logger Configuration', () => {
  it('should configure the logger with the expected log level', () => {
    expect(logger.level).toBe(process.env.LOG_LEVEL || 'info');
  });
});
