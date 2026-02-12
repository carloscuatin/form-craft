'use client';

import { type FC, useEffect, useState } from 'react';
import { BarChart3, Table } from 'lucide-react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { type FormField } from '@/core/domain/entities/form';
import { type FormResponse } from '@/core/domain/entities/response';

import { ResponseCharts } from './response-charts';
import { ResponseTable } from './response-table';
import { useSubscribeToNewResponses } from './use-subscribe-to-new-responses';

interface ResponsesTabsProps {
  formId: string;
  fields: FormField[];
  initialResponses: FormResponse[];
}

export const ResponsesTabs: FC<ResponsesTabsProps> = ({
  formId,
  fields,
  initialResponses,
}) => {
  const [responses, setResponses] = useState<FormResponse[]>(initialResponses);

  useSubscribeToNewResponses(formId, (newResponse) => {
    setResponses((prev) => {
      if (prev.some((r) => r.id === newResponse.id)) return prev;
      return [newResponse, ...prev];
    });
  });

  useEffect(() => {
    setResponses(initialResponses);
  }, [initialResponses]);

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground text-sm">
        {responses.length} {responses.length === 1 ? 'respuesta' : 'respuestas'}{' '}
        recibidas
      </p>

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
          <ResponseTable fields={fields} responses={responses} />
        </TabsContent>

        <TabsContent value="charts">
          <ResponseCharts fields={fields} responses={responses} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
