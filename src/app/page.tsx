import Link from 'next/link';
import { FileText, BarChart3, Share2, Zap } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';

export default function HomePage() {
  return (
    <div className="from-background via-background min-h-screen bg-linear-to-br to-indigo-50/30 dark:to-indigo-950/20">
      {/* Header */}
      <header className="border-border bg-background/70 sticky top-0 z-50 border-b backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-indigo-600 to-violet-600">
              <FileText className="h-4 w-4 text-white" />
            </div>
            <span className="text-foreground text-lg font-bold tracking-tight">
              FormCraft
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
              >
                Iniciar sesión
              </Button>
            </Link>
            <Link href="/register">
              <Button
                size="sm"
                className="bg-linear-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-200/50 hover:from-indigo-700 hover:to-violet-700 dark:shadow-indigo-900/30"
              >
                Crear cuenta
              </Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="mx-auto max-w-6xl px-6 pt-24 pb-32">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-300">
            <Zap className="h-3.5 w-3.5" />
            Formularios dinámicos en minutos
          </div>
          <h1 className="text-foreground text-5xl leading-[1.1] font-bold tracking-tight sm:text-6xl">
            Crea formularios
            <span className="block bg-linear-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-violet-400">
              sin complicaciones
            </span>
          </h1>
          <p className="text-muted-foreground mx-auto mt-6 max-w-xl text-lg leading-relaxed">
            Diseña formularios con drag & drop, compártelos con un link público
            y visualiza las respuestas con gráficas en tiempo real.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link href="/register">
              <Button
                size="lg"
                className="h-12 bg-linear-to-r from-indigo-600 to-violet-600 px-8 text-base text-white shadow-lg shadow-indigo-200/50 hover:from-indigo-700 hover:to-violet-700 dark:shadow-indigo-900/30"
              >
                Comenzar gratis
              </Button>
            </Link>
            <Link href="/login">
              <Button
                variant="outline"
                size="lg"
                className="border-border h-12 px-8 text-base"
              >
                Ya tengo cuenta
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-32 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="group border-border bg-card/60 rounded-2xl border p-6 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-indigo-100/50 dark:hover:shadow-indigo-900/20">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 transition-colors group-hover:bg-indigo-100 dark:bg-indigo-950/50 dark:group-hover:bg-indigo-900/50">
              <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-foreground mb-2 text-lg font-semibold">
              Constructor visual
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Arrastra y suelta campos para crear formularios con texto,
              números, fechas y campos de selección.
            </p>
          </div>

          <div className="group border-border bg-card/60 rounded-2xl border p-6 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-violet-100/50 dark:hover:shadow-violet-900/20">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 transition-colors group-hover:bg-violet-100 dark:bg-violet-950/50 dark:group-hover:bg-violet-900/50">
              <Share2 className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            </div>
            <h3 className="text-foreground mb-2 text-lg font-semibold">
              Comparte con un link
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Publica tu formulario y comparte la URL pública. Cualquier persona
              puede responder sin necesidad de cuenta.
            </p>
          </div>

          <div className="group border-border bg-card/60 rounded-2xl border p-6 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-blue-100/50 dark:hover:shadow-blue-900/20">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 transition-colors group-hover:bg-blue-100 dark:bg-blue-950/50 dark:group-hover:bg-blue-900/50">
              <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-foreground mb-2 text-lg font-semibold">
              Analiza respuestas
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Visualiza las respuestas en tablas y gráficas interactivas.
              Entiende tus datos de un vistazo.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-border border-t py-8">
        <div className="text-muted-foreground/70 mx-auto max-w-6xl px-6 text-center text-sm">
          FormCraft — Generador de Formularios Dinámicos
        </div>
        <div className="text-muted-foreground mx-auto max-w-6xl px-6 text-center text-sm">
          <Link
            href="https://github.com/carloscuatin/form-craft"
            target="_blank"
            className="hover:text-foreground transition-colors"
          >
            By Carlos Cuatin 🚀
          </Link>
        </div>
      </footer>
    </div>
  );
}
