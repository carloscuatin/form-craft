/**
 * Form Mapper
 * Transforms between domain entities and database records
 */

import {
  Form,
  FormWithResponseCount,
  FormField,
} from '@/core/domain/entities/form';

/** Raw form row from Supabase */
export interface FormRow {
  id: string;
  user_id: string;
  title: string;
  description: string;
  fields: FormField[];
  published: boolean;
  created_at: string;
  updated_at: string;
}

/** Form row with response count from RPC */
export interface FormRowWithCount extends FormRow {
  response_count: number;
}

export class FormMapper {
  static toDomain(row: FormRow): Form {
    return {
      id: row.id,
      userId: row.user_id,
      title: row.title,
      description: row.description,
      fields: row.fields,
      published: row.published,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }

  static toDomainWithCount(row: FormRowWithCount): FormWithResponseCount {
    return {
      ...FormMapper.toDomain(row),
      responseCount: Number(row.response_count),
    };
  }

  static toPersistence(form: Partial<Form>) {
    const result: Record<string, unknown> = {};
    if (form.userId !== undefined) result.user_id = form.userId;
    if (form.title !== undefined) result.title = form.title;
    if (form.description !== undefined) result.description = form.description;
    if (form.fields !== undefined) result.fields = form.fields;
    if (form.published !== undefined) result.published = form.published;
    return result;
  }
}
