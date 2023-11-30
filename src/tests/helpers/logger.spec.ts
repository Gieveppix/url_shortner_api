import { logger } from '../../utils';

describe('Logger Configuration', () => {
  it('should configure the logger with the expected log level', () => {
    expect(logger.level).toBe(process.env.LOG_LEVEL || 'info');
  });
});
