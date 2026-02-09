/**
 * Port - Auth Repository
 * Interface that defines the contract for authentication
 */

import { User } from '../entities/user';

/** Input for registering a new user */
export interface SignUpDTO {
  name: string;
  email: string;
  password: string;
}

/** Input for authenticating an existing user */
export interface SignInDTO {
  email: string;
  password: string;
}

/** The AuthRepository port */
export interface AuthRepository {
  /** Register a new user */
  signUp(dto: SignUpDTO): Promise<User>;

  /** Authenticate an existing user */
  signIn(dto: SignInDTO): Promise<User>;

  /** End the current session */
  signOut(): Promise<void>;

  /** Get the currently authenticated user, or null */
  getUser(): Promise<User | null>;
}
