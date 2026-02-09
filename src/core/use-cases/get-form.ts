/**
 * Use Case - Get Form
 * Retrieves a single form (either for owner or public access)
 */

import { Form } from '../domain/entities/form';
import { FormRepository } from '../domain/ports/form-repository';

export class GetFormUseCase {
  constructor(private readonly formRepository: FormRepository) {}

  /** Get form for its owner (authenticated) */
  async execute(id: string): Promise<Form> {
    const form = await this.formRepository.findById(id);
    if (!form) {
      throw new Error('Formulario no encontrado');
    }
    return form;
  }

  /** Get published form for public access */
  async executePublic(id: string): Promise<Form> {
    const form = await this.formRepository.findPublishedById(id);
    if (!form) {
      throw new Error('Formulario no encontrado o no está publicado');
    }
    return form;
  }
}
