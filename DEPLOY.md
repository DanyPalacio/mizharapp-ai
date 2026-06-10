# 🚀 DEPLOY EN VERCEL — Visual Intelligence Platform

## 1. Subir a GitHub
```bash
cd visualintel
git init && git add . && git commit -m "Visual Intelligence Platform v1"
# Crea el repo en GitHub (cuenta gptcatolicos-droid) y luego:
git remote add origin https://github.com/gptcatolicos-droid/visual-intelligence-platform.git
git branch -M main && git push -u origin main
```

## 2. Importar en Vercel
1. vercel.com → **Add New → Project** → importa el repo
2. Framework: **Next.js** (auto-detectado). Build command y output: por defecto.

## 3. Variables de entorno (Settings → Environment Variables)

| Variable | Valor |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://nzgboborhxgvafijcioh.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | el **anon key** (Supabase → Settings → API Keys → `anon`) |
| `SUPABASE_SERVICE_ROLE_KEY` | el **service_role key** (misma página — ⚠️ secreto, nunca en cliente) |
| `ANTHROPIC_API_KEY` | tu llave de console.anthropic.com |
| `OPENAI_API_KEY` | opcional (capa de razonamiento futura) |

> El anon key actual empieza con `eyJhbGciOiJIUzI1...` — cópialo completo desde el
> panel de Supabase del proyecto **Mizhar** (nzgboborhxgvafijcioh).

## 4. Base de datos — YA APLICADA ✅
El proyecto Supabase **Mizhar** está restaurado (`ACTIVE_HEALTHY`) con las 8 tablas
migradas y RLS activo: `profiles`, `dashboards`, `infographics`, `user_usage`,
`data_sources`, `ventures`, `venture_documents`, `conversations`.
No tienes que ejecutar nada — `supabase/schema.sql` queda en el repo como referencia.

## 5. Deploy
Click **Deploy**. Con cada `git push` a `main`, Vercel redespliega automáticamente.

## 6. Verificación post-deploy
1. **Home** → escribe "Compara Nvidia vs AMD" → Generate → debe redirigir a `/dashboards/...`
2. **Carga de archivo** → 📎 sube un CSV/XLSX o una imagen de un reporte → el dashboard
   sale de TUS datos (modos `prompt_file` / `prompt_image`)
3. **Download HTML** → en cualquier dashboard, descarga el HTML autocontenido
   con el esquema BOSANET (Chart.js + fuentes por CDN, compatible WhatsApp/email)
4. **/venture** → Overview (clic en cards = explicación del score), Business Plan
   (tabla editable + export CSV/PDF), Challenge Mode, Marketing Plan (6 tabs),
   Financials (runway en vivo), Market Intelligence (5 sub-tabs)

## Patrones Next.js 15 ya aplicados (validados en mizhar.app)
- Rutas dinámicas: `params: Promise<{slug:string}>` + `await params`
- API routes y páginas con datos: `export const dynamic = "force-dynamic"`
- Supabase `createClient` con placeholders → el build nunca falla por env vars ausentes
- `maxDuration = 60` en `/api/generate` (Vercel Pro permite hasta 60s; en plan Hobby
  el límite es 10s — si la generación da timeout, considera Pro o reducir max_tokens)

## Estructura del proyecto
```
app/
  page.tsx                      → Home: prompt box + carga CSV/XLSX/imagen
  api/generate/route.ts         → Pipeline IA (Claude Vision + parser XLSX)
  api/export/[slug]/route.ts    → Export HTML esquema BOSANET
  dashboards/                   → Índice + detalle interactivo (Recharts)
  venture/                      → Mizhar OS (sidebar grafito/naranja)
lib/
  dashboardHtml.ts              → Generador HTML autocontenido (esquema BOSANET)
  ai.ts · supabase.ts           → Capas de IA y datos
supabase/schema.sql             → Schema completo (ya migrado)
```
