/**
 * Port - Response Repository
 * Interface that defines the contract for response persistence
 */

import { Answers } from '../entities/response';
import { FormResponse } from '../entities/response';

/** Input for submitting a new response */
export interface SubmitResponseDTO {
  formId: string;
  answers: Answers;
}

export interface ResponseRepository {
  /** Submit a new response */
  create(dto: SubmitResponseDTO): Promise<void>;

  /** Get all responses for a specific form */
  findByFormId(formId: string): Promise<FormResponse[]>;

  /** Count responses for a specific form */
  countByFormId(formId: string): Promise<number>;

  /** Subscribe to new responses for a specific form */
  subscribe(
    formId: string,
    onNewResponse: (response: FormResponse) => void,
  ): () => void;
}
