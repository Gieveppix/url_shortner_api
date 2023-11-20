import { ProcessVariables } from '../types/config';
import { getConfig } from './get-config';

export const config = getConfig(process.env as unknown as ProcessVariables);

export { connectDB, IUser, User } from "./db"