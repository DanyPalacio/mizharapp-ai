# 🚨 INSTRUCCIONES NETLIFY DROP - NO USES GITHUB

## ❌ NO HAGAS ESTO:
- NO conectes GitHub
- NO uses "Import from Git"
- NO uses tu repo viejo

## ✅ HAZ ESTO:

### PASO 1: Descargar ZIP
Descarga `MIZHAR-FINAL-DEPLOY.zip`

### PASO 2: Descomprimir
```bash
unzip MIZHAR-FINAL-DEPLOY.zip
```

### PASO 3: Entrar a la carpeta
```bash
cd mizhar-MINIMAL
```

### PASO 4: Netlify Drop
1. Ve a https://app.netlify.com/drop
2. Arrastra la carpeta `mizhar-MINIMAL` COMPLETA
3. Espera que termine

## 🎯 VARIABLES DE ENTORNO

Después del deploy, agrega estas variables en Netlify:

```
NEXT_PUBLIC_SUPABASE_URL=tu_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key
ANTHROPIC_API_KEY=sk-ant-api03-DLcUnrcl4XqUMdDbeXnL...
OPENAI_API_KEY=sk-proj-TmvRH6_CzvtddSxUXB7aF73SQfO...
FRED_API_KEY=f25f65a124b19ed05422544774f15079
NEWS_API_KEY=5b3c289db05b450fbf7c9955122713da
```

## ✅ ESTE ZIP TIENE:

- ✅ 18 dependencias (nodemailer, pptxparser incluidos)
- ✅ NO Prisma
- ✅ next.config.js (NO .ts)
- ✅ Sin rutas duplicadas
- ✅ Google Analytics
- ✅ SEO Ninja

## 🆘 SI FALLA:

Mándame screenshot del error.
