/**
 * Infrastructure Container
 * Centralized wiring of repositories and use cases.
 * This is the composition root — the only place that knows about both
 * the core (use cases, ports) and the infrastructure (adapters).
 */

import { SignUpUseCase } from '@/core/use-cases/sign-up';
import { SignInUseCase } from '@/core/use-cases/sign-in';
import { SignOutUseCase } from '@/core/use-cases/sign-out';
import { GetUserUseCase } from '@/core/use-cases/get-user';
import { CreateFormUseCase } from '@/core/use-cases/create-form';
import { UpdateFormUseCase } from '@/core/use-cases/update-form';
import { GetFormUseCase } from '@/core/use-cases/get-form';
import { GetFormsUseCase } from '@/core/use-cases/get-forms';
import { DeleteFormUseCase } from '@/core/use-cases/delete-form';
import { SubmitResponseUseCase } from '@/core/use-cases/submit-response';
import { GetResponsesUseCase } from '@/core/use-cases/get-responses';

import { SupabaseResponseRepository } from './adapters/supabase/supabase-response-repository';
import { SupabaseFormRepository } from './adapters/supabase/supabase-form-repository';
import { SupabaseAuthRepository } from './adapters/supabase/supabase-auth-repository';
import { createServerSupabaseClient } from './adapters/supabase/client';

/** Auth use cases wired to the authenticated server client */
export const createAuthUseCases = async () => {
  const supabase = await createServerSupabaseClient();
  const authRepo = new SupabaseAuthRepository(supabase);

  return {
    signUp: new SignUpUseCase(authRepo),
    signIn: new SignInUseCase(authRepo),
    signOut: new SignOutUseCase(authRepo),
    getUser: new GetUserUseCase(authRepo),
  };
};

/** Form & response use cases wired to the authenticated server client */
export const createFormUseCases = async () => {
  const supabase = await createServerSupabaseClient();
  const formRepo = new SupabaseFormRepository(supabase);
  const responseRepo = new SupabaseResponseRepository(supabase);

  return {
    createForm: new CreateFormUseCase(formRepo),
    updateForm: new UpdateFormUseCase(formRepo),
    getForm: new GetFormUseCase(formRepo),
    getForms: new GetFormsUseCase(formRepo),
    deleteForm: new DeleteFormUseCase(formRepo),
    getResponses: new GetResponsesUseCase(responseRepo),
  };
};

/** Public form & response use cases (anonymous access) */
export const createPublicFormUseCases = async () => {
  const supabase = await createServerSupabaseClient();
  const formRepo = new SupabaseFormRepository(supabase);
  const responseRepo = new SupabaseResponseRepository(supabase);

  return {
    getForm: new GetFormUseCase(formRepo),
    submitResponse: new SubmitResponseUseCase(formRepo, responseRepo),
  };
};

/** Get the current authenticated user ID or throw */
export const requireAuth = async (): Promise<string> => {
  const { getUser } = await createAuthUseCases();
  const user = await getUser.execute();
  if (!user) throw new Error('No autenticado');
  return user.id;
};
