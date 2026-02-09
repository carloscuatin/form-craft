'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { FormField } from '@/core/domain/entities/form';
import { FormResponse } from '@/core/domain/entities/response';
import { isSelectFieldType } from '@/core/domain/value-objects/field-types';

interface ResponseTableProps {
  fields: FormField[];
  responses: FormResponse[];
}

export function ResponseTable({ fields, responses }: ResponseTableProps) {
  /** Resolve the display value of an answer */
  function getDisplayValue(field: FormField, response: FormResponse): string {
    const answer = response.answers[field.id];

    if (answer === null || answer === undefined || answer === '') {
      return '—';
    }

    if (isSelectFieldType(field.type) && field.options) {
      if (Array.isArray(answer)) {
        return answer
          .map((a) => field.options?.find((o) => o.id === a)?.label ?? a)
          .join(', ');
      }
      return (
        field.options.find((o) => o.id === answer)?.label ?? String(answer)
      );
    }

    return String(answer);
  }

  if (responses.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground text-sm">
          No hay respuestas aún. Comparte el link del formulario para empezar a
          recibir respuestas.
        </p>
      </div>
    );
  }

  return (
    <div className="border-border overflow-hidden rounded-xl border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="text-muted-foreground w-[60px] text-xs font-semibold">
                #
              </TableHead>
              {fields.map((field) => (
                <TableHead
                  key={field.id}
                  className="text-muted-foreground min-w-[150px] text-xs font-semibold"
                >
                  {field.label || 'Sin nombre'}
                </TableHead>
              ))}
              <TableHead className="text-muted-foreground w-[160px] text-xs font-semibold">
                Fecha
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {responses.map((response, index) => (
              <TableRow key={response.id} className="hover:bg-muted/50">
                <TableCell className="text-muted-foreground/70 text-sm">
                  {index + 1}
                </TableCell>
                {fields.map((field) => (
                  <TableCell
                    key={field.id}
                    className="text-foreground max-w-[250px] truncate text-sm"
                  >
                    {getDisplayValue(field, response)}
                  </TableCell>
                ))}
                <TableCell className="text-muted-foreground/70 text-sm">
                  {new Date(response.submittedAt).toLocaleDateString('es-CO', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
