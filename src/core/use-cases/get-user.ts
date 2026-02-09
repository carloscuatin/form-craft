/**
 * Use Case - Get User
 * Retrieves the currently authenticated user
 */

import { User } from '../domain/entities/user';
import { AuthRepository } from '../domain/ports/auth-repository';

/** The GetUserUseCase use case */
export class GetUserUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(): Promise<User | null> {
    return this.authRepository.getUser();
  }
}
