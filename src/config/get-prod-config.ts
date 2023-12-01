import { Config, ProcessVariables } from '../types';
import dotenv from 'dotenv';

dotenv.config();

export function getProductionConfig(processVariables: ProcessVariables): Config {
  return {
    port: processVariables.PORT,
    environment: 'production',
    logLevel: processVariables.LOG_LEVEL ?? 'info',
    jwtSecret: processVariables.JWT_SECRET,
    jwtExpiryInSeconds: processVariables.JWT_EXPIRY_IN_SECONDS,
    mongoURI: processVariables.MONGO_URI,
    mongoURIProd: processVariables.MONGO_URI_PROD,
    transportService: processVariables.TRANSPORT_SERVICE,
    transportHost: processVariables.TRANSPORT_HOST,
    transportPort: processVariables.TRANSPORT_PORT,
    transportSecure: processVariables.TRANSPORT_SECURE,
    transportAuthUser: processVariables.TRANSPORT_AUTH_USER,
    transportAuthPass: processVariables.TRANSPORT_AUTH_PASS,
    mailOptionFrom: processVariables.MAIL_OPTIONS_FROM
  };
}