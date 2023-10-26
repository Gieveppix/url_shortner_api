import { ProcessVariables } from '../types/config.type';
import { getConfig } from '../config/get-config';

export const config = getConfig(process.env as unknown as ProcessVariables);