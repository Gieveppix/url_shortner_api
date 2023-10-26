import { pino } from 'pino';
import { pinoHttp } from 'pino-http';

const logger = pino({
  transport: {
    target: 'pino-pretty'
  },
  level: process.env.LOG_LEVEL || 'info',
  serializers: {
    err: pino.stdSerializers.err, // serialize Error objects
  },
  // redact: ['PORT'],
});

const httpLogger = pinoHttp({
  transport: {
    target: 'pino-pretty'
  },
  logger: logger,
});

export { logger, httpLogger };