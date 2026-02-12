/**
 * Response Schema — UI layer
 * Builds a Zod schema dynamically for client-side form validation.
 * Translates domain field definitions into react-hook-form compatible schemas.
 *
 * Server-side response validation lives in SubmitResponseUseCase.
 */

import { z } from 'zod';

import { FormField } from '@/core/domain/entities/form';
import { FIELD_TYPES } from '@/core/domain/value-objects/field-types';

/**
 * Builds a Zod schema dynamically from form fields.
 * Each field ID becomes a key in the resulting object schema.
 */
export const buildResponseSchema = (fields: FormField[]) => {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const field of fields) {
    shape[field.id] = buildFieldSchema(field);
  }

  return z.object(shape);
};

/** Builds the Zod schema for a single field based on its type and configuration */
export const buildFieldSchema = (field: FormField): z.ZodTypeAny => {
  switch (field.type) {
    case FIELD_TYPES.SHORT_TEXT:
    case FIELD_TYPES.LONG_TEXT:
      return field.required
        ? z.string().min(1, 'Este campo es obligatorio')
        : z.string();

    case FIELD_TYPES.NUMBER:
      if (field.required) {
        return z
          .number()
          .nullable()
          .refine((val): val is number => val !== null, {
            message: 'Este campo es obligatorio',
          });
      }
      return z.number().nullable();

    case FIELD_TYPES.DATE:
      return field.required
        ? z.string().min(1, 'Este campo es obligatorio')
        : z.string();

    case FIELD_TYPES.SINGLE_SELECT:
      return field.required
        ? z.string().min(1, 'Selecciona una opción')
        : z.string();

    case FIELD_TYPES.MULTI_SELECT:
      return field.required
        ? z.array(z.string()).min(1, 'Selecciona al menos una opción')
        : z.array(z.string());

    default:
      return z.unknown();
  }
};

export type ResponseFormValues = z.infer<
  ReturnType<typeof buildResponseSchema>
>;
