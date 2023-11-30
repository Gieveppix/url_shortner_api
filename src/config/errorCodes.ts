import { ErrorCodeMap, HttpStatusCode } from "../types";

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