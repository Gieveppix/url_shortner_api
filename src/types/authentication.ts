export interface RequestUser {
  _id: string
  email: string
}

export interface DecodedUser extends RequestUser {
  iat: number;
  exp: number;
}