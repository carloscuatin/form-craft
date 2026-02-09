import { FormMapper, FormRow, FormRowWithCount } from '../form-mapper';

const baseRow: FormRow = {
  id: 'form-1',
  user_id: 'user-1',
  title: 'My form',
  description: 'A description',
  fields: [
    { id: 'f1', type: 'short_text', label: 'Name', required: true },
  ],
  published: true,
  created_at: '2025-06-15T10:30:00Z',
  updated_at: '2025-06-15T12:00:00Z',
};

describe('FormMapper', () => {
  describe('toDomain', () => {
    it('should map snake_case to camelCase correctly', () => {
      const result = FormMapper.toDomain(baseRow);

      expect(result.id).toBe('form-1');
      expect(result.userId).toBe('user-1');
      expect(result.title).toBe('My form');
      expect(result.description).toBe('A description');
      expect(result.published).toBe(true);
    });

    it('should convert date strings to Date objects', () => {
      const result = FormMapper.toDomain(baseRow);

      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
      expect(result.createdAt.toISOString()).toBe('2025-06-15T10:30:00.000Z');
      expect(result.updatedAt.toISOString()).toBe('2025-06-15T12:00:00.000Z');
    });

    it('should preserve fields without transformation', () => {
      const result = FormMapper.toDomain(baseRow);

      expect(result.fields).toEqual(baseRow.fields);
      expect(result.fields).toHaveLength(1);
      expect(result.fields[0].type).toBe('short_text');
    });
  });

  describe('toDomainWithCount', () => {
    it('should include responseCount converted to a number', () => {
      const rowWithCount: FormRowWithCount = {
        ...baseRow,
        response_count: 42,
      };

      const result = FormMapper.toDomainWithCount(rowWithCount);

      expect(result.responseCount).toBe(42);
      expect(typeof result.responseCount).toBe('number');
    });

    it('should convert a string response_count to a number', () => {
      // Supabase RPC may return count as a string
      const rowWithCount = {
        ...baseRow,
        response_count: '15' as unknown as number,
      };

      const result = FormMapper.toDomainWithCount(rowWithCount);

      expect(result.responseCount).toBe(15);
      expect(typeof result.responseCount).toBe('number');
    });

    it('should include all base form properties', () => {
      const rowWithCount: FormRowWithCount = {
        ...baseRow,
        response_count: 0,
      };

      const result = FormMapper.toDomainWithCount(rowWithCount);

      expect(result.id).toBe('form-1');
      expect(result.userId).toBe('user-1');
      expect(result.createdAt).toBeInstanceOf(Date);
    });
  });

  describe('toPersistence', () => {
    it('should map camelCase to snake_case', () => {
      const result = FormMapper.toPersistence({
        userId: 'user-1',
        title: 'Title',
        description: 'Desc',
        published: true,
      });

      expect(result).toEqual({
        user_id: 'user-1',
        title: 'Title',
        description: 'Desc',
        published: true,
      });
    });

    it('should omit undefined fields', () => {
      const result = FormMapper.toPersistence({
        title: 'Only title',
      });

      expect(result).toEqual({ title: 'Only title' });
      expect(result).not.toHaveProperty('user_id');
      expect(result).not.toHaveProperty('description');
      expect(result).not.toHaveProperty('fields');
      expect(result).not.toHaveProperty('published');
    });

    it('should include fields when provided', () => {
      const fields = [
        { id: 'f1', type: 'number' as const, label: 'Age', required: false },
      ];

      const result = FormMapper.toPersistence({ fields });

      expect(result).toEqual({ fields });
    });
  });
});
