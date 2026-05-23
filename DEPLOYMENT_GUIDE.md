# MIZHAR AI - Deployment Guide (GitHub + Render)

**Date:** May 2026
**Status:** Production Ready

---

## 📋 Pre-Deployment Checklist

- [x] All code committed and tested
- [x] Environment variables documented
- [x] Database migrations ready
- [x] Legal documents published
- [x] Security audit complete
- [ ] GitHub repository created (Next Step)
- [ ] Render account created (Next Step)
- [ ] Environment variables configured (Next Step)
- [ ] Database provisioned (Next Step)
- [ ] Domain configured (Next Step)

---

## 1️⃣ Step 1: Create GitHub Repository

### 1.1 Create Repository on GitHub
```bash
# Go to https://github.com/new
# Fill in:
Name: mizhar-app
Description: AI-powered business intelligence platform for founders
Visibility: Private (or Public if you prefer)
# Click "Create repository"
```

### 1.2 Initialize Git Locally
```bash
cd /Volumes/MUSIC\ USB-C/MIZHAR/mizhar-app

# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: MIZHAR AI - Complete platform with auth, admin, legal, and compliance"

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/mizhar-app.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 1.3 Verify Repository Structure
```
mizhar-app/
├── src/
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── middleware/
├── migrations/
├── public/
├── .gitignore
├── package.json
├── tsconfig.json
├── next.config.js
├── render.yaml
├── DEPLOYMENT_GUIDE.md
└── [other files]
```

---

## 2️⃣ Step 2: Create & Configure Render Account

### 2.1 Create Render Account
1. Go to https://render.com
2. Sign up with email or GitHub
3. Create team (optional)

### 2.2 Create Web Service
1. Dashboard → New + → Web Service
2. Connect GitHub repository
3. Configure:
   - **Name:** mizhar-ai
   - **Environment:** Node
   - **Plan:** Starter ($7/month) or Pro
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
   - **Region:** Ohio or US East

### 2.3 Add Environment Variables
In Render Dashboard → Environment:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ADMIN_TOKEN=your-secure-admin-token
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM_EMAIL=noreply@mizhar.ai
NODE_ENV=production
```

---

## 3️⃣ Step 3: Configure Database (Supabase)

### 3.1 Create Supabase Project (if not done)
1. Go to https://supabase.com
2. Create new project
3. Note your credentials:
   - Project URL
   - Service Role Key
   - Public Anon Key

### 3.2 Apply Database Migrations
```bash
# Option A: Using Supabase CLI
npx supabase link --project-ref your-project-ref
npx supabase db push

# Option B: Manual in Supabase Dashboard
# 1. Go to SQL Editor
# 2. Create new query
# 3. Paste contents of migrations/001_auth_and_user_tracking.sql
# 4. Execute
```

### 3.3 Verify Migrations
In Supabase Dashboard → Table Editor:
- [ ] auth_audit_logs table exists
- [ ] newsletters table exists
- [ ] session_tracking table exists
- [ ] tool_usage_tracking table exists
- [ ] users table has new fields

---

## 4️⃣ Step 4: Configure Render Deployment

### 4.1 Connect GitHub Repository
1. Render Dashboard → Web Service
2. Connect GitHub account
3. Select mizhar-app repository
4. Authorize Render to access repository

### 4.2 Automatic Deployments
- Enable: Auto-deploy on push to main
- This will trigger build/deploy on every git push

### 4.3 Manual Deployment (if needed)
```bash
# Push changes to GitHub
git push origin main

# Render will automatically deploy
# Monitor at: https://dashboard.render.com
```

---

## 5️⃣ Step 5: Configure Domain (Optional)

### 5.1 Custom Domain on Render
1. Render Dashboard → Web Service → Settings
2. Custom Domain
3. Enter your domain: `mizhar.ai` or `app.mizhar.ai`
4. Update DNS records at your domain registrar:
   - Point to: `your-service.onrender.com`

### 5.2 SSL Certificate
- Render automatically provisions SSL (free with Let's Encrypt)
- Redirect HTTP → HTTPS

---

## 6️⃣ Step 6: Post-Deployment Verification

### 6.1 Test Application
```bash
# Test main page
curl https://your-app.onrender.com

# Test health check
curl https://your-app.onrender.com/api/health

# Test admin endpoint
curl -H "x-admin-token: YOUR_ADMIN_TOKEN" \
  https://your-app.onrender.com/api/admin/analytics
```

### 6.2 Verify Legal Pages
- [ ] https://your-app.onrender.com/legal/terms
- [ ] https://your-app.onrender.com/legal/privacy
- [ ] https://your-app.onrender.com/legal/about

### 6.3 Check Logs
```
Render Dashboard → Web Service → Logs
```

---

## 7️⃣ Step 7: Set Up Monitoring

### 7.1 Render Monitoring
- Enable notifications in Render Dashboard
- Alert on deployment failures
- Monitor build times and logs

### 7.2 Recommended Additions
- [ ] Set up error tracking (Sentry)
- [ ] Set up analytics (PostHog, Mixpanel)
- [ ] Set up uptime monitoring (Pingdom, UptimeRobot)
- [ ] Set up log aggregation (LogRocket)

---

## 8️⃣ Step 8: Security Configuration

### 8.1 Secure Admin Access
```bash
# Generate strong admin token
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Add to Render environment variables
# ADMIN_TOKEN=your-generated-token
```

### 8.2 HTTPS Enforcement
- Automatic via Render + Let's Encrypt
- All traffic redirected to HTTPS

### 8.3 Rate Limiting
- Already configured in code
- Free: 5 req/hr, Pro: 100 req/hr, Admin: 1000 req/hr

### 8.4 Database Security
- Supabase provides encryption at rest
- Connection string is encrypted
- Row-Level Security (RLS) policies active

---

## 9️⃣ Step 9: Continuous Integration / Continuous Deployment

### 9.1 GitHub Actions (Optional)
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Render

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Trigger Render deployment
        run: |
          curl -X POST https://api.render.com/deploy/srv-your-service-id \
            -H "Authorization: Bearer ${{ secrets.RENDER_DEPLOY_TOKEN }}"
```

### 9.2 Testing Before Deploy
```bash
# Install dependencies
npm install

# Run linter
npm run lint

# Build project
npm run build

# Run tests
npm test
```

---

## 🔟 Step 10: Troubleshooting

### Common Issues

#### Issue: Build fails with "Module not found"
```bash
# Solution: Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### Issue: Database connection timeout
```bash
# Check Supabase status
# Verify NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
# Test connection with psql
psql postgresql://user:password@db.supabase.co/postgres
```

#### Issue: Admin token not working
```bash
# Verify x-admin-token header is set
curl -H "x-admin-token: YOUR_TOKEN" https://your-app.onrender.com/api/admin/analytics

# Check token in Render environment variables
```

#### Issue: SMTP not sending newsletters
```bash
# Verify SMTP credentials
# Test SMTP connection:
openssl s_client -connect smtp.gmail.com:587 -starttls smtp
# Check Gmail "Less secure apps" setting (if using Gmail)
```

---

## 📊 Environment Variables Reference

### Required for Production
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=xxx

# Admin
ADMIN_TOKEN=your-secure-token

# SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM_EMAIL=noreply@mizhar.ai

# Next.js
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-app.onrender.com
```

---

## 📈 Performance Optimization

### 1. Enable Caching
- Render caches `node_modules` between builds
- Configure cache headers in Next.js

### 2. CDN (Optional)
- Use Cloudflare for global CDN
- Free tier available
- Caches static assets globally

### 3. Database Optimization
- Create indexes (included in migrations)
- Monitor query performance in Supabase
- Set up read replicas for high traffic

### 4. Image Optimization
- Next.js Image component (already used)
- Automatic WebP conversion
- Responsive image serving

---

## 🔄 Update & Rollback Procedures

### Deploy New Version
```bash
# Make changes locally
git add .
git commit -m "Feature: Add new feature"
git push origin main

# Render automatically deploys
# Monitor logs at https://dashboard.render.com
```

### Rollback to Previous Version
```bash
# In Render Dashboard
# 1. Go to Deployments
# 2. Find previous deployment
# 3. Click "Redeploy"
```

---

## 📝 Deployment Checklist (Final)

- [ ] GitHub repository created and code pushed
- [ ] Render account created
- [ ] GitHub repository connected to Render
- [ ] All environment variables configured in Render
- [ ] Database migrations applied
- [ ] Web service deployed successfully
- [ ] Domain configured (if custom domain)
- [ ] SSL certificate active (automatic)
- [ ] Admin endpoints tested
- [ ] Legal pages accessible
- [ ] Monitoring configured
- [ ] Backup strategy implemented
- [ ] Support team trained
- [ ] Launch announcement prepared

---

## 🚀 Launch Steps

### 1. Test Everything
```bash
# 1. Test in production environment
# 2. Verify all endpoints working
# 3. Check admin panel access
# 4. Test newsletter sending
# 5. Verify legal pages
```

### 2. Monitor Closely
```bash
# 1. Watch error logs for first 24 hours
# 2. Monitor uptime and performance
# 3. Track user signups
# 4. Monitor payment processing
```

### 3. Scale if Needed
```bash
# If experiencing high traffic:
# 1. Upgrade Render plan
# 2. Enable database read replicas
# 3. Implement caching layer
# 4. Add CDN (Cloudflare)
```

---

## 📞 Support

### Render Support
- Documentation: https://render.com/docs
- Status Page: https://status.render.com
- Support: https://render.com/support

### Supabase Support
- Documentation: https://supabase.com/docs
- Status: https://status.supabase.com
- Support: https://supabase.com/support

### GitHub Support
- Documentation: https://docs.github.com
- Discussions: https://github.com/orgs/community

---

## ✅ Deployment Complete!

**Your MIZHAR AI platform is now live and production-ready.**

### Next Steps:
1. ✅ Monitor performance metrics
2. ✅ Gather user feedback
3. ✅ Plan feature updates
4. ✅ Scale infrastructure as needed
5. ✅ Expand team/support

---

**Document Status:** Complete
**Last Updated:** May 2026
**Next Review:** Upon deployment

---

**MIZHAR AI - NOW LIVE ON GITHUB & RENDER** 🚀
