#!/bin/bash
echo "🔍 AUDITORÍA COMPLETA MIZHAR AI"
echo "================================"
echo ""

echo "1️⃣ VERIFICANDO IMPORTS..."
echo "Buscando todos los imports usados:"
grep -rh "^import.*from" src --include="*.tsx" --include="*.ts" | \
  sed 's/.*from ["\x27]\([^"]*\)["\x27].*/\1/' | \
  grep -v "^\./" | grep -v "^@/" | \
  sort -u > /tmp/imports.txt
echo "Imports externos encontrados:"
cat /tmp/imports.txt
echo ""

echo "2️⃣ VERIFICANDO package.json..."
echo "Dependencias instaladas:"
grep -A 100 '"dependencies"' package.json | grep ':' | head -20
echo ""

echo "3️⃣ VERIFICANDO RUTAS DUPLICADAS..."
echo "Todas las rutas page.tsx:"
find src/app -name "page.tsx" | sed 's|src/app||' | sed 's|/page.tsx||' | sort
echo ""

echo "4️⃣ VERIFICANDO ARCHIVOS DE CONFIG..."
ls -la *.js *.json *.ts 2>/dev/null | grep -v node_modules
echo ""

echo "5️⃣ BUSCANDO ERRORES COMUNES..."
echo "¿Hay Prisma?"
grep -r "prisma" package.json src 2>/dev/null && echo "❌ PRISMA ENCONTRADO" || echo "✅ No Prisma"
echo ""
echo "¿Hay next.config.ts?"
ls next.config.ts 2>/dev/null && echo "❌ TIENE .ts" || echo "✅ No .ts"
echo ""

echo "✅ AUDITORÍA COMPLETA"
