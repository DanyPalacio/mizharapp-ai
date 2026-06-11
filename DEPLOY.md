# 🚀 DEPLOY COMPLETO EN VERCEL — Visual Intelligence Platform
**Una sola app: VisualStats (público) + Mizhar AI (Pro $9.99/mes) · un solo admin de usuarios**

## 1. GitHub
```bash
cd visualintel
git init && git add . && git commit -m "Visual Intelligence Platform"
git remote add origin https://github.com/gptcatolicos-droid/visual-intelligence-platform.git
git branch -M main && git push -u origin main
```
> `.env.local` está en `.gitignore` — las llaves NUNCA se suben al repo.

## 2. Variables de entorno en Vercel (Settings → Environment Variables)
Copia los valores desde tu `.env.local` (incluido en este zip):

| Variable | Notas |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ya configurada (proyecto Mizhar) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ya configurada |
| `SUPABASE_SERVICE_ROLE_KEY` | ⚠️ FALTA: cópiala de Supabase → Settings → API |
| `ANTHROPIC_API_KEY` | configurada |
| `OPENAI_API_KEY` | configurada (embeddings RAG futuros) |
| `FRED_API_KEY` | configurada — macro para Challenge Mode |
| `NEWS_API_KEY` | configurada — señales de sector |
| `NEXT_PUBLIC_PAYPAL_PLAN_URL` | URL del botón de suscripción (paso 5) |

🔐 **Seguridad:** estas llaves estuvieron pegadas en un documento de texto. Después del
primer deploy exitoso, **rótalas** (Anthropic console, OpenAI, FRED, NewsAPI) y actualiza Vercel.

## 3. Supabase Auth (5 minutos)
1. Supabase → Authentication → Providers → **Email**: ON (magic link ya funciona).
2. **Google**: ON → pega Client ID/Secret de Google Cloud Console
   (OAuth consent + credentials → Authorized redirect URI:
   `https://nzgboborhxgvafijcioh.supabase.co/auth/v1/callback`).
3. Authentication → URL Configuration → Site URL: tu dominio de Vercel.
   Redirect URLs: agrega `https://TU-DOMINIO.vercel.app/**`.

## 4. Base de datos — TODO APLICADO ✅
14 tablas migradas con RLS: contenido (dashboards, infographics, usage, sources),
Mizhar (ventures, venture_documents, conversations), usuarios (profiles con plan free/pro),
y capa de conocimiento (pgvector: knowledge_sources, knowledge_chunks, api_cache,
función match_knowledge para RAG). Contenido sembrado: 3 dashboards + 5 infografías.

## 5. PayPal — suscripción recurrente Pro
1. developer.paypal.com → crea un **Subscription Plan** de $9.99/mes.
2. Crea el botón de suscripción; en el código del botón pasa `custom_id = user.id de Supabase`
   (disponible tras login; puedes inyectarlo en la página pricing más adelante).
3. Pega la URL del botón en `NEXT_PUBLIC_PAYPAL_PLAN_URL`.
4. Webhooks → agrega `https://TU-DOMINIO.vercel.app/api/paypal/webhook` con eventos:
   `BILLING.SUBSCRIPTION.ACTIVATED`, `BILLING.SUBSCRIPTION.CANCELLED`, `BILLING.SUBSCRIPTION.EXPIRED`.
   → El webhook actualiza `profiles.plan` a pro/free automáticamente.
5. Para darte acceso Pro manual mientras tanto:
   `update profiles set plan='pro', role='admin' where id='TU_USER_ID';`

## 6. Verificación post-deploy
1. Home: prompt → dashboard. Anónimo funciona; logueado Free = 1/día (mensaje 429 al segundo).
2. Login: Google + magic link → crea perfil free automático.
3. `/venture/new`: wizard 8 preguntas → análisis real con Claude + FRED + News → guarda venture.
4. `/api/intel?industry=saas`: responde macro FRED + noticias (con caché en Supabase).
5. Download HTML de cualquier dashboard (esquema BOSANET).
6. Pricing → botón Pro apunta a PayPal.

## Límite Vercel Hobby
Las funciones tienen timeout de 10s en Hobby; `/api/generate` y `/api/venture/analyze`
usan hasta 60s. **Recomendado: Vercel Pro**, o reducir max_tokens si ves timeouts.
