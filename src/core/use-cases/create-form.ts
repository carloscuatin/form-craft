/**
 * Use Case - Create Form
 * Creates a new form for a user
 */

import { Form } from '../domain/entities/form';
import { FormRepository, CreateFormDTO } from '../domain/ports/form-repository';

export class CreateFormUseCase {
  constructor(private readonly formRepository: FormRepository) {}

  async execute(dto: CreateFormDTO): Promise<Form> {
    if (!dto.title.trim()) {
      throw new Error('El título del formulario es obligatorio');
    }

    return this.formRepository.create({
      ...dto,
      title: dto.title.trim(),
      description: dto.description.trim(),
    });
  }
}
