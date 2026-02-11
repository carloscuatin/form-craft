import { getForms } from '@/app/actions/forms';
import { FormCard, EmptyState } from '@/components/dashboard';

export default async function DashboardPage() {
  const { data: forms, error } = await getForms();

  if (error) {
    return (
      <div className="py-24 text-center">
        <p className="text-red-500">Error al cargar formularios: {error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-foreground text-2xl font-bold">Mis formularios</h1>
        <p className="text-muted-foreground mt-1">
          Gestiona tus formularios y revisa las respuestas recibidas.
        </p>
      </div>

      {!forms || forms.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {forms.map((form) => (
            <FormCard key={form.id} form={form} />
          ))}
        </div>
      )}
    </div>
  );
}
