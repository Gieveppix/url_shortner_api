import { pino } from 'pino';
import { pinoHttp } from 'pino-http';

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
  level: process.env.LOG_LEVEL || 'info',
  serializers: {
    err: pino.stdSerializers.err, // serialize Error objects
  },
  // redact: ['PORT'],
});

const httpLogger = pinoHttp({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
  logger: logger,
});

export { logger, httpLogger };