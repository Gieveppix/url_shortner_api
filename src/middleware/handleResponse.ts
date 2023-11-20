import { Response } from "express";
import { Document } from "mongoose";
import { ApiResponse, HttpStatusCode } from "../types/response";

export function returnBadRequestIfNull<T>(value: Document<T> | null, message: string): ApiResponse | null {
  if (!value) {
    return {
      status: 'error',
      code: HttpStatusCode.BadRequest,
      message,
      cause: 'not-found',
    };
  }
  return null;
}

export function returnNotFoundIfNull<T>(value: Document<T> | null, message: string): ApiResponse | null {
  if (!value) {
    return {
      status: 'error',
      code: HttpStatusCode.NotFound,
      message,
      cause: 'not-found',
    };
  }
  return null;
}

export function returnUnauthorizedIfNotEqual(value: string | undefined, userId: string | undefined): ApiResponse | null {
  if (value !== userId) {
    return {
      status: 'error',
      code: HttpStatusCode.Unauthorized,
      message: 'Permission denied',
      cause: 'permission-denied',
    };
  }
  return null;
}

export function handleResponse<T extends ApiResponse>(response: T | void, res: Response): void {
  if (response && 'code' in response) {
    res.status((response as any).code).send(response);
  } else {
    console.log(response)
    res.status(HttpStatusCode.InternalServerError).send('Internal_HANDLE_RESPONSE');
  }
}