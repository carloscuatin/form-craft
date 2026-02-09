/**
 * Form Defaults — UI layer
 * Builds default values for react-hook-form initialization.
 * This is a UI concern (react-hook-form needs defaultValues), NOT domain logic.
 */

import { FormField } from '@/core/domain/entities/form';
import { AnswerValue } from '@/core/domain/entities/response';
import { FIELD_TYPES } from '@/core/domain/value-objects/field-types';

/**
 * Builds default values for all form fields.
 * Each field type maps to its proper empty state.
 */
export function buildResponseDefaults(
  fields: FormField[],
): Record<string, AnswerValue> {
  const defaults: Record<string, AnswerValue> = {};

  for (const field of fields) {
    switch (field.type) {
      case FIELD_TYPES.NUMBER:
        defaults[field.id] = null;
        break;
      case FIELD_TYPES.MULTI_SELECT:
        defaults[field.id] = [];
        break;
      default:
        defaults[field.id] = '';
        break;
    }
  }

  return defaults;
}
