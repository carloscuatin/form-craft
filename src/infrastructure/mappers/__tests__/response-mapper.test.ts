import { ResponseMapper, ResponseRow } from '../response-mapper';

const baseRow: ResponseRow = {
  id: 'resp-1',
  form_id: 'form-1',
  answers: {
    'field-1': 'Carlos',
    'field-2': 'opt-1',
    'field-3': ['hobby-1', 'hobby-2'],
  },
  submitted_at: '2025-06-15T14:30:00Z',
};

describe('ResponseMapper', () => {
  describe('toDomain', () => {
    it('should map snake_case to camelCase', () => {
      const result = ResponseMapper.toDomain(baseRow);

      expect(result.id).toBe('resp-1');
      expect(result.formId).toBe('form-1');
    });

    it('should convert submitted_at to a Date object', () => {
      const result = ResponseMapper.toDomain(baseRow);

      expect(result.submittedAt).toBeInstanceOf(Date);
      expect(result.submittedAt.toISOString()).toBe(
        '2025-06-15T14:30:00.000Z',
      );
    });

    it('should preserve answers without transformation', () => {
      const result = ResponseMapper.toDomain(baseRow);

      expect(result.answers).toEqual(baseRow.answers);
      expect(result.answers['field-1']).toBe('Carlos');
      expect(result.answers['field-3']).toEqual(['hobby-1', 'hobby-2']);
    });

    it('should handle empty answers', () => {
      const emptyRow: ResponseRow = {
        ...baseRow,
        answers: {},
      };

      const result = ResponseMapper.toDomain(emptyRow);

      expect(result.answers).toEqual({});
    });
  });

  describe('toPersistence', () => {
    it('should map camelCase to snake_case', () => {
      const result = ResponseMapper.toPersistence({
        formId: 'form-1',
        answers: { 'field-1': 'value' },
      });

      expect(result).toEqual({
        form_id: 'form-1',
        answers: { 'field-1': 'value' },
      });
    });

    it('should preserve answers with arrays', () => {
      const answers = {
        'field-1': 'text',
        'field-2': ['opt-1', 'opt-2'],
      };

      const result = ResponseMapper.toPersistence({
        formId: 'form-1',
        answers,
      });

      expect(result.answers).toEqual(answers);
    });
  });
});
