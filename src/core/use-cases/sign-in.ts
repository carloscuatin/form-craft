/**
 * Use Case - Sign In
 * Authenticates an existing user
 */

import { User } from '../domain/entities/user';
import { AuthRepository, SignInDTO } from '../domain/ports/auth-repository';

/** The SignInUseCase use case */
export class SignInUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(dto: SignInDTO): Promise<User> {
    return this.authRepository.signIn(dto);
  }
}
