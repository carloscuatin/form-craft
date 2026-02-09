# DECISIONS.md — Decisiones Técnicas

## 1. Arquitectura Backend: Clean Architecture (Hexagonal)

### Decisión

Se implementó **arquitectura hexagonal** (también conocida como Ports & Adapters) para la capa del backend, separando el código en tres capas:

- **`src/core/domain/`** — Entidades (Form, Response, User), Value Objects (FieldType), Ports (interfaces de repositorios) y Schemas de validación (Zod)
- **`src/core/use-cases/`** — Casos de uso (CreateForm, SubmitResponse, SignIn, SignUp, etc.)
- **`src/infrastructure/`** — Adapters concretos (SupabaseFormRepository, SupabaseResponseRepository, SupabaseAuthRepository) y Mappers

### Justificación

- **Independencia del framework**: El dominio no depende de Supabase, Next.js ni ninguna librería externa. Si mañana se cambia Supabase por Prisma/PostgreSQL directo, solo se reescribe el adapter.
- **Testabilidad**: Los use cases reciben repositorios por inyección de dependencias, permitiendo mocks fácilmente.
- **Separación de responsabilidades**: Cada capa tiene una única razón de cambio.
- **Mappers dedicados**: `FormMapper` y `ResponseMapper` traducen entre el esquema snake_case de la BD y las entidades camelCase del dominio.

### Trade-off

Agrega complejidad estructural para un proyecto relativamente pequeño. Sin embargo, demuestra buenas prácticas de ingeniería de software y escala bien si la aplicación crece.

---

## 2. Esquema de Datos: JSONB vs Tablas Normalizadas

### Decisión

Se usa **JSONB** para dos columnas clave:

- `forms.fields` — Array de configuración de campos
- `responses.answers` — Objeto clave-valor con las respuestas

### Justificación

- **Flexibilidad**: Los formularios son inherentemente dinámicos. Cada formulario puede tener una estructura de campos completamente diferente. Normalizar esto requeriría tablas `form_fields`, `field_options`, `response_answers`, etc., con JOINs complejos.
- **Performance**: Una sola query trae toda la configuración del formulario o todas las respuestas, sin N+1 queries.
- **Esquema auto-contenido**: La definición de campos vive junto al formulario, lo que simplifica la lógica de renderizado dinámico.
- **PostgreSQL soporta índices GIN en JSONB** para queries complejas si fueran necesarias en el futuro.

### Trade-off

- Menor integridad referencial a nivel de BD (se compensa con validación en el use case `SubmitResponseUseCase`).
- Queries de agregación sobre respuestas requieren funciones JSONB (e.g., `jsonb_each`), que son más complejas que un simple `GROUP BY`.

---

## 3. Frontend: Arquitectura de Componentes

### Decisión

Estructura basada en **arquitectura de componentes** con separación por dominio funcional:

```
src/
  components/
    auth/         → Componentes de autenticación
    builder/      → Form builder (editor, panel, preview)
    forms/        → Renderizado dinámico de campos
    dashboard/    → Cards, tablas, gráficas
    ui/           → Componentes base (shadcn/ui)
  hooks/          → Custom hooks (useFormBuilder)
```

### Justificación

- **Reutilización**: `FieldRenderer` se usa tanto en el preview del builder como en el formulario público.
- **Encapsulación de lógica**: `useFormBuilder` hook encapsula toda la lógica del builder (CRUD de campos, drag & drop, opciones).
- **Composición**: Componentes pequeños y enfocados que se componen para crear vistas complejas.

---

## 4. Librerías Elegidas

| Librería      | Propósito            | Justificación                                                                                         |
| ------------- | -------------------- | ----------------------------------------------------------------------------------------------------- |
| **shadcn/ui** | Componentes base     | Componentes accesibles, tipados, y personalizables. No es una dependencia — el código es tuyo.        |
| **@dnd-kit**  | Drag & Drop          | Modular, buen soporte de teclado/accesibilidad, mejor mantenido que react-beautiful-dnd (deprecated). |
| **Recharts**  | Gráficas             | API declarativa, basado en SVG, buen soporte de TypeScript y responsive.                              |
| **Sonner**    | Notificaciones toast | Ligero, animaciones suaves, integración nativa con shadcn.                                            |
| **DM Sans**   | Tipografía           | Fuente geométrica moderna con excelente legibilidad en UI.                                            |

---

## 5. Autenticación bajo Hexagonal Architecture

### Decisión

La autenticación se implementó bajo la **misma arquitectura hexagonal** que el resto del backend, en lugar de llamar directamente a `supabase.auth` desde los server actions.

### Estructura

| Capa          | Archivo                                                        | Responsabilidad                  |
| ------------- | -------------------------------------------------------------- | -------------------------------- |
| **Entidad**   | `core/domain/entities/user.ts`                                 | `User`, `SignInDTO`, `SignUpDTO` |
| **Port**      | `core/domain/ports/auth-repository.ts`                         | Interfaz `AuthRepository`        |
| **Use Cases** | `core/use-cases/sign-in.ts`, `sign-up.ts`, etc.                | Lógica de negocio                |
| **Adapter**   | `infrastructure/adapters/supabase/supabase-auth-repository.ts` | Implementación con Supabase Auth |
| **Actions**   | `app/actions/auth.ts`                                          | Orquestación (wiring + redirect) |

### Justificación

- **Antes**: Los server actions llamaban directamente a `supabase.auth.signUp()`, `supabase.auth.getUser()`, etc. Si se cambiaba el proveedor de autenticación, había que reescribir los actions, el layout del dashboard, y `requireAuth()` en forms.
- **Ahora**: El dominio define `AuthRepository` como port. Cambiar de Supabase Auth a Auth0, Firebase, o auth propio solo requiere escribir un nuevo adapter.
- **`getUser()` retorna `User`** (entidad del dominio) en vez del `User` de Supabase, eliminando el acoplamiento `user.user_metadata.full_name` en componentes.

### Excepción: Middleware (`proxy.ts`)

El middleware de Next.js mantiene acceso directo a Supabase porque necesita manipular cookies a nivel HTTP para refrescar sesiones. Es infraestructura de transporte, no lógica de aplicación.

---

## 6. Row Level Security (RLS)

### Políticas implementadas:

- **Forms**: Los usuarios solo ven/editan/eliminan sus propios formularios. Los formularios publicados son visibles para todos (SELECT).
- **Responses**: Cualquiera puede INSERT respuestas a formularios publicados. Solo el creador del formulario puede SELECT las respuestas.

### Decisión clave

Se creó una **función RPC** (`get_form_with_response_count`) con `SECURITY DEFINER` para obtener formularios con conteo de respuestas en una sola query, evitando N+1 queries y respetando RLS.

---

## 7. Manejo de Estado del Builder

### Decisión

Se creó un custom hook `useFormBuilder` en lugar de usar una librería de estado global (Redux, Zustand).

### Justificación

- El estado del builder es local a la página del editor. No necesita ser global.
- El hook encapsula toda la lógica: CRUD de campos, reordenamiento, operaciones sobre opciones.
- Usa `useState` y `useCallback` para performance (evita re-renders innecesarios en los items del sortable).

---

## 8. Uso de Herramientas de IA

Durante el desarrollo se utilizó **Cursor** con Claude como asistente principal:

- **Generación de estructura**: La IA ayudó a scaffold la estructura inicial de directorios y boilerplate.
- **Componentes de UI**: Los componentes base fueron generados y luego refinados manualmente (especialmente estilos y responsive design).
- **Esquema SQL y RLS**: Se generó una base y se ajustaron las políticas RLS para el caso específico de formularios públicos con respuestas anónimas.
- **Revisión manual**: Todo el código generado fue revisado, comprendido y ajustado según las necesidades específicas del proyecto.

---

## 9. Validación: react-hook-form + Zod

### Decisión

Se integró **react-hook-form** con **Zod** como sistema de validación, reemplazando la validación manual con if/else.

### Arquitectura

Los schemas de Zod se separan por responsabilidad:

- **Dominio** (`core/domain/schemas/auth.ts`) — Schemas de validación del servidor (login, registro). Los usan los Server Actions.
- **Componentes** (`components/auth/auth-form-schema.ts`, `components/forms/response-schema.ts`, `components/forms/form-defaults.ts`) — Schemas y defaults para react-hook-form. Son adaptadores UI, no lógica de negocio.

### Flujo de validación

1. **Cliente**: `react-hook-form` + `zodResolver` valida antes de enviar (UX inmediata, schemas en la capa de componentes)
2. **Servidor**: `schema.safeParse()` en los Server Actions (defensa en profundidad, schemas en la capa de dominio)
3. **Use Case**: Validación de negocio adicional (formulario publicado, opciones válidas en selects)

### Justificación

| Aspecto                   | Antes (manual)              | Ahora (RHF + Zod)                               |
| ------------------------- | --------------------------- | ----------------------------------------------- |
| **Schemas**               | Validación if/else dispersa | Schemas declarativos y reutilizables            |
| **Tipos**                 | Manuales                    | Inferidos automáticamente con `z.infer<>`       |
| **Client-side**           | `validate()` custom         | `zodResolver` integrado con react-hook-form     |
| **Server-side**           | Validación manual           | `schema.safeParse()` con los mismos schemas     |
| **Formularios dinámicos** | N/A                         | `buildResponseSchema()` genera schemas al vuelo |

### Trade-off

Agrega dos dependencias (`react-hook-form`, `@hookform/resolvers`), pero elimina código de validación manual propenso a errores y garantiza consistencia entre cliente y servidor.

---

## 10. Server Actions vs API Routes

### Decisión

Se usaron **Server Actions** de Next.js en lugar de API Routes.

### Justificación

- Tipado end-to-end sin necesidad de definir schemas de request/response separados.
- Integración directa con `revalidatePath` para invalidación de cache.
- Menos boilerplate que API Routes.
- Las Server Actions actúan como la capa de "controllers" que orquestan los use cases de la arquitectura hexagonal.
