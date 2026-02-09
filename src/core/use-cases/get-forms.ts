/**
 * Use Case - Get Forms
 * Lists all forms for a user with response counts
 */

import { FormWithResponseCount } from '../domain/entities/form';
import { FormRepository } from '../domain/ports/form-repository';

export class GetFormsUseCase {
  constructor(private readonly formRepository: FormRepository) {}

  async execute(userId: string): Promise<FormWithResponseCount[]> {
    return this.formRepository.findAllByUserId(userId);
  }
}
