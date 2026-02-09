import { notFound } from 'next/navigation';

import { getForm } from '@/app/actions/forms';
import { FormBuilder } from '@/components/builder/form-builder';

interface EditFormPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditFormPage({ params }: EditFormPageProps) {
  const { id } = await params;
  const { data: form, error } = await getForm(id);

  if (error || !form) {
    notFound();
  }

  return (
    <FormBuilder
      formId={form.id}
      initialData={{
        title: form.title,
        description: form.description,
        fields: form.fields,
        published: form.published,
      }}
    />
  );
}
