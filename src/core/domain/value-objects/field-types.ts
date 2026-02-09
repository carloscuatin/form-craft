/**
 * Value Objects - Field Types
 * Define los tipos de campo soportados por el form builder
 */

export const FIELD_TYPES = {
  SHORT_TEXT: 'short_text',
  LONG_TEXT: 'long_text',
  NUMBER: 'number',
  DATE: 'date',
  SINGLE_SELECT: 'single_select',
  MULTI_SELECT: 'multi_select',
} as const;

export type FieldType = (typeof FIELD_TYPES)[keyof typeof FIELD_TYPES];

export const FIELD_TYPE_LABELS: Record<FieldType, string> = {
  [FIELD_TYPES.SHORT_TEXT]: 'Texto corto',
  [FIELD_TYPES.LONG_TEXT]: 'Texto largo',
  [FIELD_TYPES.NUMBER]: 'Número',
  [FIELD_TYPES.DATE]: 'Fecha',
  [FIELD_TYPES.SINGLE_SELECT]: 'Selección única',
  [FIELD_TYPES.MULTI_SELECT]: 'Selección múltiple',
};

export const FIELD_TYPE_ICONS: Record<FieldType, string> = {
  [FIELD_TYPES.SHORT_TEXT]: 'Type',
  [FIELD_TYPES.LONG_TEXT]: 'AlignLeft',
  [FIELD_TYPES.NUMBER]: 'Hash',
  [FIELD_TYPES.DATE]: 'Calendar',
  [FIELD_TYPES.SINGLE_SELECT]: 'CircleDot',
  [FIELD_TYPES.MULTI_SELECT]: 'CheckSquare',
};

/** Checks if a field type supports options (select fields) */
export function isSelectFieldType(type: FieldType): boolean {
  return (
    type === FIELD_TYPES.SINGLE_SELECT || type === FIELD_TYPES.MULTI_SELECT
  );
}
