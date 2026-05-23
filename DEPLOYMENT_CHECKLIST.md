# MIZHAR Deployment Checklist

Complete this checklist to deploy MIZHAR from local development to production on Render + GitHub.

## Phase 1: Pre-Deployment Setup

### Local Configuration
- [ ] Verify git is initialized: `git status`
- [ ] Check all code changes are committed
- [ ] Run final build: `npm run build`
- [ ] Test locally: `npm run dev` → Visit http://localhost:3000
- [ ] Verify all 25+ routes load without errors

### GitHub Setup
- [ ] Create GitHub account if needed: https://github.com/signup
- [ ] Create new repository named `mizhar-app`: https://github.com/new
  - [ ] Set visibility to **Private**
  - [ ] Copy the repository URL (HTTPS)
- [ ] Configure Git locally:
  ```bash
  git config --global user.email "your@email.com"
  git config --global user.name "Your Name"
  ```
- [ ] Add GitHub remote:
  ```bash
  cd /Volumes/MUSIC\ USB-C/MIZHAR/mizhar-app
  git remote add origin https://github.com/YOUR_USERNAME/mizhar-app.git
  git branch -M main
  ```
- [ ] Push to GitHub:
  ```bash
  git push -u origin main
  ```
- [ ] Verify on GitHub: https://github.com/YOUR_USERNAME/mizhar-app
- [ ] Add `.env.local` to `.gitignore` (already done) ✓

### Supabase Project Setup
- [ ] Create Supabase account if needed: https://supabase.com
- [ ] Create new project:
  - [ ] Name: `mizhar`
  - [ ] Region: Choose closest to users
  - [ ] Save database password securely
- [ ] Wait for project initialization (~2 minutes)
- [ ] Go to SQL Editor
- [ ] Copy contents of `migrations/001_initial_schema.sql`
- [ ] Paste into new SQL query
- [ ] Execute SQL
- [ ] Verify tables created in Table Editor:
  - [ ] users
  - [ ] workspaces
  - [ ] interview_responses
  - [ ] business_plan_sections
  - [ ] documents
  - [ ] exports
  - [ ] chat_messages
  - [ ] valuations
  - [ ] investor_prospects

### Supabase Authentication
- [ ] Go to Supabase Dashboard → Authentication → Providers
- [ ] **Email/Password** (enabled by default)
- [ ] **Google OAuth**:
  - [ ] Go to https://console.cloud.google.com/
  - [ ] Create new project "MIZHAR"
  - [ ] Enable Google+ API
  - [ ] Create OAuth 2.0 Web Application credentials
  - [ ] Add authorized redirect: `https://[project-id].supabase.co/auth/v1/callback?provider=google`
  - [ ] Copy Client ID and Secret to Supabase
- [ ] **LinkedIn OAuth** (optional):
  - [ ] Go to https://www.linkedin.com/developers/apps
  - [ ] Create new app
  - [ ] Add Redirect URL: `https://[project-id].supabase.co/auth/v1/callback?provider=linkedin_oidc`
  - [ ] Copy credentials to Supabase
- [ ] **Apple OAuth** (optional):
  - [ ] Go to https://developer.apple.com/account
  - [ ] Set up Service ID authentication
  - [ ] Copy credentials to Supabase

### API Keys Setup
- [ ] Get Supabase credentials (Settings → API):
  - [ ] Project URL: `https://[id].supabase.co`
  - [ ] Anon Key (public)
  - [ ] Service Role Key (secret)
- [ ] Get Anthropic API Key: https://api.anthropic.com/account/api-keys
- [ ] Get FRED API Key: https://fred.stlouisfed.org/docs/api/
  - [ ] Register at FRED (Federal Reserve Economic Data)
  - [ ] Create API key
- [ ] Get Crunchbase API Key (optional for Fundraising):
  - [ ] https://www.crunchbase.com/app/data
- [ ] Get NewsAPI Key (optional for Market News):
  - [ ] https://newsapi.org/account

### Environment Configuration
- [ ] Run setup script:
  ```bash
  ./scripts/setup-production.sh
  ```
  - [ ] Enter Supabase URL
  - [ ] Enter Supabase Anon Key
  - [ ] Enter Supabase Service Role Key
  - [ ] Enter Anthropic API Key
  - [ ] Enter FRED API Key
  - [ ] Enter Crunchbase API Key
  - [ ] Enter NewsAPI Key
  - [ ] Enter PayPal credentials (if using Pro billing)
  - [ ] Enter Render app URL (set up in next step)
- [ ] Verify `.env.local` created and NOT in git
- [ ] Restart dev server: `npm run dev`
- [ ] Test authentication locally

## Phase 2: Production Deployment on Render

### Create Render Web Service
- [ ] Go to https://dashboard.render.com
- [ ] Create New → Web Service
- [ ] Connect GitHub:
  - [ ] Authorize Render with GitHub
  - [ ] Select `mizhar-app` repository
  - [ ] Allow Render to access your repositories
- [ ] Configure service:
  - [ ] Name: `mizhar-platform`
  - [ ] Environment: `Node`
  - [ ] Region: Select same as Supabase
  - [ ] Build Command: `npm install && npm run build`
  - [ ] Start Command: `npm run start`
  - [ ] Instance Type: `Starter` (Free tier available)
- [ ] Add Environment Variables in Render dashboard:
  ```
  NEXT_PUBLIC_SUPABASE_URL=https://[id].supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=[key]
  SUPABASE_SERVICE_ROLE_KEY=[key]
  ANTHROPIC_API_KEY=[key]
  FRED_API_KEY=[key]
  CRUNCHBASE_API_KEY=[key]
  NEWS_API_KEY=[key]
  PAYPAL_CLIENT_ID=[id]
  PAYPAL_SECRET=[secret]
  NEXT_PUBLIC_APP_URL=https://mizhar-platform.onrender.com
  NODE_ENV=production
  ```
- [ ] Click "Create Web Service"
- [ ] Wait for deployment (5-10 minutes)
- [ ] Check Build Logs for any errors
- [ ] Once "Live" status appears, note your URL: `https://mizhar-platform.onrender.com`

### Verify Deployment
- [ ] Visit `https://mizhar-platform.onrender.com`
- [ ] Landing page loads
- [ ] Test signup flow:
  - [ ] Click "Start free" or go to /onboarding
  - [ ] Enter email
  - [ ] Verify account created in Supabase
- [ ] Test login:
  - [ ] Go to /login
  - [ ] Log in with credentials
  - [ ] Redirect to onboarding or dashboard
- [ ] Test OAuth (if configured):
  - [ ] Try Google sign-in
- [ ] Check Render Logs for errors:
  - [ ] No 500 errors
  - [ ] Database connections working
  - [ ] API calls successful

## Phase 3: Post-Deployment

### Domain Setup (Optional)
- [ ] Purchase domain (e.g., mizhar.io)
- [ ] In Render Dashboard → Settings → Custom Domain
- [ ] Add your domain
- [ ] Configure DNS with registrar:
  - [ ] Create CNAME record pointing to Render URL
  - [ ] Wait for DNS propagation (24 hours typical)
- [ ] Verify HTTPS works on custom domain

### Email Configuration (Optional)
- [ ] Set up transactional email provider:
  - [ ] Resend.com
  - [ ] SendGrid
  - [ ] Mailgun
- [ ] Configure in Supabase → Email Templates
- [ ] Test email verification flow

### Monitoring & Analytics
- [ ] Set up error tracking:
  - [ ] Sentry.io for error monitoring
  - [ ] LogRocket for session replay
- [ ] Enable analytics:
  - [ ] Posthog
  - [ ] Mixpanel
  - [ ] Google Analytics
- [ ] Configure Render alerts:
  - [ ] High CPU/memory usage
  - [ ] Failed deployments
  - [ ] Error rate spikes

### Database Backups
- [ ] In Supabase Dashboard → Settings → Backups
- [ ] Enable automatic backups (daily recommended)
- [ ] Test restore procedure

### Security Hardening
- [ ] Review Supabase RLS policies (already configured)
- [ ] Enable 2FA on Supabase account
- [ ] Enable 2FA on Render account
- [ ] Enable 2FA on GitHub account
- [ ] Rotate API keys annually
- [ ] Review `DEPLOYMENT_GUIDE.md` for security checklist

## Phase 4: Feature Testing

### Authentication
- [ ] Email/password signup works
- [ ] Email/password login works
- [ ] Password reset works
- [ ] Magic link login works (if enabled)
- [ ] OAuth providers work (Google, LinkedIn, Apple)
- [ ] User profile accessible after signup

### Onboarding Flow
- [ ] /onboarding paths accessible
- [ ] Can select "Describe," "Upload," or "Template"
- [ ] Interview questions display correctly
- [ ] Progress saves to database
- [ ] AI processing screen shows
- [ ] Completes without errors

### Dashboard
- [ ] Overview page loads
- [ ] Metrics display correctly
- [ ] Charts render (SVG graphics)
- [ ] All navigation links work
- [ ] Sidebar toggles on mobile

### Free vs Pro Features
- [ ] Free user sees pro gate overlay on /app/startup/valuation
- [ ] Free user sees pro gate overlay on /app/startup/fundraising
- [ ] Free user sees pro gate overlay on /app/startup/simulations
- [ ] All other pages accessible to free users

### Exports
- [ ] PDF export button works
- [ ] DOCX export button works
- [ ] File downloads successfully
- [ ] File size reasonable

### Chat
- [ ] Message input works
- [ ] Messages submit successfully
- [ ] Conversation history saves
- [ ] Response time acceptable

## Phase 5: Go-Live Preparation

### Marketing
- [ ] Update social media with launch links
- [ ] Send launch email to waitlist
- [ ] Create landing page blog post
- [ ] Set up press kit materials

### Support
- [ ] Create support email: support@mizhar.io
- [ ] Set up help documentation
- [ ] Create FAQ page
- [ ] Set up status page: status.mizhar.io (optional)

### Monitoring
- [ ] Set up daily check-in schedule
- [ ] Monitor error logs daily
- [ ] Track user signups
- [ ] Monitor API performance
- [ ] Review Render metrics daily for first week

## Troubleshooting

### If Build Fails on Render
1. Check Build Logs in Render dashboard
2. Common causes:
   - [ ] Environment variable missing
   - [ ] Outdated npm dependencies: Run `npm install` locally and commit updated `package-lock.json`
   - [ ] TypeScript error: Run `npm run build` locally to verify
3. Trigger manual deployment after fixing

### If Database Connection Fails
1. Verify environment variables are set correctly
2. Check Supabase project is running
3. Test connection locally with `.env.local`
4. Check for RLS policy blocking access

### If OAuth Doesn't Work
1. Verify OAuth redirect URLs match exactly
2. Check OAuth credentials are correct
3. Verify Supabase provider is enabled
4. Check browser console for error details

### If Site is Slow
1. Check Render CPU/memory usage
2. Monitor database query performance in Supabase
3. Enable caching headers in Next.js
4. Consider upgrading Render instance type

## Success Criteria ✓

Your deployment is successful when:
- [ ] Site accessible at production URL
- [ ] User can sign up and verify email
- [ ] User can complete onboarding flow
- [ ] Dashboard shows correct data
- [ ] All features work as expected
- [ ] No errors in Render logs
- [ ] Performance acceptable (<2s page loads)
- [ ] All RLS policies protecting data
- [ ] Backups configured and tested

---

**Estimated Time**: 2-4 hours total
**Support**: See DEPLOYMENT_GUIDE.md and GITHUB_SETUP.md for detailed instructions
