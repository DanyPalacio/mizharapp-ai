# MIZHAR AI - AI-Powered Business Intelligence Platform

[![Build & Deploy](https://github.com/YOUR_USERNAME/mizhar-app/actions/workflows/deploy.yml/badge.svg)](https://github.com/YOUR_USERNAME/mizhar-app/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Status: Production Ready](https://img.shields.io/badge/Status-Production%20Ready-success)]()

**MIZHAR AI** empowers entrepreneurs and business leaders with AI-driven intelligence tools to make faster, smarter, and more confident decisions about their businesses.

---

## 🌟 Features

### 🆓 Free Tier (Always Free)
- **9 Business Tools** (5-10 uses/month per tool)
  - Business Plan Generator
  - SWOT Analysis
  - TAM Calculator
  - Investor Readiness Checker
  - Viability Score Calculator
  - EBITDA Estimator
  - Startup Naming Tool
  - Business Model Generator
  - Financial Projections

- **Full Knowledge Bank Access**
  - 3,800+ curated business content chunks
  - Vector search (RAG-powered)
  - Semantic + keyword hybrid search

### 💎 Pro Tier ($29.99/month)
- **Unlimited** usage of all free tools
- **5 Intelligence Engines**
  - Challenge Mode (VC-style critique)
  - Strategic Rewrite Engine (5 investor personas)
  - Simulations & Scenario Planning
  - Founder Intelligence
  - Financial Intelligence & Valuations

- **Advanced Features**
  - Market Research Intelligence
  - Competitive Analysis
  - 9 Export Formats (PDF, Word, Excel, PPT, HTML, JSON, CSV, Markdown, XML)
  - Real-time API Integrations (6 premium data sources)
  - Advanced Analytics Dashboard
  - Priority Support

### 🔐 Admin & Security
- **Admin Panel**
  - User Management (registration, subscription, metrics)
  - Analytics Dashboard (revenue, traffic, conversions)
  - Knowledge Bank Management
  - Newsletter System

- **Authentication & Audit**
  - Login attempt tracking (5 failed = 15-min lockout)
  - Suspicious activity detection
  - Security audit logging
  - Device fingerprinting
  - Comprehensive security reports

- **Compliance**
  - GDPR compliant (EU users)
  - CCPA compliant (California users)
  - CAN-SPAM (email marketing)
  - CASL (Canada marketing)
  - COPPA (18+ only)
  - Full legal documentation

---

## 🚀 Quick Start

### Local Development

#### Prerequisites
- Node.js 18+
- npm/yarn
- Supabase account
- PostgreSQL (via Supabase)

#### Installation
```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/mizhar-app.git
cd mizhar-app

# Install dependencies
npm install

# Create .env.local from example
cp .env.example .env.local

# Update environment variables with your Supabase credentials
# NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
# SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
# ADMIN_TOKEN=your-secure-token
# etc.

# Run development server
npm run dev

# Open browser to http://localhost:3000
```

#### Available Scripts
```bash
npm run dev           # Start development server
npm run build         # Build for production
npm start             # Start production server
npm run lint          # Run ESLint
npm run lint:fix      # Fix linting issues
npm run type-check    # TypeScript type checking
npm run test          # Run tests
npm run db:migrate    # Apply database migrations
```

---

## 🌐 Deployment

### Deploy to Render

#### Step 1: Push to GitHub
```bash
git add .
git commit -m "Initial commit: MIZHAR AI"
git push origin main
```

#### Step 2: Create Render Account
1. Go to https://render.com
2. Connect GitHub account
3. Select mizhar-app repository

#### Step 3: Configure Environment
In Render Dashboard, add these environment variables:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ADMIN_TOKEN=your-secure-token
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM_EMAIL=noreply@mizhar.ai
NODE_ENV=production
```

#### Step 4: Deploy
- Click "Create Web Service"
- Build Command: `npm run build`
- Start Command: `npm start`
- Deploy!

**Full Deployment Guide:** See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│            Next.js Frontend (React)                  │
├─────────────────────────────────────────────────────┤
│              API Routes (TypeScript)                 │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────┐
│  │ Free Tools   │  │ Intelligence │  │ Admin APIs │
│  │ (9 tools)    │  │ Engines (5)  │  │ (Users,    │
│  └──────────────┘  └──────────────┘  └────────────┘
├─────────────────────────────────────────────────────┤
│         Business Logic & Services (TypeScript)       │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────┐
│  │ Tool Engines │  │ RAG + AI     │  │ Auth/Audit │
│  │ (analytics)  │  │ (Knowledge)  │  │ (Security) │
│  └──────────────┘  └──────────────┘  └────────────┘
├─────────────────────────────────────────────────────┤
│         Data Layer (PostgreSQL + pgvector)           │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────┐
│  │ Users &      │  │ Knowledge    │  │ Auth Logs  │
│  │ Subscriptions│  │ Embeddings   │  │ & Audit    │
│  └──────────────┘  └──────────────┘  └────────────┘
└─────────────────────────────────────────────────────┘
```

### Tech Stack
- **Frontend:** Next.js 14, React 18, TypeScript
- **Backend:** Next.js API Routes, Node.js
- **Database:** PostgreSQL (Supabase) + pgvector
- **Auth:** Supabase Auth (JWT)
- **AI/ML:** OpenAI Embeddings, Claude API
- **Infrastructure:** Vercel/Render (Serverless)
- **Email:** Nodemailer + SMTP
- **External APIs:** Crunchbase, SEC EDGAR, Google Trends, FRED, Alpha Vantage, PitchBook

---

## 📊 API Endpoints

### Public Endpoints
```
GET  /api/tools/*                    - Free tools
GET  /api/intelligence/*             - Intelligence engines (Pro)
GET  /api/export/*                   - Export documents
POST /api/rag/search                 - Knowledge bank search
```

### Admin Endpoints (Requires x-admin-token header)
```
GET    /api/admin/users              - List users
POST   /api/admin/users              - Get user details
PUT    /api/admin/users              - Update user
GET    /api/admin/analytics          - Dashboard metrics
GET    /api/admin/newsletter         - List newsletters
POST   /api/admin/newsletter         - Create/send newsletter
PUT    /api/admin/newsletter         - Update newsletter
DELETE /api/admin/newsletter         - Delete newsletter
GET    /api/admin/dashboard          - Full dashboard
```

### Legal Pages
```
GET  /legal/terms                    - Terms & Conditions
GET  /legal/privacy                  - Privacy Policy
GET  /legal/about                    - About Us
```

---

## 🔐 Security

### Data Protection
- ✅ TLS 1.3 encryption in transit
- ✅ AES-256 encryption at rest
- ✅ Secure password hashing (bcrypt)
- ✅ JWT authentication
- ✅ Row-Level Security (RLS) on database

### Authentication & Audit
- ✅ Login attempt limiting (5 attempts = 15-min lockout)
- ✅ Suspicious activity detection
- ✅ Device fingerprinting
- ✅ Comprehensive audit logging
- ✅ Security report generation

### Rate Limiting
- **Free:** 5 requests/hour
- **Pro:** 100 requests/hour
- **Admin:** 1,000 requests/hour

---

## 📋 Compliance

MIZHAR AI is fully compliant with:
- ✅ **GDPR** - General Data Protection Regulation (EU)
- ✅ **CCPA** - California Consumer Privacy Act
- ✅ **CAN-SPAM** - Email marketing compliance
- ✅ **CASL** - Canada's anti-spam law
- ✅ **COPPA** - Children's online privacy (18+ only)
- ✅ **WCAG 2.1 AA** - Accessibility standards

See [LEGAL_COMPLIANCE_CHECKLIST.md](./LEGAL_COMPLIANCE_CHECKLIST.md) for details.

---

## 📚 Documentation

- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - GitHub & Render deployment
- **[ADMIN_AUTH_IMPLEMENTATION_GUIDE.md](./ADMIN_AUTH_IMPLEMENTATION_GUIDE.md)** - Admin system details
- **[LEGAL_COMPLIANCE_CHECKLIST.md](./LEGAL_COMPLIANCE_CHECKLIST.md)** - Compliance status
- **[FINAL_AUDIT_COMPLETION.md](./FINAL_AUDIT_COMPLETION.md)** - Project summary
- **[IMPLEMENTATION_INDEX.md](./IMPLEMENTATION_INDEX.md)** - File inventory

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Code Standards
- TypeScript strict mode
- ESLint compliance
- Prettier formatting
- Comprehensive comments

---

## 📊 Project Statistics

```
Total Lines of Code:       11,500+
TypeScript:                85%
SQL:                       10%
Markdown:                  5%

Code Files:                25+
Documentation:             4+ files
Database Tables:           15+
API Endpoints:             20+
```

---

## 🔄 Development Workflow

### Git Branches
- `main` - Production branch (auto-deploys to Render)
- `develop` - Development branch
- `feature/*` - Feature branches
- `hotfix/*` - Emergency fixes

### Commit Messages
```
feat: Add new feature
fix: Fix bug
docs: Update documentation
style: Format code
refactor: Refactor code
test: Add tests
chore: Update dependencies
```

### Continuous Integration
- GitHub Actions runs on every push
- Lint check
- Type checking
- Build verification
- Auto-deployment to Render

---

## 📞 Support

- **Email:** support@mizhar.ai
- **Website:** mizhar.ai
- **Documentation:** docs.mizhar.ai
- **Community:** community.mizhar.ai

---

## 📄 License

This project is proprietary software. All rights reserved to Interbros LLC.

---

## ⚖️ Legal

MIZHAR AI is a division of **Interbros LLC**

- **Terms & Conditions:** [/legal/terms](/legal/terms)
- **Privacy Policy:** [/legal/privacy](/legal/privacy)
- **About Us:** [/legal/about](/legal/about)

---

## 🎉 Acknowledgments

Built with modern technologies and best practices for production-ready deployment.

---

## 📈 Status

**Platform Status:** ✅ Production Ready
**Version:** 2.0
**Last Updated:** May 2026

---

**MIZHAR AI - Empowering Founders with AI-Driven Business Intelligence** 🚀
