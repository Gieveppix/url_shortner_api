import { Request, Response, NextFunction } from "express";
import { ValidationError, validationResult } from "express-validator";
import { HttpStatusCode, ResponseError } from "../types/response";

export type HandleValidationErrors = (req: Request, res: Response, next: NextFunction) => void;

export const handleValidationErrors: HandleValidationErrors = (req: Request, res: Response, next) : void => {
  const validationResultObject = validationResult(req);
  if (!validationResultObject.isEmpty()) {
    const response: ResponseError = {
      status: 'error',
      code: HttpStatusCode.UnprocessableEntity,
      message: validationResultObject.array()[0].msg as ValidationError,
      cause: "unprocessable-entity"
    }

    res.status(response.code).send(response)
    return
  }
  next();
};