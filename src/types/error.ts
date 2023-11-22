import { ResponseError } from "../types";

export type ErrorName =
  'SOMETHING_WENT_WRONG'
| 'INTERNAL_SERVER_ERROR'
| 'VALIDATION_ERROR'
| 'URL_EXISTS'
| 'ALREADY_REGISTERED'
| 'WRONG_CREDENTIALS' 
| 'ACCOUNT_LOCKED'
| 'INVALID_TOKEN'
| 'PERMISSION_DENIED'
| 'USER_NOT_FOUND'
| 'URL_NOT_FOUND'
| 'VERIFICATION_TOKEN_EXPIRED';

export type ErrorCodeMap = {
  [key in ErrorName]: ResponseError;
};