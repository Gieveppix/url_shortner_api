import { loginRules, registerRules } from "./rules";
import { HandleValidationErrors, handleValidationErrors } from "../../middleware";

class UserValidation {
  private addValidationMiddleware(validationArray: HandleValidationErrors[]): HandleValidationErrors[] {
    return [...validationArray, handleValidationErrors];
  }
  
  login: HandleValidationErrors[] = this.addValidationMiddleware(loginRules);
  
  register: HandleValidationErrors[] = this.addValidationMiddleware(registerRules);
}

export default new UserValidation();