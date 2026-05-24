# 🔧 TROUBLESHOOTING — ERRORES DE BUILD

## ❌ ERROR 1: "prisma: command not found" (Vercel/Render)

### Causa
El `package.json` antiguo tiene un script `"postinstall": "prisma generate"` pero Prisma NO está instalado.

### Solución
✅ **USAR EL NUEVO `package.json`** del ZIP `mizhar-COMPLETE-FINAL.zip`

El nuevo package.json NO tiene:
- ❌ Script "postinstall" 
- ❌ Dependencia de Prisma
- ❌ Paquetes deprecados

---

## ❌ ERROR 2: "sh: 1: next: not found" (Render)

### Causa
Next.js no se instaló correctamente.

### Solución
En Render, cambiar el **Build Command** a:
```bash
npm ci && npm run build
```

Y agregar estas **Environment Variables**:
```
NODE_VERSION=20.18.0
NODE_ENV=production
```

---

## ❌ ERROR 3: Warnings de paquetes deprecados

### Paquetes con warnings que viste:
- inflightsl@1.0.6
- rimaf
- @humanwhocodes/object-schema@2.0.3
- @supabase/auth-helpers-nextjs@0.10.0
- glob@7.2.3
- eslint@8.57.1

### Causa
Código viejo con dependencias antiguas.

### Solución
✅ **USAR EL NUEVO CÓDIGO** del ZIP actualizado.

El nuevo package.json usa:
- ✅ Next.js 15.0.3 (latest)
- ✅ ESLint 9.15.0 (latest)
- ✅ No usa @supabase/auth-helpers (deprecado)
- ✅ Sin dependencias conflictivas

---

## ❌ ERROR 4: "6 vulnerabilities (1 moderate, 5 high)"

### Solución
Después de descargar el nuevo código:

```bash
npm audit fix --force
```

O si persiste:
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## ✅ PASOS PARA DEPLOY EXITOSO

### 1. Descargar el NUEVO ZIP
Descarga `mizhar-COMPLETE-FINAL.zip` (271 KB)

### 2. Descomprimir y verificar
```bash
unzip mizhar-COMPLETE-FINAL.zip
cd mizhar-MINIMAL
cat package.json  # Verificar que NO tiene "postinstall"
```

### 3. Instalar localmente (test)
```bash
npm install
npm run build
npm run dev
```

Si funciona local → funcionará en Vercel/Render.

### 4. Crear nuevo repo Git
```bash
git init
git add .
git commit -m "production ready - clean build"
git branch -M main
git remote add origin TU-REPO-URL
git push -u origin main
```

### 5. Deploy en Vercel
1. Conectar repo en vercel.com
2. **NO cambiar nada** (Vercel detecta Next.js automático)
3. Agregar variables de entorno:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```
4. Deploy

### 6. Deploy en Render
1. Conectar repo en render.com
2. **Build Command**: `npm ci && npm run build`
3. **Start Command**: `npm start`
4. **Environment Variables**:
   ```
   NODE_VERSION=20.18.0
   NODE_ENV=production
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```
5. Deploy

---

## 🎯 CHECKLIST PRE-DEPLOY

- [ ] Descargué `mizhar-COMPLETE-FINAL.zip` (NUEVO)
- [ ] Descomprimí el código
- [ ] Verifiqué que `package.json` NO tiene "postinstall"
- [ ] Corrí `npm install` local sin errores
- [ ] Corrí `npm run build` local sin errores
- [ ] Configuré variables de entorno
- [ ] Hice push a GitHub/GitLab
- [ ] Conecté en Vercel/Render
- [ ] Deploy exitoso ✅

---

## 📞 SI AÚN TIENES ERRORES

1. **Elimina node_modules y package-lock.json**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Verifica versión de Node**
   ```bash
   node --version  # Debe ser 20.x
   ```

3. **Build limpio**
   ```bash
   rm -rf .next
   npm run build
   ```

4. **Verifica que NO hay Prisma**
   ```bash
   grep -r "prisma" package.json  # Debe estar vacío
   ```

---

## ✅ SEÑALES DE ÉXITO

Cuando el build funciona, verás:
```
✓ Creating an optimized production build
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization

Route (app)                              Size
┌ ○ /                                    142 kB
├ ○ /pricing                             89 kB
└ ○ /login                               85 kB

Build completed in 45s
```

---

**Última actualización**: Mayo 23, 2026  
**Versión del código**: 2.0.0 (ULTRA CLEAN)
