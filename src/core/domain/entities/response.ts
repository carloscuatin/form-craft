/**
 * Domain Entity - Response
 * Represents a submitted response to a form
 */

/** Answer values keyed by field ID */
export type AnswerValue = string | string[] | number | null;

/** Answers object keyed by field ID */
export interface Answers {
  [fieldId: string]: AnswerValue;
}

/** The Response domain entity */
export interface FormResponse {
  id: string;
  formId: string;
  answers: Answers;
  submittedAt: Date;
}
