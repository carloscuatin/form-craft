import { FormField } from '@/core/domain/entities/form';

import { buildResponseSchema } from '../public/response-schema';
import { buildResponseDefaults } from '../public/form-defaults';

describe('buildResponseSchema', () => {
  it('should require short_text when field is required', () => {
    const fields: FormField[] = [
      { id: 'f1', type: 'short_text', label: 'Name', required: true },
    ];
    const schema = buildResponseSchema(fields);

    expect(() => schema.parse({ f1: '' })).toThrow();
    expect(schema.parse({ f1: 'Carlos' })).toEqual({ f1: 'Carlos' });
  });

  it('should allow empty short_text when field is optional', () => {
    const fields: FormField[] = [
      { id: 'f1', type: 'short_text', label: 'Name', required: false },
    ];
    const schema = buildResponseSchema(fields);

    expect(schema.parse({ f1: '' })).toEqual({ f1: '' });
  });

  it('should require number when field is required', () => {
    const fields: FormField[] = [
      { id: 'f1', type: 'number', label: 'Age', required: true },
    ];
    const schema = buildResponseSchema(fields);

    expect(() => schema.parse({ f1: null })).toThrow();
    expect(schema.parse({ f1: 25 })).toEqual({ f1: 25 });
  });

  it('should allow null number when field is optional', () => {
    const fields: FormField[] = [
      { id: 'f1', type: 'number', label: 'Age', required: false },
    ];
    const schema = buildResponseSchema(fields);

    expect(schema.parse({ f1: null })).toEqual({ f1: null });
  });

  it('should require single_select when field is required', () => {
    const fields: FormField[] = [
      {
        id: 'f1',
        type: 'single_select',
        label: 'Color',
        required: true,
        options: [{ id: 'opt-1', label: 'Red' }],
      },
    ];
    const schema = buildResponseSchema(fields);

    expect(() => schema.parse({ f1: '' })).toThrow();
    expect(schema.parse({ f1: 'opt-1' })).toEqual({ f1: 'opt-1' });
  });

  it('should require at least one selection for multi_select when required', () => {
    const fields: FormField[] = [
      {
        id: 'f1',
        type: 'multi_select',
        label: 'Hobbies',
        required: true,
        options: [{ id: 'h1', label: 'Reading' }],
      },
    ];
    const schema = buildResponseSchema(fields);

    expect(() => schema.parse({ f1: [] })).toThrow();
    expect(schema.parse({ f1: ['h1'] })).toEqual({ f1: ['h1'] });
  });

  it('should handle multiple fields together', () => {
    const fields: FormField[] = [
      { id: 'name', type: 'short_text', label: 'Name', required: true },
      { id: 'age', type: 'number', label: 'Age', required: false },
      { id: 'date', type: 'date', label: 'Date', required: false },
    ];
    const schema = buildResponseSchema(fields);

    const result = schema.parse({ name: 'Carlos', age: null, date: '' });
    expect(result).toEqual({ name: 'Carlos', age: null, date: '' });
  });
});

describe('buildResponseDefaults', () => {
  it('should return empty string for text fields', () => {
    const fields: FormField[] = [
      { id: 'f1', type: 'short_text', label: 'Name', required: true },
      { id: 'f2', type: 'long_text', label: 'Bio', required: false },
    ];

    const defaults = buildResponseDefaults(fields);
    expect(defaults.f1).toBe('');
    expect(defaults.f2).toBe('');
  });

  it('should return null for number fields', () => {
    const fields: FormField[] = [
      { id: 'f1', type: 'number', label: 'Age', required: true },
    ];

    const defaults = buildResponseDefaults(fields);
    expect(defaults.f1).toBeNull();
  });

  it('should return empty array for multi_select fields', () => {
    const fields: FormField[] = [
      { id: 'f1', type: 'multi_select', label: 'Hobbies', required: true },
    ];

    const defaults = buildResponseDefaults(fields);
    expect(defaults.f1).toEqual([]);
  });

  it('should return empty string for date and single_select fields', () => {
    const fields: FormField[] = [
      { id: 'f1', type: 'date', label: 'Date', required: false },
      { id: 'f2', type: 'single_select', label: 'Option', required: false },
    ];

    const defaults = buildResponseDefaults(fields);
    expect(defaults.f1).toBe('');
    expect(defaults.f2).toBe('');
  });

  it('should create a key for each field', () => {
    const fields: FormField[] = [
      { id: 'a', type: 'short_text', label: 'A', required: false },
      { id: 'b', type: 'number', label: 'B', required: false },
      { id: 'c', type: 'multi_select', label: 'C', required: false },
    ];

    const defaults = buildResponseDefaults(fields);
    expect(Object.keys(defaults)).toEqual(['a', 'b', 'c']);
  });
});
