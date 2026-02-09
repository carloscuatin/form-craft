/**
 * Use Case - Update Form
 * Updates an existing form
 */

import { Form } from '../domain/entities/form';
import { FormRepository, UpdateFormDTO } from '../domain/ports/form-repository';

export class UpdateFormUseCase {
  constructor(private readonly formRepository: FormRepository) {}

  async execute(id: string, dto: UpdateFormDTO): Promise<Form> {
    const existing = await this.formRepository.findById(id);
    if (!existing) {
      throw new Error('Formulario no encontrado');
    }

    return this.formRepository.update(id, {
      ...dto,
      title: dto.title?.trim(),
      description: dto.description?.trim(),
    });
  }
}
