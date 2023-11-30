import { Response } from "express";
import { ApiResponse, HttpStatusCode } from "./types";

export function handleResponse<T extends ApiResponse>(response: T | void, res: Response): void {
  if (response && 'code' in response) {
    res.status((response as any).code).send(response);
  } else {
    console.log(response)
    res.status(HttpStatusCode.InternalServerError).send('Internal_HANDLE_RESPONSE');
  }
}