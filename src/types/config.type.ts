import { Level } from "pino";

export type Environment =
  // The service running in a production cluster available for customers
  | 'production'
  // The service running in test environment
  | 'test'
  // The service running locally on a development machine
  | 'local';

export interface Config {
  port: string | undefined;
  environment: Environment;
  logLevel: Level;
}

export interface ProcessVariables {
  PORT?: string;
  ENV?: Environment;
  LOG_LEVEL?: Level;
}