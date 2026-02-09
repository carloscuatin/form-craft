import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Edit, BarChart3, Table } from 'lucide-react';

import { getForm, getResponses } from '@/app/actions/forms';
import { ResponseTable } from '@/components/dashboard/response-table';
import { ResponseCharts } from '@/components/dashboard/response-charts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CopyLinkButton } from '@/components/dashboard/copy-link-button';

interface ResponseDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ResponseDetailPage({
  params,
}: ResponseDetailPageProps) {
  const { id } = await params;

  const [formResult, responsesResult] = await Promise.all([
    getForm(id),
    getResponses(id),
  ]);

  if (formResult.error || !formResult.data) {
    notFound();
  }

  const form = formResult.data;
  const responses = responsesResult.data ?? [];

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-foreground truncate text-xl font-bold">
                {form.title}
              </h1>
              <Badge
                variant={form.published ? 'default' : 'secondary'}
                className={`shrink-0 text-[10px] ${
                  form.published
                    ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/50 dark:text-emerald-300 dark:hover:bg-emerald-900/50'
                    : ''
                }`}
              >
                {form.published ? 'Publicado' : 'Borrador'}
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm">
              {responses.length}{' '}
              {responses.length === 1 ? 'respuesta' : 'respuestas'} recibidas
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {form.published && <CopyLinkButton formId={form.id} />}
          <Link href={`/builder/${form.id}`}>
            <Button variant="outline" size="sm">
              <Edit className="mr-1.5 h-4 w-4" />
              Editar
            </Button>
          </Link>
        </div>
      </div>

      {/* Content */}
      <Tabs defaultValue="table" className="space-y-6">
        <TabsList className="bg-muted">
          <TabsTrigger value="table" className="text-sm">
            <Table className="mr-1.5 h-4 w-4" />
            Respuestas
          </TabsTrigger>
          <TabsTrigger value="charts" className="text-sm">
            <BarChart3 className="mr-1.5 h-4 w-4" />
            Gráficas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="table">
          <ResponseTable fields={form.fields} responses={responses} />
        </TabsContent>

        <TabsContent value="charts">
          <ResponseCharts fields={form.fields} responses={responses} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
