import { Config, ProcessVariables } from "../types/config.type"
import dotenv from 'dotenv';

dotenv.config();

export function getTestConfig(processVariables: ProcessVariables): Config {
  return {
    port: process.env.TEST_PORT,
    environment: 'test',
    logLevel: processVariables.LOG_LEVEL ?? 'info',
  };
}