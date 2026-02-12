'use client';

import { type FC, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FileText, Loader2, AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { signIn, signUp } from '@/app/actions/auth';

import { buildAuthSchema, type AuthFormData } from './auth-form-schema';

interface AuthFormProps {
  mode: 'login' | 'register';
}

export const AuthForm: FC<AuthFormProps> = ({ mode }) => {
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  const isLogin = mode === 'login';
  const schema = useMemo(() => buildAuthSchema(mode), [mode]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuthFormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const onSubmit = async (data: AuthFormData) => {
    setServerError(null);

    try {
      const result = isLogin
        ? await signIn({ email: data.email, password: data.password })
        : await signUp(data);

      if (result?.error) {
        setServerError(result.error);
      }
    } catch {
      // Redirect happens via server action
      router.refresh();
    }
  };

  return (
    <div className="from-background via-background flex min-h-screen items-center justify-center bg-linear-to-br to-indigo-50/30 p-4 dark:to-indigo-950/20">
      <Card className="border-border w-full max-w-md shadow-xl shadow-black/5 dark:shadow-black/20">
        <CardHeader className="pb-2 text-center">
          <Link
            href="/"
            className="mb-4 inline-flex items-center justify-center gap-2"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-indigo-600 to-violet-600">
              <FileText className="h-4.5 w-4.5 text-white" />
            </div>
            <span className="text-foreground text-xl font-bold tracking-tight">
              FormCraft
            </span>
          </Link>
          <CardTitle className="text-foreground text-2xl font-bold">
            {isLogin ? 'Bienvenido de vuelta' : 'Crea tu cuenta'}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {isLogin
              ? 'Ingresa tus credenciales para acceder'
              : 'Regístrate para empezar a crear formularios'}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          {serverError && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {serverError}
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">
                  Nombre completo
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Tu nombre"
                  className="h-11"
                  {...register('name')}
                />
                {errors.name && (
                  <p className="text-xs text-red-500">{errors.name.message}</p>
                )}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                className="h-11"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                placeholder={isLogin ? '••••••••' : 'Mínimo 6 caracteres'}
                className="h-11"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-11 w-full bg-linear-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-200/50 hover:from-indigo-700 hover:to-violet-700 dark:shadow-indigo-900/30"
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isLogin ? 'Iniciar sesión' : 'Crear cuenta'}
            </Button>
          </form>
          <div className="text-muted-foreground mt-6 text-center text-sm">
            {isLogin ? (
              <>
                ¿No tienes cuenta?{' '}
                <Link
                  href="/register"
                  className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  Regístrate
                </Link>
              </>
            ) : (
              <>
                ¿Ya tienes cuenta?{' '}
                <Link
                  href="/login"
                  className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  Inicia sesión
                </Link>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
