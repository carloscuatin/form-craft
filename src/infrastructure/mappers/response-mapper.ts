/**
 * Response Mapper
 * Transforms between domain entities and database records
 */

import { FormResponse, Answers } from '@/core/domain/entities/response';

/** Raw response row from Supabase */
export interface ResponseRow {
  id: string;
  form_id: string;
  answers: Answers;
  submitted_at: string;
}

export class ResponseMapper {
  static toDomain(row: ResponseRow): FormResponse {
    return {
      id: row.id,
      formId: row.form_id,
      answers: row.answers,
      submittedAt: new Date(row.submitted_at),
    };
  }

  static toPersistence(response: { formId: string; answers: Answers }) {
    return {
      form_id: response.formId,
      answers: response.answers,
    };
  }
}
