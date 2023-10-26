import {
  Config,
  Environment,
  ProcessVariables,
} from '../types/config.type.js';
import { getLocalConfig } from './get-local.config';
import { getTestConfig } from './get-test.config';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export function getConfig(processVariables: ProcessVariables): Config {
  const environment: Environment = processVariables.ENV || 'local';
  switch (environment) {
    case 'local':
      return getLocalConfig(processVariables);
    case 'test':
      return getTestConfig(processVariables)
  }
}