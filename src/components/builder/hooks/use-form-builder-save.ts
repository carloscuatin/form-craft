'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { createForm, updateForm } from '@/app/actions/forms';

import { useFormBuilderContext } from '../form-builder-context';
import type { FormBuilderData } from '../form-builder-schema';

/**
 * Encapsulates save logic for the form builder: submit handler, saving state, and validation errors.
 * Must be used within FormBuilderProvider.
 */
export const useFormBuilderSave = (formId?: string) => {
  const router = useRouter();
  const { form } = useFormBuilderContext();
  const [saving, setSaving] = useState(false);

  const onSubmit = async (data: FormBuilderData) => {
    setSaving(true);
    try {
      if (formId) {
        const result = await updateForm(formId, data);
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success('Formulario guardado');
        }
      } else {
        const result = await createForm(data);
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success('Formulario creado');
          router.push(`/builder/${result.data!.id}`);
        }
      }
    } catch {
      toast.error('Error al guardar el formulario');
    } finally {
      setSaving(false);
    }
  };

  const handleSave = form.handleSubmit(onSubmit, (errors) => {
    const firstError = Object.values(errors)[0];
    if (firstError?.message) {
      toast.error(String(firstError.message));
    }
  });

  return { handleSave, saving };
};
