/**
 * Use Case - Subscribe to New Responses
 * Subscribes to realtime inserts for a form's responses (browser).
 */

import { FormResponse } from '../domain/entities/response';
import type { ResponseRepository } from '../domain/ports/response-repository';

export class SubscribeToNewResponsesUseCase {
  constructor(private readonly responseRepository: ResponseRepository) {}

  execute(
    formId: string,
    onNewResponse: (response: FormResponse) => void,
  ): () => void {
    return this.responseRepository.subscribe(formId, onNewResponse);
  }
}
