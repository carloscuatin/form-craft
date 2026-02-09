import Link from 'next/link';
import { CheckCircle2, FileText } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface SuccessPageProps {
  params: Promise<{ id: string }>;
}

export default async function SuccessPage({ params }: SuccessPageProps) {
  const { id } = await params;

  return (
    <div className="from-background via-background flex min-h-screen items-center justify-center bg-linear-to-br to-emerald-50/30 p-4 dark:to-emerald-950/20">
      <Card className="border-border w-full max-w-md text-center shadow-xl shadow-black/5 dark:shadow-black/20">
        <CardContent className="px-8 pt-12 pb-10">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/50">
            <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h1 className="text-foreground mb-2 text-2xl font-bold">
            ¡Respuesta enviada!
          </h1>
          <p className="text-muted-foreground mb-8">
            Tu respuesta ha sido registrada exitosamente. Gracias por tu tiempo.
          </p>
          <Link href={`/forms/${id}`}>
            <Button variant="outline" className="border-border">
              Enviar otra respuesta
            </Button>
          </Link>
        </CardContent>
        <div className="border-border flex items-center justify-center gap-1.5 border-t py-4">
          <div className="flex h-5 w-5 items-center justify-center rounded bg-linear-to-br from-indigo-600 to-violet-600">
            <FileText className="h-2.5 w-2.5 text-white" />
          </div>
          <span className="text-muted-foreground/70 text-xs">FormCraft</span>
        </div>
      </Card>
    </div>
  );
}
