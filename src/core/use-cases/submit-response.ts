/**
 * Use Case - Submit Response
 * Submits a response to a published form with validation
 */

import { FormRepository } from '../domain/ports/form-repository';
import {
  ResponseRepository,
  SubmitResponseDTO,
} from '../domain/ports/response-repository';
import { isSelectFieldType } from '../domain/value-objects/field-types';

export class SubmitResponseUseCase {
  constructor(
    private readonly formRepository: FormRepository,
    private readonly responseRepository: ResponseRepository,
  ) {}

  async execute(dto: SubmitResponseDTO): Promise<void> {
    // Verify form exists and is published
    const form = await this.formRepository.findPublishedById(dto.formId);
    if (!form) {
      throw new Error('Formulario no encontrado o no está publicado');
    }

    // Validate required fields
    for (const field of form.fields) {
      const answer = dto.answers[field.id];
      if (field.required) {
        if (answer === null || answer === undefined || answer === '') {
          throw new Error(`El campo "${field.label}" es obligatorio`);
        }
        if (Array.isArray(answer) && answer.length === 0) {
          throw new Error(
            `El campo "${field.label}" requiere al menos una selección`,
          );
        }
      }

      // Validate select fields have valid options
      if (answer && isSelectFieldType(field.type) && field.options) {
        const validOptionIds = field.options.map((o) => o.id);
        const answerArray = Array.isArray(answer) ? answer : [answer];
        for (const val of answerArray) {
          if (!validOptionIds.includes(val as string)) {
            throw new Error(`Opción inválida para el campo "${field.label}"`);
          }
        }
      }
    }

    await this.responseRepository.create(dto);
  }
}
