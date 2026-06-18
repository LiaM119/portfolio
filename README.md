# Portfolio

Portfolio profesional desarrollado con React, Vite, TypeScript, Tailwind CSS y Supabase. El objetivo es presentar proyectos, habilidades, certificaciones e informacion profesional en una experiencia rapida, mantenible y preparada para deploy.

## Demo

Pendiente de agregar URL del deploy.

## Stack

| Area | Tecnologia |
|------|------------|
| Frontend | React 19 + TypeScript |
| Build tool | Vite 8 |
| Estilos | Tailwind CSS |
| Backend de datos | Supabase |
| Calidad | ESLint |
| Deploy recomendado | Vercel |

## Features

- Landing page de portfolio con secciones de perfil, proyectos, habilidades y certificaciones.
- Contenido cargado desde Supabase.
- Panel de administracion protegido por email autorizado.
- Rutas internas `/login` y `/admin` manejadas con History API.
- Configuracion de fallback SPA para refrescar rutas internas en Vercel.

## Screenshots

Agregar capturas reales luego del primer deploy estable. Recomendado:

- Home en desktop.
- Home en mobile.
- Vista de login.
- Panel de administracion sin datos sensibles visibles.

## Setup Local

Requisitos:

- Node.js compatible con Vite 8.
- Una instancia de Supabase configurada.
- Variables de entorno locales en `.env.local`.

Instalacion y desarrollo:

```bash
npm install
npm run dev
```

Verificaciones locales:

```bash
npm run lint
npm run build
```

Preview del build:

```bash
npm run preview
```

## Variables De Entorno

Crear `.env.local` para desarrollo local usando `.env.example` como guia. No subir valores reales al repositorio.

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_ADMIN_EMAIL=
```

| Variable | Uso |
|----------|-----|
| `VITE_SUPABASE_URL` | URL publica del proyecto Supabase. |
| `VITE_SUPABASE_ANON_KEY` | Anon key publica de Supabase para el cliente web. |
| `VITE_ADMIN_EMAIL` | Email autorizado para acceder al panel de administracion. |

## Build

```bash
npm run build
```

El comando ejecuta compilacion TypeScript y genera el build de Vite en `dist`.

## Deploy En Vercel

Vercel es la opcion mas simple para este proyecto porque detecta Vite automaticamente y permite configurar variables de entorno desde el dashboard.

Configuracion recomendada:

| Campo | Valor |
|-------|-------|
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

Configurar estas variables en Vercel antes del deploy:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_ADMIN_EMAIL=
```

### Refresh De Rutas

La app usa routing propio con History API, no React Router. Por eso `/login` y `/admin` necesitan devolver el app shell al refrescar o entrar por URL directa.

Este repositorio incluye `vercel.json` con fallback SPA hacia `/index.html` para cubrir esas rutas en Vercel.

## Que Aprendio Liam

- Preparar una app Vite para produccion requiere mas que pasar el build: tambien hay que cubrir variables de entorno, fallback SPA y documentacion operativa.
- Las rutas manejadas en cliente necesitan configuracion del host para que un refresh no devuelva 404.
- Los secretos no pertenecen al repositorio; el repo debe tener placeholders y el host debe guardar los valores reales.
- Un README profesional tiene que explicar como correr, verificar y desplegar el proyecto sin obligar a reconstruir contexto desde el codigo.

## Estado Del Proyecto

Preparado para deploy en Vercel a nivel de configuracion de repositorio. Falta configurar las variables reales en el dashboard de Vercel y ejecutar el primer deploy.

## Autor

Liam

## Repositorio

https://github.com/LiaM119/portfolio.git
