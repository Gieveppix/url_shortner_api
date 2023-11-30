import { handleResponse } from "../handleResponse";
import { ErrorName } from "../types";
import { logger } from "./logger";
import ErrorService from "../service/error";

export function HandleController(_target: any, key: string | symbol, descriptor: PropertyDescriptor) {
  const fn = descriptor.value;

  descriptor.value = async function (...args: any[]) {
    try {
      const result = await fn.bind(this, ...args)();
      handleResponse(result, args[1]) // args[1] is the res from the controller
    } catch (e) {
      logger.error(`Error propagating from controller: ${String(key)}`);
      handleResponse(ErrorService.format(e as ErrorName), args[1]) // args[1] is the res from the controller
    }
  };
}

export function HandleService(_target: any, key: string | symbol, descriptor: PropertyDescriptor) {
const fn = descriptor.value;

descriptor.value = async function (...args: any[]) {
  try {
    return await fn.bind(this, ...args)();
  } catch (e) {
    logger.error(`Error propagating from service: ${String(key)} ${e} => ${ErrorService.isPredefinedError(e)}`);
    if (ErrorService.isPredefinedError(e)) {
      throw e
    } else {
      logger.error(`\n::::::::::::UNEXPECTED ERROR::::::::::::\n\n${e}\n\n`);
      throw "SOMETHING_WENT_WRONG"
    }
  }
};
}