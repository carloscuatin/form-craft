/**
 * Use Case - Sign Up
 * Registers a new user in the system
 */

import { User } from '../domain/entities/user';
import { AuthRepository, SignUpDTO } from '../domain/ports/auth-repository';

/** The SignUpUseCase use case */
export class SignUpUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(dto: SignUpDTO): Promise<User> {
    if (!dto.name.trim()) {
      throw new Error('El nombre es obligatorio');
    }

    return this.authRepository.signUp({
      ...dto,
      name: dto.name.trim(),
    });
  }
}
