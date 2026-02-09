/**
 * Use Case - Delete Form
 * Deletes a form and its responses
 */

import { FormRepository } from '../domain/ports/form-repository';

export class DeleteFormUseCase {
  constructor(private readonly formRepository: FormRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.formRepository.findById(id);
    if (!existing) {
      throw new Error('Formulario no encontrado');
    }
    return this.formRepository.delete(id);
  }
}
