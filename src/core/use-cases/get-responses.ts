/**
 * Use Case - Get Responses
 * Retrieves all responses for a form
 */

import { FormResponse } from '../domain/entities/response';
import { ResponseRepository } from '../domain/ports/response-repository';

export class GetResponsesUseCase {
  constructor(private readonly responseRepository: ResponseRepository) {}

  async execute(formId: string): Promise<FormResponse[]> {
    return this.responseRepository.findByFormId(formId);
  }
}
