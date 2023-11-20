import { logger } from "../helpers/logger";
import { HttpStatusCode, ResponseError } from "../types";
import FormatError from "./errorHandler";
import { handleResponse } from "./handleResponse";

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

type ErrorCodeMap = {
  [key in ErrorName]: ResponseError;
};
export const errorCode: ErrorCodeMap = {
  INTERNAL_SERVER_ERROR: {
    status: "error",
    code: HttpStatusCode.InternalServerError,
    message: 'Internal server error',
    cause: 'internal_server_error'
  },
  SOMETHING_WENT_WRONG: {
    status: "error",
    code: HttpStatusCode.InternalServerError,
    message: 'Something went wrong',
    cause: 'something_went_wrong'
  },
  VALIDATION_ERROR: {
    status: "error",
    code: HttpStatusCode.UnprocessableEntity,
    message: 'Unprocessable entity',
    cause: 'unprocessable_entity'
  },
  URL_EXISTS: {
    status: "error",
    code: HttpStatusCode.BadRequest,
    message: 'Url with that short name already exists',
    cause: "bad_request"
  },
  ALREADY_REGISTERED: {
    status: "error",
    code: HttpStatusCode.BadRequest,
    message: 'User already registered',
    cause: "bad_request"
  },
  WRONG_CREDENTIALS: {
    status: 'error',
    code: HttpStatusCode.Unauthorized,
    message: 'Invalid username or password',
    cause: 'unauthorized-error'
  },
  ACCOUNT_LOCKED: {
    status: 'error',
    code: HttpStatusCode.Unauthorized,
    message: 'Account locked. Please try again later.',
    cause: 'account-locked',
  },
  INVALID_TOKEN: {
    status: 'error',
      code: HttpStatusCode.BadRequest,
      message: "Invalid or expired verification token",
      cause: 'not-found',
  },
  PERMISSION_DENIED: {
    status: 'error',
    code: HttpStatusCode.Unauthorized,
    message: 'Permission denied',
    cause: 'permission-denied',
  },
  USER_NOT_FOUND: {
    status: "error",
    code: HttpStatusCode.InternalServerError,
    message: 'Unable to find the associated user',
    cause: "server_error",
  },
  URL_NOT_FOUND: {
    status: "error",
    code: HttpStatusCode.InternalServerError,
    message: 'Unable to find the associated url',
    cause: "server_error",
  },
  VERIFICATION_TOKEN_EXPIRED: {
    status: "error",
    code: HttpStatusCode.InternalServerError,
    message: 'The verification token has expired',
    cause: "server_error",
  },
}

export function isPredefinedError(error: any): error is ErrorName {
  return Object.keys(errorCode).includes(error);
}

export function HandleController(_target: any, key: string | symbol, descriptor: PropertyDescriptor) {
    const fn = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        const result = await fn.bind(this, ...args)();
        handleResponse(result, args[1]) // args[1] is the res from the controller
      } catch (e) {
        const formatError: FormatError = new FormatError();
        logger.error(`Error propagating from controller: ${String(key)}`);
        handleResponse(formatError.format(e as ErrorName), args[1]) // args[1] is the res from the controller
      }
    };
}

export function HandleService(_target: any, key: string | symbol, descriptor: PropertyDescriptor) {
  const fn = descriptor.value;

  descriptor.value = async function (...args: any[]) {
    try {
      return await fn.bind(this, ...args)();
    } catch (e) {
      logger.error(`Error propagating from service: ${String(key)} ${e} => ${isPredefinedError(e)}`);
      if (isPredefinedError(e)) {
        throw e
      } else {
        logger.error(`\n::::::::::::UNEXPECTED ERROR::::::::::::\n\n${e}\n\n`);
        throw "SOMETHING_WENT_WRONG"
      }
    }
  };
}