import type { IUser } from "./models";
import { HttpStatusCode, ResponseError } from "./response.type";

interface IUserLogin extends Omit<IUser, 'password'> {
  token: string;
}

type LoginSuccess = {
  status: 'success';
  code: HttpStatusCode.Ok;
  user: IUserLogin;
};

export type LoginResponse = LoginSuccess | ResponseError 

