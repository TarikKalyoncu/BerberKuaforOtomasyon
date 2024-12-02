import { User } from "../models/user.model";


export interface UserResponse {
  user: User;
  exp: number;
  iat: number;
}
