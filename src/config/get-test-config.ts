import { Config, ProcessVariables } from "../types"
import dotenv from 'dotenv';

dotenv.config();

export function getTestConfig(processVariables: ProcessVariables): Config {
  return {
    port: processVariables.TEST_PORT,
    environment: 'test',
    jwtSecret: processVariables.JWT_SECRET,
    jwtExpiryInSeconds: processVariables.JWT_EXPIRY_IN_SECONDS,
    logLevel: processVariables.LOG_LEVEL ?? 'info',
    mongoURI: processVariables.MONGO_URI
  };
}