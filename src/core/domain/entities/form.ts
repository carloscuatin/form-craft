/**
 * Domain Entity - Form
 * Represents a form with its fields configuration
 */

import { FieldType } from '../value-objects/field-types';

/** A single option for select-type fields */
export interface FieldOption {
  id: string;
  label: string;
}

/** A single field in a form */
export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: FieldOption[];
}

/** The Form domain entity */
export interface Form {
  id: string;
  userId: string;
  title: string;
  description: string;
  fields: FormField[];
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/** Form with response count (for dashboard listing) */
export interface FormWithResponseCount extends Form {
  responseCount: number;
}
