# MIZHAR Deployment Guide

Complete step-by-step guide to deploy MIZHAR on GitHub + Render.

## Prerequisites

- GitHub account
- Render account (free tier available)
- Supabase account (for database & auth)
- Anthropic API key
- PayPal account (for billing)

## Step 1: Prepare GitHub Repository

### 1.1 Create GitHub Repository

```bash
# If not already a repo
git init

# Add origin (replace YOUR_USERNAME and YOUR_REPO)
git remote add origin https://github.com/YOUR_USERNAME/mizhar.git
git branch -M main
git push -u origin main
```

### 1.2 Verify Files

Make sure these are committed and pushed:
- `package.json` (dependencies)
- `tsconfig.json` (TypeScript config)
- `next.config.ts` (Next.js config)
- `tailwind.config.ts` (Tailwind config)
- `src/` (source code)
- `.gitignore` (exclude node_modules)
- `README.md` (project description)
- `.env.example` (env variables template)
- `render.yaml` (deployment config)

```bash
git status
git push
```

## Step 2: Set Up Supabase

### 2.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Enter project name: `mizhar`
4. Choose region closest to users
5. Set strong database password
6. Wait for project to be ready (~2 min)

### 2.2 Get Database Credentials

In Supabase dashboard:
1. Go to Settings → API
2. Copy `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
3. Copy `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Copy `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

### 2.3 Enable Auth Providers

In Supabase dashboard → Authentication → Providers:

**Google OAuth:**
1. Enable "Google"
2. Add Google OAuth credentials:
   - Go to [console.cloud.google.com](https://console.cloud.google.com)
   - Create OAuth 2.0 credentials
   - Authorized redirect URI: `https://YOUR_PROJECT.supabase.co/auth/v1/callback?provider=google`

**LinkedIn OAuth:**
1. Enable "LinkedIn"
2. Get credentials from [LinkedIn Developers](https://www.linkedin.com/developers/)

**Apple:**
1. Enable "Apple"
2. Get credentials from Apple Developer Program

**Magic Link (Email):**
1. Already enabled by default
2. No configuration needed

### 2.4 Create Database Tables

In Supabase SQL Editor, run:

```sql
-- Users (handled by Supabase Auth)
-- Create public.users profile for extra data
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  plan TEXT DEFAULT 'free', -- 'free' | 'pro'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Workspaces
CREATE TABLE public.workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  plan TEXT DEFAULT 'free',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Interview responses
CREATE TABLE public.interview_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  question_id INTEGER NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Documents
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  file_path TEXT,
  file_size INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subscriptions (for PayPal billing)
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL, -- 'free' | 'pro'
  status TEXT NOT NULL DEFAULT 'active', -- 'active' | 'cancelled'
  paypal_subscription_id TEXT,
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can view own workspaces"
  ON public.workspaces FOR SELECT
  USING (auth.uid() = user_id);

-- Similar policies for other tables...
```

## Step 3: Configure Render

### 3.1 Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click "Authorize" to connect GitHub account

### 3.2 Create Web Service

1. Click "New +" → "Web Service"
2. Select your `mizhar` repository
3. Fill in configuration:

| Field | Value |
|-------|-------|
| Name | `mizhar` |
| Environment | `Node` |
| Region | `Ohio` (or closest) |
| Branch | `main` |
| Build Command | `npm install && npm run build` |
| Start Command | `npm run start` |
| Instance Type | `Starter` |

4. Click "Create Web Service"

### 3.3 Add Environment Variables

In Render dashboard → Environment:

```
NEXT_PUBLIC_SUPABASE_URL = https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = your-anon-key
SUPABASE_SERVICE_ROLE_KEY = your-service-key
ANTHROPIC_API_KEY = sk-ant-...
FRED_API_KEY = your-fred-key
NEXT_PUBLIC_PAYPAL_CLIENT_ID = your-paypal-client-id
PAYPAL_SECRET = your-paypal-secret
NODE_ENV = production
```

### 3.4 Deploy

1. Render automatically deploys when you push to `main`
2. Watch build logs in Render dashboard
3. Once deployed, you'll get a URL like `https://mizhar-xxx.onrender.com`

## Step 4: Get API Keys

### 4.1 Anthropic (Claude API)

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Create API key
3. Copy to `ANTHROPIC_API_KEY`

### 4.2 FRED (Federal Reserve)

1. Go to [fred.stlouisfed.org/docs/api](https://fred.stlouisfed.org/docs/api)
2. Register for free API key
3. Copy to `FRED_API_KEY`

### 4.3 PayPal

1. Go to [developer.paypal.com](https://developer.paypal.com)
2. Create an app
3. Get Client ID and Secret
4. Copy to `NEXT_PUBLIC_PAYPAL_CLIENT_ID` and `PAYPAL_SECRET`

## Step 5: Configure Domain (Optional)

### 5.1 Connect Custom Domain

In Render → Settings → Custom Domain:
1. Add your domain (e.g., `mizhar.com`)
2. Update DNS records to point to Render
3. Wait for SSL certificate (~5 min)

## Step 6: Set Up Monitoring

### 6.1 Enable Build Notifications

In Render Settings:
1. Go to Notifications
2. Add GitHub/Slack for build failures

### 6.2 Monitor Performance

- Render dashboard shows CPU, memory, requests
- Monitor errors in Render logs
- Set up Supabase alerts for database issues

## Step 7: Go Live Checklist

- [ ] Environment variables set in Render
- [ ] Supabase database created and populated
- [ ] Auth providers configured
- [ ] PayPal integration tested
- [ ] Custom domain connected (optional)
- [ ] Monitoring set up
- [ ] `.env.example` doesn't contain secrets
- [ ] All tests passing
- [ ] Production build tested locally

## Monitoring & Maintenance

### Daily
- Check Render dashboard for errors
- Monitor Supabase database usage

### Weekly
- Review deployment logs
- Monitor API quota usage

### Monthly
- Review user feedback
- Update dependencies
- Check security patches

## Troubleshooting

### Build fails on Render

Check build logs in Render dashboard:
```
- Missing environment variables → Add to Render
- TypeScript errors → Fix locally and push
- Out of memory → Upgrade plan
```

### Database connection errors

1. Check Supabase is accessible
2. Verify credentials in `.env`
3. Check RLS policies

### Auth not working

1. Verify OAuth credentials
2. Check redirect URI matches
3. Verify Supabase URL

## Rollback

If deployment breaks:

```bash
# Revert to previous commit
git revert HEAD
git push

# Render auto-deploys, check logs
```

## Next Steps

1. Set up CI/CD (GitHub Actions)
2. Add monitoring (Sentry, DataDog)
3. Set up logging (LogRocket)
4. Configure automated backups
5. Create runbook for on-call support

---

**For questions, check Render docs at [render.com/docs](https://render.com/docs)**
