'use client';

import { type FC, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2, FileText } from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form } from '@/core/domain/entities/form';
import { Answers, AnswerValue } from '@/core/domain/entities/response';
import { submitResponse } from '@/app/actions/forms';

import { FieldRenderer } from '../renderer';
import { buildResponseDefaults } from './form-defaults';
import { buildResponseSchema, ResponseFormValues } from './response-schema';

interface PublicFormProps {
  form: Form;
}

export const PublicForm: FC<PublicFormProps> = ({ form }) => {
  const router = useRouter();

  const schema = useMemo(() => buildResponseSchema(form.fields), [form.fields]);
  const defaults = useMemo(
    () => buildResponseDefaults(form.fields),
    [form.fields],
  );

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ResponseFormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaults,
  });

  const onSubmit = async (data: Record<string, unknown>) => {
    try {
      const result = await submitResponse({
        formId: form.id,
        answers: data as Answers,
      });

      if (result.error) {
        toast.error(result.error);
      } else {
        router.push(`/forms/${form.id}/success`);
      }
    } catch {
      toast.error('Error al enviar la respuesta');
    }
  };

  return (
    <div className="from-background via-background flex min-h-screen items-center justify-center bg-linear-to-br to-indigo-50/30 p-4 dark:to-indigo-950/20">
      <div className="w-full max-w-2xl">
        {/* Branding */}
        <div className="mb-6 flex items-center justify-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-linear-to-br from-indigo-600 to-violet-600">
            <FileText className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-muted-foreground/70 text-sm font-semibold">
            FormCraft
          </span>
        </div>

        <Card className="border-border shadow-xl shadow-black/5 dark:shadow-black/20">
          <CardHeader className="pb-4">
            <CardTitle className="text-foreground text-2xl">
              {form.title}
            </CardTitle>
            {form.description && (
              <CardDescription className="text-muted-foreground text-base">
                {form.description}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {form.fields.map((field) => (
                <Controller
                  key={field.id}
                  control={control}
                  name={field.id}
                  render={({ field: controllerField, fieldState }) => (
                    <FieldRenderer
                      field={field}
                      value={controllerField.value as AnswerValue}
                      onChange={controllerField.onChange}
                      error={fieldState.error?.message}
                    />
                  )}
                />
              ))}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 w-full bg-linear-to-r from-indigo-600 to-violet-600 text-base text-white shadow-md shadow-indigo-200/50 hover:from-indigo-700 hover:to-violet-700 dark:shadow-indigo-900/30"
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Enviar respuesta
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-muted-foreground/70 mt-6 text-center text-xs">
          Creado con FormCraft
        </p>
      </div>
    </div>
  );
};
