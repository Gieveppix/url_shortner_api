import { Config, ProcessVariables } from '../types/config.type';
import dotenv from 'dotenv';

dotenv.config();

export function getLocalConfig(processVariables: ProcessVariables): Config {
  return {
    port: process.env.PORT,
    environment: 'local',
    logLevel: processVariables.LOG_LEVEL ?? 'info',
  };
}