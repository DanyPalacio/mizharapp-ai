# MIZHAR AI — Business Intelligence Platform

## 🚀 Deploy Rápido

### 1. Instalar
```bash
npm install
```

### 2. Variables de Entorno REQUERIDAS
Copia `.env.example` a `.env.local` y configura:

**CRÍTICAS** (app no funcionará sin estas):
```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
```

**OPCIONALES** (funcionalidades específicas):
```env
SUPABASE_SERVICE_ROLE_KEY=tu-service-key
ANTHROPIC_API_KEY=sk-ant-tu-key
NEXT_PUBLIC_PAYPAL_CLIENT_ID=tu-client-id
PAYPAL_SECRET=tu-secret
NEXT_PUBLIC_APP_URL=https://tu-app.com
```

### 3. Deploy en Vercel
```bash
git init
git add .
git commit -m "initial commit"
git push
```

Conecta en vercel.com y agrega las variables de entorno.

### 4. Deploy en Render
Mismo proceso, pero agrega:
```env
NODE_VERSION=20.18.0
```

## ✅ QUÉ ESTÁ INCLUIDO

### SEO Ninja 🥷
- ✅ Google Analytics (G-9CH2G095SN)
- ✅ 150+ keywords optimizados
- ✅ Schema.org markup
- ✅ Open Graph + Twitter Cards
- ✅ Sitemap.xml dinámico
- ✅ Robots.txt optimizado

### Funcionalidad Completa
- ✅ Homepage con hero + features
- ✅ Pricing page
- ✅ Login + Onboarding
- ✅ Blog system
- ✅ Admin dashboard
- ✅ API routes (25+ endpoints)
- ✅ Payment integration (PayPal)
- ✅ 404 + Error pages
- ✅ Loading states

### Performance
- ✅ Tailwind CSS optimizado
- ✅ Next.js 14 App Router
- ✅ Image optimization
- ✅ Font optimization
- ✅ Code splitting

## ⚠️ ANTES DEL PRIMER DEPLOY

### 1. Crear Proyecto Supabase
1. Ve a [supabase.com](https://supabase.com)
2. Crea nuevo proyecto
3. Copia URL y keys a `.env.local`

### 2. Conseguir API Keys
- **Anthropic**: [console.anthropic.com](https://console.anthropic.com)
- **PayPal**: [developer.paypal.com](https://developer.paypal.com)

### 3. Imágenes (Opcional)
Si quieres personalizar:
- `/public/og-image.svg` - Open Graph image
- `/public/favicon.ico` - Ya incluido
- `/public/logo.png` - Para branding

## 📊 Monitoreo

Google Analytics está configurado. Para ver stats:
1. Ve a [analytics.google.com](https://analytics.google.com)
2. Busca property ID: G-9CH2G095SN

## 🐛 Troubleshooting

### Build falla
- Verifica Node.js 20.x
- Verifica todas las env vars están configuradas
- Ejecuta `npm install` de nuevo

### Runtime errors
- Revisa logs de Vercel/Render
- Verifica Supabase está activo
- Verifica API keys son válidas

## 📚 Documentación

- **SEO-NINJA-REPORT.md** - Estrategia SEO completa
- **AUDIT_CHECKLIST.md** - Checklist de auditoría

## 🎯 Próximos Pasos Después del Deploy

1. Configurar Google Search Console
2. Submit sitemap.xml
3. Configurar dominio custom
4. Agregar contenido al blog
5. Configurar email marketing

---

**Version**: 2.0.0  
**SEO Score**: 96/100 🥷  
**Ready**: ✅ PRODUCTION
