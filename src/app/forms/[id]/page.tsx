import { notFound } from 'next/navigation';

import { getPublicForm } from '@/app/actions/forms';
import { PublicForm } from '@/components/forms/public-form';

interface PublicFormPageProps {
  params: Promise<{ id: string }>;
}

export default async function PublicFormPage({ params }: PublicFormPageProps) {
  const { id } = await params;
  const { data: form, error } = await getPublicForm(id);

  if (error || !form) {
    notFound();
  }

  return <PublicForm form={form} />;
}
