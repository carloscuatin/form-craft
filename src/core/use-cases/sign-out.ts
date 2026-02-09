/**
 * Use Case - Sign Out
 * Ends the current user session
 */

import { AuthRepository } from '../domain/ports/auth-repository';

export class SignOutUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(): Promise<void> {
    return this.authRepository.signOut();
  }
}
