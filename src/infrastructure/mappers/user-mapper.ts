/**
 * User Mapper
 * Transforms between domain entities and Supabase Auth records
 */

import { User } from '@/core/domain/entities/user';

/** Raw user object from Supabase Auth */
export interface SupabaseUserRow {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
  };
}

export class UserMapper {
  static toDomain(row: SupabaseUserRow, fallbackEmail = ''): User {
    return {
      id: row.id,
      email: row.email ?? fallbackEmail,
      name: (row.user_metadata?.full_name as string) ?? '',
    };
  }
}
