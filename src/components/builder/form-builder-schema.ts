/**
 * Form Builder Schema — UI layer
 * Defines the Zod schema for the form builder component.
 * Validates title, description, fields, and publication status.
 */

import { z } from 'zod';

import {
  FieldType,
  FIELD_TYPES,
} from '@/core/domain/value-objects/field-types';

const fieldOptionSchema = z.object({
  id: z.string(),
  label: z.string(),
});

const fieldTypeSchema = z.enum(
  Object.values(FIELD_TYPES) as [FieldType, ...FieldType[]],
);

const formFieldSchema = z.object({
  id: z.string(),
  type: fieldTypeSchema,
  label: z.string(),
  placeholder: z.string().optional(),
  required: z.boolean(),
  options: z.array(fieldOptionSchema).optional(),
});

export const formBuilderSchema = z.object({
  title: z.string().min(1, 'El título es obligatorio'),
  description: z.string(),
  fields: z.array(formFieldSchema),
  published: z.boolean(),
});

export type FormBuilderData = z.infer<typeof formBuilderSchema>;
