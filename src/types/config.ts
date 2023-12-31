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
  jwtSecret: string,
  jwtExpiryInSeconds: number,
  mongoURI: string
  mongoURIProd?: string,
  transportService?: string
  transportHost?: string
  transportPort?: number
  transportSecure?: boolean
  transportAuthUser?: string
  transportAuthPass?: string
  mailOptionFrom?: string
}

export interface ProcessVariables {
  PORT?: string;
  TEST_PORT?: string
  ENV?: Environment;
  LOG_LEVEL?: Level;
  JWT_SECRET: string,
  JWT_EXPIRY_IN_SECONDS: number;
  MONGO_URI: string,
  MONGO_URI_PROD?: string,
  TRANSPORT_SERVICE?: string
  TRANSPORT_HOST?: string
  TRANSPORT_PORT?: number
  TRANSPORT_SECURE?: boolean
  TRANSPORT_AUTH_USER?: string
  TRANSPORT_AUTH_PASS?: string
  MAIL_OPTIONS_FROM?: string
}