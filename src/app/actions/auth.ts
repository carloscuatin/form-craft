'use server';

import { redirect } from 'next/navigation';

import { createAuthUseCases } from '@/infrastructure/container';
import { SignUpDTO, SignInDTO } from '@/core/domain/ports/auth-repository';

export async function signUp(data: SignUpDTO) {
  try {
    const { signUp: signUpUseCase } = await createAuthUseCases();
    await signUpUseCase.execute(data);
  } catch (err) {
    return { error: (err as Error).message };
  }

  redirect('/dashboard');
}

export async function signIn(data: SignInDTO) {
  try {
    const { signIn: signInUseCase } = await createAuthUseCases();
    await signInUseCase.execute(data);
  } catch (err) {
    return { error: (err as Error).message };
  }

  redirect('/dashboard');
}

export async function signOut() {
  try {
    const { signOut: signOutUseCase } = await createAuthUseCases();
    await signOutUseCase.execute();
  } catch {
    // Silently fail - redirect to login regardless
  }

  redirect('/login');
}

export async function getUser() {
  const { getUser: getUserUseCase } = await createAuthUseCases();
  return getUserUseCase.execute();
}
