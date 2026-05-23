# 🚀 DEPLOYMENT QUICK START

## ⚡ VERCEL (Recomendado - Más Rápido)

### 1. Push a GitHub
```bash
git init
git add .
git commit -m "Ready for deployment"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

### 2. Deploy en Vercel
1. Ve a [vercel.com/new](https://vercel.com/new)
2. Import tu repo de GitHub
3. Agrega estas variables de entorno:

```
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
ANTHROPIC_API_KEY=sk-ant-tu-key
NEXT_PUBLIC_PAYPAL_CLIENT_ID=tu-paypal-client-id
PAYPAL_SECRET=tu-paypal-secret
NEXT_PUBLIC_APP_URL=https://tu-app.vercel.app
```

4. Click "Deploy"

✅ **Listo en 3-5 minutos**

---

## 🚢 RENDER (Alternativa)

### 1. Push a GitHub (mismo comando de arriba)

### 2. Deploy en Render
1. Ve a [render.com/dashboard](https://render.com/dashboard)
2. New + → Web Service
3. Conecta tu repo de GitHub
4. Configura:
   - Build: `npm install && npm run build`
   - Start: `npm run start`

5. **CRÍTICO**: Agrega estas variables (en orden):

```
NODE_VERSION=20.18.0
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://tu-app.onrender.com
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
ANTHROPIC_API_KEY=sk-ant-tu-key
NEXT_PUBLIC_PAYPAL_CLIENT_ID=tu-paypal-client-id
PAYPAL_SECRET=tu-paypal-secret
```

6. Click "Create Web Service"

✅ **Listo en 10-15 minutos**

---

## 🔑 Donde Conseguir las Variables

### Supabase (Database + Auth)
1. Ve a [supabase.com/dashboard](https://supabase.com/dashboard)
2. Tu proyecto → Settings → API
3. Copia:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon/public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY`

### Anthropic (AI Engine)
1. Ve a [console.anthropic.com](https://console.anthropic.com)
2. API Keys → Create Key
3. Copia → `ANTHROPIC_API_KEY`

### PayPal (Payments)
1. Ve a [developer.paypal.com](https://developer.paypal.com)
2. My Apps & Credentials
3. Copia:
   - Client ID → `NEXT_PUBLIC_PAYPAL_CLIENT_ID`
   - Secret → `PAYPAL_SECRET`

---

## ❌ Si el Deploy Falla

### Vercel: "Node.js version error"
→ Verifica que `package.json` tenga:
```json
"engines": {
  "node": "20.x"
}
```

### Render: "next: not found"
→ Asegúrate de agregar:
```
NODE_VERSION=20.18.0
```

### Ambos: "Missing environment variable"
→ Verifica que TODAS las variables requeridas estén configuradas

---

## ✅ Checklist Final

Antes de hacer deploy, verifica:
- [ ] Código pushed a GitHub
- [ ] Todas las variables de entorno copiadas
- [ ] Supabase project activo
- [ ] Anthropic API key válida
- [ ] PayPal credentials correctas

---

## 📱 URLs de Deployment

Después del deploy, tu app estará en:
- **Vercel**: `https://tu-app.vercel.app`
- **Render**: `https://tu-app.onrender.com`

Actualiza `NEXT_PUBLIC_APP_URL` con la URL correcta.

---

**Tiempo total estimado**: 15-20 minutos  
**Dificultad**: Fácil ⭐⭐☆☆☆

¡Listo para producción! 🎉
