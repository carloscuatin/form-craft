'use server';

import { revalidatePath } from 'next/cache';

import {
  createFormUseCases,
  createPublicFormUseCases,
  requireAuth,
} from '@/infrastructure/container';
import { FormField } from '@/core/domain/entities/form';
import { Answers } from '@/core/domain/entities/response';

// ============================================
// FORM ACTIONS
// ============================================

export async function createForm(data: {
  title: string;
  description: string;
  fields: FormField[];
  published?: boolean;
}) {
  try {
    const userId = await requireAuth();
    const { createForm: createFormUseCase } = await createFormUseCases();

    const form = await createFormUseCase.execute({
      userId,
      title: data.title,
      description: data.description,
      fields: data.fields,
      published: data.published,
    });

    revalidatePath('/dashboard');
    return { data: form, error: null };
  } catch (err) {
    return { data: null, error: (err as Error).message };
  }
}

export async function updateForm(
  id: string,
  data: {
    title?: string;
    description?: string;
    fields?: FormField[];
    published?: boolean;
  },
) {
  try {
    await requireAuth();
    const { updateForm: updateFormUseCase } = await createFormUseCases();

    const form = await updateFormUseCase.execute(id, data);
    revalidatePath('/dashboard');
    revalidatePath(`/builder/${id}`);
    return { data: form, error: null };
  } catch (err) {
    return { data: null, error: (err as Error).message };
  }
}

export async function getForm(id: string) {
  try {
    const { getForm: getFormUseCase } = await createFormUseCases();
    const form = await getFormUseCase.execute(id);
    return { data: form, error: null };
  } catch (err) {
    return { data: null, error: (err as Error).message };
  }
}

export async function getPublicForm(id: string) {
  try {
    const { getForm: getFormUseCase } = await createPublicFormUseCases();
    const form = await getFormUseCase.executePublic(id);
    return { data: form, error: null };
  } catch (err) {
    return { data: null, error: (err as Error).message };
  }
}

export async function getForms() {
  try {
    const userId = await requireAuth();
    const { getForms: getFormsUseCase } = await createFormUseCases();
    const forms = await getFormsUseCase.execute(userId);
    return { data: forms, error: null };
  } catch (err) {
    return { data: null, error: (err as Error).message };
  }
}

export async function deleteForm(id: string) {
  try {
    await requireAuth();
    const { deleteForm: deleteFormUseCase } = await createFormUseCases();
    await deleteFormUseCase.execute(id);
    revalidatePath('/dashboard');
    return { error: null };
  } catch (err) {
    return { error: (err as Error).message };
  }
}

// ============================================
// RESPONSE ACTIONS
// ============================================

export async function submitResponse(data: {
  formId: string;
  answers: Answers;
}) {
  try {
    const { submitResponse: submitResponseUseCase } =
      await createPublicFormUseCases();

    await submitResponseUseCase.execute({
      formId: data.formId,
      answers: data.answers,
    });

    revalidatePath(`/dashboard/${data.formId}`);
    return { success: true, error: null };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

export async function getResponses(formId: string) {
  try {
    await requireAuth();
    const { getResponses: getResponsesUseCase } = await createFormUseCases();
    const responses = await getResponsesUseCase.execute(formId);
    return { data: responses, error: null };
  } catch (err) {
    return { data: null, error: (err as Error).message };
  }
}
