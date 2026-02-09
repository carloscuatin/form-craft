/**
 * Port - Form Repository
 * Interface that defines the contract for form persistence
 */

import { Form, FormField, FormWithResponseCount } from '../entities/form';

/** Input for creating a new form */
export interface CreateFormDTO {
  userId: string;
  title: string;
  description: string;
  fields: FormField[];
  published?: boolean;
}

/** Input for updating an existing form */
export interface UpdateFormDTO {
  title?: string;
  description?: string;
  fields?: FormField[];
  published?: boolean;
}

export interface FormRepository {
  /** Create a new form */
  create(dto: CreateFormDTO): Promise<Form>;

  /** Find a form by ID (for authenticated users - their own forms) */
  findById(id: string): Promise<Form | null>;

  /** Find a published form by ID (for public access) */
  findPublishedById(id: string): Promise<Form | null>;

  /** List all forms for a user with response counts */
  findAllByUserId(userId: string): Promise<FormWithResponseCount[]>;

  /** Update a form */
  update(id: string, dto: UpdateFormDTO): Promise<Form>;

  /** Delete a form */
  delete(id: string): Promise<void>;
}
