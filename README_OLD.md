# MIZHAR — Strategic Intelligence for Founders

**AI-powered venture intelligence platform** that helps founders validate, challenge, simulate, and structure venture-scale business strategies.

## 🚀 Features

### Core Platform
- **Smart Onboarding** — 3-way entry (describe, upload, template) + 10-question strategic interview
- **Venture Dashboard** — Venture Score, KPI strip, strengths/risks, module access
- **Intelligence Modules**
  - Business Plan (AI-generated sections)
  - Financials (3-scenario modeling)
  - Market Intelligence (TAM/SAM/SOM, live trend data)
  - SWOT Analysis (editable quadrants)
  - Competitors (positioning map, strategy gaps)
  - Challenge Mode (VC stress-test with critique cards)
  - Marketing Plan (GTM channels, budget allocation)
  - Investor Deck (10-slide template builder)
  - Simulations (Monte Carlo, sensitivity analysis) — PRO

### Pro Features ($49/mo)
- Valuation (5 methods)
- Fundraising (investor targeting)
- Full data room
- Unlimited exports (no watermark)
- API access
- Priority support

## 🛠 Tech Stack

- **Frontend**: Next.js 15 (App Router) + TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Icons**: Lucide React
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (Google, LinkedIn, Apple, Magic Link)
- **APIs**: FRED, Google Trends, SEC EDGAR, Crunchbase, News API
- **AI**: Claude API (Anthropic)
- **Payments**: PayPal (recurring billing)
- **Hosting**: Render

## 📋 Project Structure

```
src/
├── app/
│   ├── (marketing)/
│   │   ├── pricing/
│   │   └── layout.tsx
│   ├── app/
│   │   ├── layout.tsx
│   │   └── startup/
│   │       ├── overview/
│   │       ├── challenge/
│   │       ├── plan/
│   │       ├── financials/
│   │       └── ...
│   ├── login/
│   ├── onboarding/
│   ├── page.tsx
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── layout/
│   │   ├── sidebar.tsx
│   │   └── topbar.tsx
└── lib/
    └── utils.ts
```

## 🎨 Design System

MIZHAR Design Tokens integrated into Tailwind:
- Colors: Orange (#FF6A00), Graphite (#1A1F24), Cloud (#F5F6F7)
- Typography: Inter, JetBrains Mono, Satoshi
- Motion: Smooth transitions, cubic-bezier ease-out

## 🔐 Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
ANTHROPIC_API_KEY=sk-ant-...
FRED_API_KEY=your-key
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your-client-id
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📦 Installation

```bash
npm install
npm run dev
```

## 🚀 Deployment

Deploy on Render:
1. Push to GitHub
2. Connect to Render
3. Set environment variables
4. Deploy

---

**Built with Claude + Next.js + Supabase**
