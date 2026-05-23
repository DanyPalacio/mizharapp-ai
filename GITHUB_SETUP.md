# GitHub Setup & Deployment Guide

## Prerequisites
- GitHub account (create at https://github.com/signup if needed)
- Git configured locally: `git config --global user.email "your@email.com"` and `git config --global user.name "Your Name"`
- Supabase account (create at https://supabase.com if needed)
- Render account (create at https://render.com if needed)

## Step 1: Create GitHub Repository

1. **Go to GitHub**: https://github.com/new
2. **Repository settings**:
   - Repository name: `mizhar-app`
   - Description: "AI-powered venture analysis platform"
   - Visibility: **Private** (recommended for production)
   - ✓ Initialize with .gitignore (already have locally)
   - Click **Create repository**

3. **Copy the repository URL** from the green "Code" button (use HTTPS or SSH based on your setup)

## Step 2: Push Local Repository to GitHub

Run these commands in your terminal:

```bash
cd /Volumes/MUSIC\ USB-C/MIZHAR/mizhar-app

# Add GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/mizhar-app.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

**If you get authentication errors:**
- For HTTPS: Create a Personal Access Token at https://github.com/settings/tokens/new (scope: `repo`)
- For SSH: Add your SSH key at https://github.com/settings/ssh/new

## Step 3: Verify Push Success

```bash
git log --oneline -5
# Should show your commits
```

## Step 4: Create Supabase Project

1. **Go to Supabase Dashboard**: https://app.supabase.com
2. **Create New Project**:
   - Project name: `mizhar`
   - Region: Choose closest to your users
   - Database password: Store securely
   - Pricing plan: Start with **Free** tier
3. **Wait for initialization** (~2 minutes)

## Step 5: Configure Database Schema

Once project is ready:

1. **Go to SQL Editor** in Supabase dashboard
2. **Create new query** and paste the contents of `migrations/001_initial_schema.sql`
3. **Run the SQL** (click play button)
4. **Verify tables created** in the Table Editor view

Expected tables:
- users
- workspaces
- interview_responses
- business_plan_sections
- documents
- exports
- chat_messages
- valuations
- investor_prospects

## Step 6: Configure Authentication Providers

In Supabase Dashboard → Authentication → Providers:

### Enable Email/Password Authentication
- Already enabled by default
- Configure email templates if desired

### Configure OAuth Providers

**Google OAuth:**
1. Go to https://console.cloud.google.com/
2. Create new project: "MIZHAR"
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web application)
5. Add authorized redirect URI: `https://YOUR_SUPABASE_URL/auth/v1/callback?provider=google`
6. Copy Client ID and Secret to Supabase → Google provider

**LinkedIn OAuth:**
1. Go to https://www.linkedin.com/developers/apps
2. Create new app
3. In Authorization settings, add Redirect URL: `https://YOUR_SUPABASE_URL/auth/v1/callback?provider=linkedin_oidc`
4. Copy Client ID and Client Secret to Supabase

**Apple OAuth:**
1. Go to https://developer.apple.com/account
2. Create new Service ID for authentication
3. Configure domain: Add your app URL
4. Create and sign the Private Key
5. Copy credentials to Supabase

## Step 7: Get Supabase Credentials

In Supabase Dashboard → Settings → API:

Copy these values (you'll need them for .env):
- **Project URL**: `https://[project-id].supabase.co`
- **Anon Key**: (public, safe for client-side)
- **Service Role Key**: (secret, keep private!)

```bash
# Update your .env.local with:
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key]
```

## Step 8: Create Render Web Service

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Create New** → **Web Service**
3. **Connect Repository**:
   - Connect your GitHub account
   - Select `mizhar-app` repository
4. **Configure Service**:
   - Name: `mizhar-platform`
   - Environment: `Node`
   - Region: Choose same as Supabase for latency
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start`
   - Instance Type: `Starter` (Free tier)
5. **Add Environment Variables** (copy from .env.example):

```
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key]
ANTHROPIC_API_KEY=[your-anthropic-key]
FRED_API_KEY=[your-fred-key]
CRUNCHBASE_API_KEY=[your-crunchbase-key]
NEWS_API_KEY=[your-news-api-key]
PAYPAL_CLIENT_ID=[your-paypal-client-id]
PAYPAL_SECRET=[your-paypal-secret]
NEXT_PUBLIC_APP_URL=https://mizhar-platform.onrender.com
```

6. **Create Web Service** and wait for deployment (~5-10 minutes)

## Step 9: Configure Custom Domain (Optional)

Once deployed and working on Render URL:

1. **In Render Dashboard** → Service Settings → Custom Domain
2. **Add custom domain** (e.g., `mizhar.io`)
3. **Configure DNS** with your domain registrar:
   - Add CNAME record pointing to Render's provided URL
   - Wait for DNS propagation (~24 hours)

## Step 10: Verify Deployment

1. **Visit your Render URL**: https://mizhar-platform.onrender.com
2. **Check landing page** loads correctly
3. **Test signup flow**:
   - Go to /onboarding
   - Create account with email
   - Verify email works
4. **Monitor logs** in Render dashboard for any errors

## Troubleshooting

### Build fails on Render
- Check **Build Logs** tab in Render dashboard
- Common issues:
  - Missing environment variables → Add to dashboard
  - Outdated dependencies → Run `npm install` locally first
  - TypeScript errors → Run `npm run build` locally to verify

### Database connection errors
- Verify Supabase credentials in .env
- Check Supabase project is running
- Confirm RLS policies are correctly set

### Authentication not working
- Verify OAuth credentials are correct
- Check redirect URLs match exactly
- Ensure Supabase auth is enabled

## Next Steps

1. **Email Verification**: Set up email provider for transactional emails
   - Configure in Supabase → Email Templates
2. **Analytics**: Add analytics tracking (Posthog, Mixpanel)
3. **Monitoring**: Set up error tracking (Sentry)
4. **Backups**: Configure automatic backups in Supabase
5. **Performance**: Monitor build/deployment metrics

## Quick Reference: Environment Variables

Required for development and production:

```env
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# AI/APIs (Required for features)
ANTHROPIC_API_KEY=
FRED_API_KEY=
CRUNCHBASE_API_KEY=
NEWS_API_KEY=

# Payment (Required for Pro billing)
PAYPAL_CLIENT_ID=
PAYPAL_SECRET=

# App (Required for deployment)
NEXT_PUBLIC_APP_URL=https://mizhar-platform.onrender.com
NODE_ENV=production
```

## Support

- **Supabase Docs**: https://supabase.com/docs
- **Render Docs**: https://render.com/docs
- **Next.js Docs**: https://nextjs.org/docs
