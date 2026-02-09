import { UserMapper, SupabaseUserRow } from '../user-mapper';

const baseRow: SupabaseUserRow = {
  id: 'user-1',
  email: 'test@example.com',
  user_metadata: {
    full_name: 'John Doe',
  },
};

describe('UserMapper', () => {
  describe('toDomain', () => {
    it('should map a Supabase user to the User domain entity', () => {
      const result = UserMapper.toDomain(baseRow);

      expect(result.id).toBe('user-1');
      expect(result.email).toBe('test@example.com');
      expect(result.name).toBe('John Doe');
    });

    it('should use fallbackEmail when email is undefined', () => {
      const row: SupabaseUserRow = { ...baseRow, email: undefined };

      const result = UserMapper.toDomain(row, 'fallback@example.com');

      expect(result.email).toBe('fallback@example.com');
    });

    it('should default email to empty string when no fallback is given', () => {
      const row: SupabaseUserRow = { ...baseRow, email: undefined };

      const result = UserMapper.toDomain(row);

      expect(result.email).toBe('');
    });

    it('should default name to empty string when full_name is missing', () => {
      const row: SupabaseUserRow = { ...baseRow, user_metadata: {} };

      const result = UserMapper.toDomain(row);

      expect(result.name).toBe('');
    });

    it('should default name to empty string when user_metadata is undefined', () => {
      const row: SupabaseUserRow = {
        id: 'user-2',
        email: 'no-meta@example.com',
      };

      const result = UserMapper.toDomain(row);

      expect(result.name).toBe('');
    });
  });
});
