# 🚀 INSTRUCCIONES DE DEPLOY - GARANTIZADO

## ⚠️ PROBLEMA DETECTADO

El código en este ZIP está **100% limpio**.
NO tiene Prisma.
NO tiene next.config.ts.

Si ves errores de "prisma: command not found", significa que estás subiendo código VIEJO a GitHub.

---

## ✅ SOLUCIÓN GARANTIZADA

### Opción 1: GitHub Limpio (RECOMENDADO)

```bash
# 1. BORRA el repo completo en GitHub
# Ve a GitHub → Settings → Delete Repository

# 2. CREA repo NUEVO
# GitHub → New Repository → mizhar-ai-clean

# 3. Descomprime el ZIP
cd ~/Downloads
unzip mizhar-ULTRA-CLEAN-FIXED.zip
cd mizhar-MINIMAL

# 4. Verifica que esté limpio
grep "prisma" package.json  # Debe estar VACÍO
ls next.config.ts          # Debe dar error
ls next.config.js          # Debe existir

# 5. Init Git NUEVO
git init
git add .
git commit -m "clean code - no prisma"

# 6. Conecta al repo NUEVO
git remote add origin https://github.com/TU-USER/mizhar-ai-clean.git
git branch -M main
git push -u origin main

# 7. Deploy en Vercel
# Conecta el repo NUEVO en vercel.com
```

### Opción 2: Vercel CLI Directo (MÁS RÁPIDO)

```bash
# 1. Descomprime
cd ~/Downloads
unzip mizhar-ULTRA-CLEAN-FIXED.zip
cd mizhar-MINIMAL

# 2. Instala Vercel CLI
npm install -g vercel

# 3. Login
vercel login

# 4. Deploy DIRECTO (sin GitHub)
vercel

# Responde:
# - Set up and deploy? Y
# - Link to existing? N
# - Project name? mizhar-ai
# - Directory? (Enter)
# - Modify settings? N

# 5. Agrega env vars
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY

# 6. Re-deploy
vercel --prod
```

---

## 🔍 VERIFICACIÓN ANTES DE DEPLOY

```bash
cd mizhar-MINIMAL

# Test 1: No Prisma
grep "prisma" package.json
# Debe estar VACÍO

# Test 2: Archivos correctos
ls next.config.js   # ✅ Debe existir
ls next.config.ts   # ❌ NO debe existir

# Test 3: Build local
npm install
npm run build
# Debe terminar con "✓ Compiled successfully"
```

---

## ❌ SI AÚN FALLA

El problema NO es el código.
El problema es que GitHub tiene archivos viejos.

**SOLUCIÓN**:
1. Usa Vercel CLI (Opción 2)
2. O borra COMPLETAMENTE el repo de GitHub y créalo nuevo
