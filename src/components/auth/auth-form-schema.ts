/**
 * Auth Form Schema — UI layer
 * Builds a unified Zod schema for the AuthForm component,
 * which handles both login and register in a single form.
 * This is a UI concern (single component, two modes), NOT domain logic.
 */

import { z } from 'zod';

export const buildAuthSchema = (mode: 'login' | 'register') => {
  return z.object({
    name:
      mode === 'register'
        ? z.string().min(1, 'El nombre es obligatorio')
        : z.string(),
    email: z
      .string()
      .min(1, 'El email es obligatorio')
      .email('Ingresa un email válido'),
    password:
      mode === 'register'
        ? z.string().min(6, 'La contraseña debe tener al menos 6 caracteres')
        : z.string().min(1, 'La contraseña es obligatoria'),
  });
};

export type AuthFormData = z.infer<ReturnType<typeof buildAuthSchema>>;
