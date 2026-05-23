# MIZHAR AI — Strategic Intelligence for Founders

**AI-powered venture intelligence platform** that helps founders validate, challenge, simulate, and structure venture-scale business strategies.

## 🚀 Quick Start

### Prerequisites

- **Node.js 20.x** or later (CRITICAL: Must be version 20 or higher)
- **npm 10.0.0** or later
- Supabase account
- Anthropic API key

### Local Development

1. **Install dependencies**
```bash
npm install
```

2. **Configure environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials (see Environment Variables section below)

3. **Run development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📦 Deployment Guide

### ✅ CRITICAL: Node.js Version Requirements

This project **REQUIRES Node.js 20.x or later**. Both Vercel and Render deployments will fail if you don't specify this correctly.

### Deploy to Vercel ⚡

**Vercel automatically detects Node.js version from package.json `engines` field**

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

2. **Import to Vercel**
- Go to [vercel.com/new](https://vercel.com/new)
- Import your GitHub repository
- Vercel auto-detects Next.js

3. **Configure Environment Variables**

In Vercel dashboard → Settings → Environment Variables, add:

**Required:**
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ANTHROPIC_API_KEY=sk-ant-your-key
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_SECRET=your-paypal-secret
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

**Optional:**
```
FRED_API_KEY=your-fred-key
GOOGLE_TRENDS_API_KEY=your-trends-key
CRUNCHBASE_API_KEY=your-crunchbase-key
NEWS_API_KEY=your-news-key
```

4. **Deploy**
Click "Deploy" — Vercel will build and deploy automatically

**Troubleshooting Vercel:**
- If build fails with Node.js version error, verify `package.json` has `"engines": { "node": "20.x" }`
- Check build logs for specific errors
- Ensure all environment variables are set

---

### Deploy to Render 🚢

**Render requires explicit NODE_VERSION environment variable**

1. **Push to GitHub** (same as Vercel steps 1)

2. **Create Web Service**
- Go to [render.com/dashboard](https://render.com/dashboard)
- Click "New +" → "Web Service"
- Connect your GitHub repository
- Select your repo

3. **Configure Build Settings**

**CRITICAL:** Set these exact values:

- **Name**: `mizhar-ai` (or your preferred name)
- **Region**: `Oregon (US West)` (or your preferred region)
- **Branch**: `main`
- **Root Directory**: leave blank
- **Runtime**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run start`

4. **Add Environment Variables**

Click "Advanced" → Add environment variables:

**CRITICAL FIRST:**
```
NODE_VERSION=20.18.0
```
(This MUST be set or build will fail)

**Then add all others:**
```
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://mizhar-ai.onrender.com
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ANTHROPIC_API_KEY=sk-ant-your-key
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_SECRET=your-paypal-secret
```

Optional APIs:
```
FRED_API_KEY=your-fred-key
GOOGLE_TRENDS_API_KEY=your-trends-key
CRUNCHBASE_API_KEY=your-crunchbase-key
NEWS_API_KEY=your-news-key
```

5. **Deploy**
Click "Create Web Service" — Render will build and deploy

**Troubleshooting Render:**
- **"next: not found" error** → `NODE_VERSION` not set or wrong version
- **"Build failed"** → Check build logs, verify all env vars are set
- **Long build times** → Normal for first deploy (10-15 min)

**Alternative: Use render.yaml**

The project includes `render.yaml` for automatic configuration:
- In Render dashboard, select "Blueprint" when creating service
- Render will read `render.yaml` automatically
- Still need to manually set environment variable values

---

## 🔧 Environment Variables Reference

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | `https://abc123.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJhbGc...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side) | `eyJhbGc...` |
| `ANTHROPIC_API_KEY` | Claude API key | `sk-ant-api03-...` |
| `NEXT_PUBLIC_PAYPAL_CLIENT_ID` | PayPal client ID | `AWtY...` |
| `PAYPAL_SECRET` | PayPal secret key | `EF7...` |
| `NEXT_PUBLIC_APP_URL` | Your deployed app URL | `https://your-app.com` |

### Optional Variables

| Variable | Description | Where to get |
|----------|-------------|--------------|
| `FRED_API_KEY` | Federal Reserve Economic Data | [fred.stlouisfed.org](https://fred.stlouisfed.org/docs/api/api_key.html) |
| `GOOGLE_TRENDS_API_KEY` | Google Trends data | Google Cloud Console |
| `CRUNCHBASE_API_KEY` | Startup/company data | [crunchbase.com](https://www.crunchbase.com) |
| `NEWS_API_KEY` | News aggregation | [newsapi.org](https://newsapi.org) |

---

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI Engine**: Anthropic Claude
- **Payments**: PayPal (subscriptions)
- **Deployment**: Vercel / Render

---

## 📁 Project Structure

```
mizhar-ai/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── (marketing)/     # Marketing pages (landing, pricing)
│   │   ├── app/             # Main app (dashboard, modules)
│   │   │   └── startup/     # Startup-specific pages
│   │   │       ├── overview/
│   │   │       ├── challenge/
│   │   │       ├── plan/
│   │   │       ├── financials/
│   │   │       └── ...
│   │   ├── api/             # API routes
│   │   │   ├── admin/
│   │   │   ├── blog/
│   │   │   ├── cases/
│   │   │   ├── chat/
│   │   │   └── ...
│   │   ├── blog/            # Blog pages
│   │   ├── legal/           # Legal pages (terms, privacy)
│   │   ├── login/           # Authentication
│   │   ├── onboarding/      # User onboarding flow
│   │   ├── pricing/         # Pricing page
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Home page
│   │   └── globals.css      # Global styles
│   ├── components/          # React components
│   │   ├── ui/              # shadcn/ui components
│   │   ├── layout/          # Layout components (sidebar, topbar)
│   │   ├── blog/            # Blog components
│   │   ├── cases/           # Case study components
│   │   └── payments/        # Payment components
│   ├── lib/                 # Utilities and helpers
│   ├── ai_engine/           # AI integration logic
│   └── middleware/          # Middleware functions
├── public/                  # Static assets
├── migrations/              # Database migrations
├── supabase/               # Supabase configuration
├── .env.example            # Environment variables template
├── next.config.ts          # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── package.json            # Dependencies and scripts
├── vercel.json             # Vercel deployment config
└── render.yaml             # Render deployment config
```

---

## 🎨 Design System

**MIZHAR Design Tokens**

- **Colors**:
  - Primary: Orange (#FF6A00)
  - Dark: Graphite (#1A1F24)
  - Light: Cloud (#F5F6F7)
  
- **Typography**:
  - Sans: Inter (body text)
  - Mono: JetBrains Mono (code, data)
  - Display: Satoshi (headlines)

- **Motion**: Smooth transitions, cubic-bezier ease-out

---

## 🚀 Features

### Core Platform (Free)
- **Smart Onboarding** — 3-way entry + strategic interview
- **Venture Dashboard** — Score, KPIs, strengths/risks
- **Business Plan Generator** — AI-generated sections
- **Financial Modeling** — 3-scenario projections
- **Market Intelligence** — TAM/SAM/SOM analysis
- **SWOT Analysis** — Interactive quadrants
- **Competitor Analysis** — Positioning maps
- **Challenge Mode** — VC stress-test simulation

### Pro Features ($49/mo)
- Valuation models (5 methods)
- Fundraising strategy
- Monte Carlo simulations
- Investor deck builder
- Full data room
- Unlimited exports (no watermark)
- API access
- Priority support

---

## 💻 Development

### Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
npm run type-check # TypeScript type checking
```

### Code Quality

- **TypeScript strict mode** enabled
- **ESLint** configured for Next.js
- **Prettier** for code formatting

---

## 🐛 Common Issues & Solutions

### Build Fails: "Invalid Node.js Version"

**Problem**: Vercel/Render using wrong Node.js version

**Solution**:
1. Verify `package.json` has:
```json
"engines": {
  "node": "20.x"
}
```
2. For Render: Add environment variable `NODE_VERSION=20.18.0`

---

### Build Fails: "next: not found"

**Problem**: Next.js not installed or build command failed

**Solution**:
1. Check `package.json` dependencies include `"next": "^14.2.18"`
2. Verify build command is `npm install && npm run build`
3. For Render: Ensure `NODE_VERSION=20.18.0` is set

---

### Build Fails: Tailwind CSS errors

**Problem**: Tailwind CSS not properly configured

**Solution**:
1. Verify `tailwind.config.ts` exists
2. Check `package.json` devDependencies:
```json
"tailwindcss": "^3.4.14",
"@tailwindcss/postcss": "^4.0.0",
"autoprefixer": "^10.4.20",
"postcss": "^8.4.47"
```

---

### Runtime: Supabase connection fails

**Problem**: Environment variables not set correctly

**Solution**:
1. Double-check all Supabase env vars in deployment platform
2. Verify keys are valid (no extra spaces, quotes)
3. Check Supabase project is active

---

### API Routes return 500

**Problem**: Missing environment variables or invalid API keys

**Solution**:
1. Check deployment logs for specific error
2. Verify all required env vars are set
3. Test API keys are valid

---

## 📞 Support

For deployment issues:
1. Check deployment logs first
2. Verify all environment variables
3. Review this README troubleshooting section

---

## 📄 License

Private project — All rights reserved

---

**Version**: 2.0.0  
**Last Updated**: May 2026  
**Built with**: Claude + Next.js + Supabase
