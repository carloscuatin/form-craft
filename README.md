# FormCraft — Generador de Formularios Dinámicos

Aplicación web para crear formularios personalizados con drag & drop, compartirlos mediante link público y visualizar las respuestas con gráficas y estadísticas.

## Stack Tecnológico

- **Frontend**: React + TypeScript + Next.js 16 (App Router)
- **Backend**: Server Actions de Next.js + Arquitectura Hexagonal
- **BaaS**: Supabase (PostgreSQL, Auth)
- **UI**: shadcn/ui + Tailwind CSS
- **Drag & Drop**: @dnd-kit
- **Gráficas**: Recharts
- **Deployment**: Vercel

## Requisitos Previos

- Node.js >= 18
- npm >= 9
- Cuenta de Supabase (capa gratuita)

## Configuración Local

### 1. Clonar el repositorio

```bash
git clone https://github.com/carloscuatin/form-craft.git
cd form-craft
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar Supabase

1. Crea un proyecto en [Supabase](https://supabase.com)
2. Ve a **SQL Editor** y ejecuta el contenido de `supabase/migrations/20260208033356_initial_schema.sql`
3. Copia las credenciales de tu proyecto (Settings → API)

### 4. Variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=tu-publishable-key
```

### 5. Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Estructura del Proyecto

```
src/
├── app/                          # Next.js App Router
│   ├── actions/                  # Server Actions (orquestación)
│   ├── builder/                  # Editor de formularios
│   ├── dashboard/                # Dashboard + detalle de respuestas
│   ├── forms/[id]/               # Formulario público
│   ├── login/                    # Página de login
│   └── register/                 # Página de registro
│
├── core/                         # 🏛️ Arquitectura Hexagonal
│   ├── domain/
│   │   ├── entities/             # Form, Response
│   │   ├── ports/                # Interfaces de repositorios
│   │   └── value-objects/        # FieldType, constantes
│   └── use-cases/                # Casos de uso del negocio
│
├── infrastructure/               # 🔌 Adapters
│   ├── adapters/supabase/        # Implementación Supabase
│   └── mappers/                  # Transformación Domain ↔ DB
│
├── components/                   # 🎨 Componentes React
│   ├── auth/                     # Formulario de login/registro
│   ├── builder/                  # Builder: editor, preview, panel
│   ├── dashboard/                # Cards, tablas, gráficas
│   ├── forms/                    # Renderer dinámico de campos
│   └── ui/                       # shadcn/ui base
│
├── hooks/                        # Custom hooks
└── lib/                          # Utilidades (Supabase client, cn)
```

## Funcionalidades

### Core (Implementado)

- ✅ Autenticación (login/registro) con Supabase Auth
- ✅ Protección de rutas con middleware
- ✅ Form Builder con drag & drop
- ✅ 6 tipos de campo: texto corto, texto largo, número, fecha, selección única, selección múltiple
- ✅ Vista previa en tiempo real
- ✅ Formularios públicos con URL única
- ✅ Validación client-side y server-side
- ✅ Dashboard con listado y contador de respuestas
- ✅ Tabla de respuestas
- ✅ Gráficas (pie chart y barras) para campos de selección
- ✅ Copiar link público al portapapeles
- ✅ RLS en PostgreSQL
- ✅ Diseño responsive (desktop y mobile)

### Arquitectura

- ✅ Arquitectura Hexagonal (Clean Architecture) en backend
- ✅ Arquitectura de Componentes en frontend
- ✅ TypeScript estricto
- ✅ Separación de responsabilidades

## Esquema de Base de Datos

El esquema SQL con RLS se encuentra en:

```
supabase/migrations/20260208033356_initial_schema.sql
```

## Decisiones Técnicas

Ver [DECISIONS.md](./DECISIONS.md) para una explicación detallada de las decisiones de arquitectura, librerías y trade-offs.

## Credenciales de Prueba

Puedes registrarte con cualquier email y contraseña (mínimo 6 caracteres) o usar las credenciales de prueba:

- **Email**: test@formcraft.com
- **Password**: formcraft123

## Deploy

El proyecto está desplegado en Vercel:

- URL: [https://form-craft.vercel.app/]

## Licencia

MIT
