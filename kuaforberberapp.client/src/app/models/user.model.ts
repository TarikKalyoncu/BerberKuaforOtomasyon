import { Role } from "../enums/role.enum";

export interface User {
  id: number;
  fullName: string;
  email: string;
  password: string;
  role?: Role;  // Kullanıcının rolü
}
