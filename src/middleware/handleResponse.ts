import { Response } from "express";
import { Document } from "mongoose";
import { ApiResponse, HttpStatusCode } from "../types/response.type";

export function returnNotFoundIfNull<T>(value: Document<T> | null): ApiResponse | null {
  if (!value) {
    return {
      status: 'error',
      code: HttpStatusCode.NotFound,
      message: 'URL not found',
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

export function handleResponse<T extends object>(response: T, res: Response): void {
  if ('code' in response) {
    res.status((response as any).code).send(response);
  } else {
    res.status(HttpStatusCode.InternalServerError).send('Invalid response object');
  }
}