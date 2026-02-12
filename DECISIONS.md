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

## 3. Frontend: Vertical Slicing (Arquitectura por Features)

### Decisión

El frontend sigue **vertical slicing** (también conocido como **feature-based architecture** o **slice-by-feature**): cada **slice** o feature (auth, dashboard, forms, builder, theme) es una **unidad vertical autocontenida** con su propio `index.ts` como API pública, y agrupa dentro de sí componentes, hooks, contexto y schemas. No existe carpeta global `components/hooks`; cada feature lleva sus hooks en una subcarpeta `hooks/` si los necesita (ej. `builder/hooks/`).

Estructura actual (cada carpeta bajo `components/` es un slice vertical):

```
components/
  auth/         → AuthForm, auth-form-schema (index exporta la API)
  builder/      → form-builder, context, schema + layout/, fields/, preview/, hooks/
  dashboard/    → Navbar, FormCard, EmptyState, ResponseTable, etc. + charts/, list/, layout/, responses/
  forms/        → PublicForm, FieldRenderer, response-schema, form-defaults (public/, renderer/)
  theme/        → ThemeProvider, ThemeToggle
  ui/           → Primitivos shadcn (sin index; import por archivo)
```

Las páginas importan desde el barrel del feature: `import { FormBuilder } from '@/components/builder'`, `import { AuthForm } from '@/components/auth'`. La convención completa está en el [README](./README.md#convenciones-de-componentes-vertical-slicing).

### Justificación

- **Vertical slicing**: Cada slice corta “en vertical” la capa de presentación: todo lo que pertenece a un flujo (login, builder, dashboard) vive junto. Cambios en el builder no dispersan archivos por `components/` y `hooks/`; todo está en `builder/`.
- **API pública por slice**: El `index.ts` de cada feature define qué se expone al resto de la app. El resto son detalles internos del slice (layout, campos, hooks), lo que reduce acoplamiento y facilita refactors.
- **Hooks por feature, no globales**: Evitamos un cajón de sastre `src/hooks/` con lógica de un solo feature. Cada slice lleva sus hooks (use-form-builder, use-form-builder-dnd, use-form-builder-save en `builder/hooks/`). Solo hooks de utilidad realmente reutilizables (useDebounce, useMediaQuery) tendrían sentido en `src/hooks/` si se añaden.
- **Escalabilidad**: Si un slice crece (como el builder), se subdivide en subcarpetas (layout, fields, preview, hooks) con sus propios `index.ts`, sin contaminar la raíz de `components/`.
- **Reutilización controlada**: `FieldRenderer` se usa en el preview del builder y en el formulario público; se exporta desde `@/components/forms` y el builder lo importa desde ahí, manteniendo una única fuente de verdad.
- **Composición**: Componentes pequeños y enfocados que se componen por feature; la app orquesta slices, no decenas de componentes sueltos.

---

## 4. Librerías Elegidas

| Librería                           | Propósito                   | Justificación                                                                                         |
| ---------------------------------- | --------------------------- | ----------------------------------------------------------------------------------------------------- |
| **shadcn/ui**                      | Componentes base            | Componentes accesibles, tipados, y personalizables. No es una dependencia — el código es tuyo.        |
| **@dnd-kit**                       | Drag & Drop                 | Modular, buen soporte de teclado/accesibilidad, mejor mantenido que react-beautiful-dnd (deprecated). |
| **Recharts**                       | Gráficas                    | API declarativa, basado en SVG, buen soporte de TypeScript y responsive.                              |
| **Sonner**                         | Notificaciones toast        | Ligero, animaciones suaves, integración nativa con shadcn.                                            |
| **next-themes**                    | Tema claro/oscuro/sistema   | Integración con React, persiste preferencia, evita flash; se usa con `ThemeProvider` y `ThemeToggle`. |
| **class-variance-authority (cva)** | Variantes de componentes    | Usado por shadcn para variantes (e.g. `button({ variant: 'outline' })`).                              |
| **clsx** + **tailwind-merge**      | Clases condicionales (`cn`) | `utils/cn.ts` combina ambas: clases condicionales sin conflictos de Tailwind.                         |
| **tw-animate-css**                 | Animaciones                 | Animaciones para componentes shadcn (dropdowns, dialogs).                                             |
| **Tailwind CSS v4**                | Estilos                     | Utility-first; v4 con `@import 'tailwindcss'` y PostCSS.                                              |
| **Zod v4**                         | Validación y tipos          | Schemas de validación; tipos inferidos con `z.infer<>`; usados en dominio y formularios.              |
| **DM Sans** + **JetBrains Mono**   | Tipografía                  | DM Sans para UI (layout); JetBrains Mono para código/mono si se usa.                                  |

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

### Respuestas anónimas

Las respuestas a formularios públicos son **anónimas**: quien envía no necesita cuenta. Una migración posterior (`20260210001249_drop_anon_select_responses.sql`) eliminó la política que permitía a `anon` leer respuestas. Así, el rol anónimo solo puede **INSERT**; solo el creador del formulario (usuario autenticado vía RLS) puede **SELECT** sobre sus respuestas. No se almacena identidad del encuestado.

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

## 10. Testing: Jest (unit) + Playwright (E2E)

### Decisión

Se adoptó una estrategia de testing en dos niveles:

- **Tests unitarios**: Jest + Testing Library en `__tests__/` dentro de cada slice o módulo (componentes, use cases, mappers). Cubren lógica de negocio, componentes aislados y validación.
- **Tests E2E**: Playwright en `tests/e2e/`, contra la app real en `http://localhost:3000`. Cubren flujos de usuario (home, login, dashboard, tema claro/oscuro).

### Estructura E2E

- **`playwright.config.ts`**: `baseURL`, `webServer` (arranca `npm run dev` si hace falta), proyectos Chromium/Firefox/WebKit.
- **`tests/e2e/home.spec.ts`**: Home, enlaces a login/registro, cambio de tema.
- **`tests/e2e/dashboard.spec.ts`**: Acceso sin auth (redirect o error), dashboard con empty state y navegación al builder; los tests que requieren login usan `E2E_TEST_EMAIL` y `E2E_TEST_PASSWORD` y se omiten si no están definidas.

### Justificación

- **Jest**: Ya está integrado en el ecosistema React/Next, rápido para unit tests y buena integración con jsdom y Testing Library.
- **Playwright**: Multi-navegador, API estable, soporte para esperar navegación y red, y posibilidad de reutilizar servidor existente (`reuseExistingServer`). Los tests E2E no dependen de credenciales en el repo: los flujos autenticados se saltan en CI si no se configuran variables de entorno.

### Trade-off

Mantener dos runners (Jest y Playwright) y, para E2E con login, variables de entorno opcionales. A cambio se obtiene cobertura de flujos críticos sin hardcodear usuarios de prueba.

---

## 11. Server Actions vs API Routes

### Decisión

Se usaron **Server Actions** de Next.js en lugar de API Routes.

### Justificación

- Tipado end-to-end sin necesidad de definir schemas de request/response separados.
- Integración directa con `revalidatePath` para invalidación de cache.
- Menos boilerplate que API Routes.
- Las Server Actions actúan como la capa de "controllers" que orquestan los use cases de la arquitectura hexagonal.

---

## 12. Composition Root: dos contenedores (server vs browser)

### Decisión

La inyección de dependencias y el wiring de use cases se centralizan en **dos contenedores**:

- **`infrastructure/container.ts`** — Raíz de composición para **servidor**: crea repositorios con `createServerSupabaseClient()` (async, cookies de Next) y devuelve use cases de auth, forms y responses. Lo usan las Server Actions y las páginas del App Router.
- **`infrastructure/browser-container.ts`** — Raíz de composición para **cliente**: crea el cliente Supabase del navegador y devuelve solo el use case que necesita el cliente hoy (`SubscribeToNewResponsesUseCase`). Lo usa el hook `useSubscribeToNewResponses` en el dashboard.

### Justificación

- **Servidor**: Necesita acceso a cookies para sesión; `createServerSupabaseClient` es async y usa `cookies()` de Next. Todos los use cases que orquestan las Server Actions se crean aquí.
- **Cliente**: Solo se necesita Realtime (suscripción a nuevas respuestas). Un cliente Supabase en el navegador no comparte cookies con el servidor de la misma forma; Realtime es un canal de Supabase que tiene sentido solo en el cliente. Por eso existe un contenedor aparte que solo expone el use case de suscripción.
- **Un solo lugar que conoce core + infrastructure**: Cada contenedor es el único que importa adaptadores concretos (Supabase) y use cases; el resto de la app depende de los casos de uso, no del origen de los datos.

### Trade-off

Dos archivos de wiring en vez de uno. A cambio, la separación servidor/cliente queda clara y no se mezclan dependencias async de servidor con código que corre en el navegador.

---

## 13. Clientes Supabase: tres contextos (server, middleware, browser)

### Decisión

En `infrastructure/adapters/supabase/client.ts` hay **tres factories** de cliente Supabase:

| Factory                                   | Uso                           | Cookies / contexto                    |
| ----------------------------------------- | ----------------------------- | ------------------------------------- |
| `createServerSupabaseClient()`            | Server Components, Actions    | `cookies()` de Next                   |
| `createMiddlewareSupabaseClient(request)` | Middleware (proxy)            | `request.cookies` + respuesta mutable |
| `createBrowserSupabaseClient()`           | Componentes cliente, Realtime | Navegador (automático)                |

Todos usan `@supabase/ssr` (createServerClient / createBrowserClient) con las mismas env vars.

### Justificación

- **Next.js maneja cookies de forma distinta** en cada contexto: en servidor se usa el API de `next/headers` (cookies()), en middleware se usa el `NextRequest` y hay que propagar cambios a la respuesta con `setAll`, y en el navegador el cliente de Supabase lo hace solo.
- **Refresco de sesión**: El middleware puede refrescar la sesión antes de que llegue a la página; por eso el cliente de middleware devuelve `{ supabase, getResponse }` para que los cookies actualizados se envíen en la respuesta.
- **Un solo archivo** concentra la creación de clientes y evita duplicar la lógica de env y opciones de cookies.

### Trade-off

Tres APIs en lugar de una; cualquier cambio en cómo se leen/escriben cookies debe tenerse en cuenta en los tres. La documentación en DECISIONS y en el propio `client.ts` reduce el riesgo de mal uso.

---

## 14. Realtime: suscripción a nuevas respuestas (hexagonal en el cliente)

### Decisión

La funcionalidad **“ver nuevas respuestas en tiempo real”** en la página de detalle del formulario se implementó siguiendo la **misma arquitectura hexagonal** que el resto del backend, pero con un use case que solo se ejecuta en el **cliente**:

- **Port**: `ResponseRepository.subscribe(formId, onNewResponse)` — devuelve una función de limpieza para cancelar la suscripción.
- **Use case**: `SubscribeToNewResponsesUseCase` — delega en el port.
- **Adapter**: `SupabaseResponseRepository` implementa `subscribe` con Supabase Realtime (canal por `form_id`, filtro INSERT).
- **Composition root**: `browser-container.ts` crea el use case con el repo que usa `createBrowserSupabaseClient()`.
- **UI**: El hook `useSubscribeToNewResponses` (en el slice dashboard) llama al use case y mantiene la referencia al callback estable para no re-suscribirse en cada render.

### Justificación

- **Consistencia**: Realtime no es “un hack en un componente”; es un caso de uso con contrato en el dominio. Si mañana se cambia de Supabase Realtime a otro canal (WebSockets propios, Pusher, etc.), solo se cambia el adapter.
- **Testabilidad**: El use case se puede probar con un mock del repo que emita eventos; no hace falta levantar Supabase.
- **Cliente obligatorio**: Realtime requiere conexión persistente desde el navegador; por eso este use case vive en el browser container y no en el server container.

### Trade-off

Más capas para una sola feature de Realtime. A cambio, el “por qué” y el “dónde” de la suscripción están claros y el dominio no conoce Supabase.

---

## 15. Middleware de protección de rutas (proxy)

### Decisión

La lógica de **protección de rutas y redirecciones** según sesión está en **`src/proxy.ts`** (función `proxy` y `config`):

- **Rutas protegidas** (`/dashboard`, `/builder`): si no hay usuario, redirección a `/login` con `redirectTo` en query.
- **Rutas de auth** (`/login`, `/register`): si ya hay usuario, redirección a `/dashboard`.
- **Sesión**: Se usa `createMiddlewareSupabaseClient(request)` para refrescar la sesión antes de decidir la redirección.

Para que Next.js ejecute este middleware, debe existir un archivo **`middleware.ts`** en la raíz del proyecto (o en `src/` según la convención del proyecto) que exporte por **default** la función `proxy` (por ejemplo `export { proxy as default } from '@/proxy'` o importando desde `./src/proxy`).

### Justificación

- **Un solo lugar** para rutas protegidas y redirecciones; fácil de leer y modificar.
- **Refresco de sesión en middleware**: Supabase SSR recomienda refrescar la sesión en el middleware para que las páginas reciban ya una sesión actualizada.
- **redirectTo**: Permite volver a la página solicitada tras el login.

### Trade-off

Si no se configura el archivo `middleware.ts` que exporta `proxy`, la protección no se aplica y las páginas del dashboard pueden mostrarse (y fallar por `requireAuth()` en las actions). Es importante documentar este paso en el README o en la guía de configuración.

---

## 16. Calidad de código: Husky, lint-staged, Prettier, ESLint

### Decisión

En pre-commit (Husky) se ejecuta **lint-staged**, que a su vez:

- **ESLint** (con `--fix`) y **Prettier** (con `--write`) sobre `*.{ts,tsx}`.
- **Prettier** sobre `*.{json,css,md}`.

Así, todo lo que se sube al repositorio cumple un estilo y reglas de lint coherentes.

### Justificación

- **Pre-commit**: Evita que se haga commit de código que rompa lint o formato; el coste es mínimo y mantiene la base de código uniforme.
- **Prettier + ESLint**: Prettier se encarga del formato; ESLint de reglas (imports, React, Next). Se usa `eslint-config-prettier` para desactivar reglas de formato de ESLint y evitar conflictos.
- **lint-staged**: Solo se ejecuta sobre archivos staged, así el pre-commit sigue siendo rápido.

### Trade-off

Quienes hacen commit deben tener el entorno listo (Node, dependencias) para que Husky ejecute los scripts. Si algo falla, el commit se rechaza hasta corregir lint/format; eso puede ser molesto si hay muchas correcciones pendientes, pero mantiene la calidad.
