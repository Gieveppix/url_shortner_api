import { errorCode } from '../config/errorCodes';
import { ErrorName, ResponseError } from '../types';

class ErrorService {
  private req?: any;
  private res?: any;

  constructor(req?: any, res?: any) {
    this.req = req;
    this.res = res;
  }

  private createError(error: ErrorName | null): ResponseError {
    const defaultError: ResponseError = errorCode.INTERNAL_SERVER_ERROR;

    if (typeof error === 'string') {
      const errorCode: ResponseError | null = this.getErrorFromCode(error as ErrorName);
      return errorCode || defaultError;
    }
    return defaultError;
  }

  private getErrorFromCode(code: ErrorName): ResponseError | null {
    const mappedError = errorCode[code];
    return mappedError || null;
  }
   
  format(error: ErrorName | null): ResponseError {
    const errorResponse = this.createError(error);

    if (this.req && this.res) {
      this.res.status(errorResponse.code).json({
        status: errorResponse.status,
        code: errorResponse.code,
        message: errorResponse.message,
        cause: errorResponse.cause,
      });
    }

    return errorResponse;
  }
   
  isPredefinedError(error: any): error is ErrorName {
    return Object.keys(errorCode).includes(error);
  }
}

export default new ErrorService;
