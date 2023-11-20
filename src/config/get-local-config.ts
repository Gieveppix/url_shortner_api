import { Config, ProcessVariables } from '../types/config';
import dotenv from 'dotenv';

dotenv.config();

export function getLocalConfig(processVariables: ProcessVariables): Config {
  return {
    port: processVariables.PORT,
    environment: 'local',
    logLevel: processVariables.LOG_LEVEL ?? 'info',
    jwtSecret: processVariables.JWT_SECRET,
    jwtExpiryInSeconds: processVariables.JWT_EXPIRY_IN_SECONDS,
    mongoURI: processVariables.MONGO_URI,
    transportHost: processVariables.TRANSPORT_HOST,
    transportPort: processVariables.TRANSPORT_PORT,
    transportAuthUser: processVariables.TRANSPORT_AUTH_USER,
    transportAuthPass: processVariables.TRANSPORT_AUTH_PASS,
    mailOptionFrom: processVariables.MAIL_OPTIONS_FROM
  };
}