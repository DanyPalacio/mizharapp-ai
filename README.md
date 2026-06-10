# Visual Intelligence Platform
**VisualStats.ai + Mizhar — una sola app Next.js 15, deploy en Vercel, datos en Supabase.**

## Arquitectura
- `/` — Home VisualStats: prompt box → dashboard IA
- `/dashboards`, `/dashboards/[slug]` — índice y renderer interactivo (Recharts)
- `/infographics` — módulo de infografías (pendiente)
- `/venture/*` — Mizhar Venture OS: sidebar grafito + naranja
- `/api/generate` — pipeline IA (Claude estructura el dashboard → Supabase)

## Pantallas Mizhar ya rediseñadas según feedback
- **Overview**: score por dimensión con explicación al hacer clic (rationale + peso)
- **Business Plan**: deck corporativo — cover oscuro, secciones en tarjetas con color,
  timeline de milestones, tabla financiera editable celda a celda con CAGR en vivo,
  export CSV (Excel) y Print/PDF
- **Challenge Mode**: VC Grade, radar de 6 dimensiones, distribución de riesgos,
  cards expandibles con severity bars y recomendaciones accionables

## Setup
1. `npm install`
2. Restaurar el proyecto Supabase "Mizhar" y ejecutar `supabase/schema.sql` en el SQL Editor
3. Copiar `.env.example` → `.env.local` con tus llaves
4. `npm run dev` / deploy a Vercel con las mismas env vars

## Patrones Next.js 15 aplicados (validados en mizhar.app)
- `params: Promise<{}>` con `await params` en rutas dinámicas
- `export const dynamic = "force-dynamic"` en API routes y páginas con datos
- Supabase `createClient` con placeholders para no romper el build
