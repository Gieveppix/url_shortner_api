import { createRules, editRules } from "./rules";
import { HandleValidationErrors, handleValidationErrors } from "../../middleware";

class UrlValidation {
  private addValidationMiddleware(validationArray: HandleValidationErrors[]): HandleValidationErrors[] {
    return [...validationArray, handleValidationErrors];
  }
  
  create: HandleValidationErrors[] = this.addValidationMiddleware(createRules);
  
  edit: HandleValidationErrors[] = this.addValidationMiddleware(editRules);
}

export default new UrlValidation();