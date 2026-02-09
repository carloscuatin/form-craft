/**
 * Supabase Auth Repository
 * Adapter that implements the AuthRepository port using Supabase Auth
 */

import { SupabaseClient } from '@supabase/supabase-js';

import {
  AuthRepository,
  SignUpDTO,
  SignInDTO,
} from '@/core/domain/ports/auth-repository';
import { User } from '@/core/domain/entities/user';
import {
  UserMapper,
  SupabaseUserRow,
} from '@/infrastructure/mappers/user-mapper';

/** The SupabaseAuthRepository adapter */
export class SupabaseAuthRepository implements AuthRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async signUp(dto: SignUpDTO): Promise<User> {
    const { data, error } = await this.supabase.auth.signUp({
      email: dto.email,
      password: dto.password,
      options: {
        data: { full_name: dto.name },
      },
    });

    if (error) throw new Error(error.message);
    if (!data.user) throw new Error('No se pudo crear la cuenta');

    return UserMapper.toDomain(data.user as SupabaseUserRow, dto.email);
  }

  async signIn(dto: SignInDTO): Promise<User> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: dto.email,
      password: dto.password,
    });

    if (error) {
      throw new Error(
        'Credenciales inválidas. Verifica tu email y contraseña.',
      );
    }

    return UserMapper.toDomain(data.user as SupabaseUserRow, dto.email);
  }

  async signOut(): Promise<void> {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw new Error(error.message);
  }

  async getUser(): Promise<User | null> {
    const {
      data: { user },
    } = await this.supabase.auth.getUser();

    if (!user) return null;

    return UserMapper.toDomain(user as SupabaseUserRow);
  }
}
