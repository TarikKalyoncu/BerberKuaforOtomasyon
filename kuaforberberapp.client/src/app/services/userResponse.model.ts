import { User } from "../models/user.model";


export interface UserResponse {
  id: number;         // User ID
  fullName: string;   // User's full name
  email: string;      // User's email address
  role: string;       // User's role (e.g., "Customer", "Admin")
  exp: number;        // Expiration time of the token (Unix timestamp)
  iat: number;        // Issued at time (Unix timestamp)
  nbf: number;        // Not before time (Unix timestamp)
  iss: string;        // Issuer of the token
  aud: string;        // Audience of the token
}

