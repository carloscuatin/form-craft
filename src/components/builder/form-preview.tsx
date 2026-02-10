'use client';

import { type FC } from 'react';
import { Eye } from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FieldRenderer } from '@/components/forms/field-renderer';
import { FormField } from '@/core/domain/entities/form';

interface FormPreviewProps {
  title: string;
  description: string;
  fields: FormField[];
}

export const FormPreview: FC<FormPreviewProps> = ({
  title,
  description,
  fields,
}) => {
  return (
    <div className="space-y-4">
      <div className="text-muted-foreground flex items-center gap-2 text-xs font-medium tracking-wider uppercase">
        <Eye className="h-3.5 w-3.5" />
        Vista previa
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-foreground text-xl">
            {title || 'Sin título'}
          </CardTitle>
          {description && (
            <CardDescription className="text-muted-foreground">
              {description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-5">
          {fields.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center text-sm">
              Agrega campos para ver la vista previa
            </p>
          ) : (
            <>
              {fields.map((field) => (
                <FieldRenderer key={field.id} field={field} disabled />
              ))}
              <Button
                disabled
                className="w-full bg-linear-to-r from-indigo-600 to-violet-600 text-white opacity-70"
              >
                Enviar respuesta
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
