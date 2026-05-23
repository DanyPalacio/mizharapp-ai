# MIZHAR Quick Start Guide

**Get up and running in 5 minutes**

---

## Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account (free tier works)
- Git

---

## 1. Setup Environment

```bash
# Clone or extract project
cd mizhar-app

# Install dependencies
npm install

# Create .env.local file
cat > .env.local << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
EOF
```

Get your Supabase keys from: https://app.supabase.com/project/[your-project]/settings/api

---

## 2. Setup Database

```bash
# Apply database migration
# Option A: Using psql
psql -h [host] -U [user] -d [database] -f supabase/migrations/20260522_create_blog_posts_table.sql

# Option B: Using Supabase dashboard
# 1. Go to SQL Editor in your Supabase project
# 2. Paste content of supabase/migrations/20260522_create_blog_posts_table.sql
# 3. Click "Run"
```

---

## 3. Start Development Server

```bash
npm run dev
```

Server runs at: http://localhost:3000

---

## 4. Test the Application

### Option A: Browser Testing (Recommended)

1. **View Case Studies**
   - Visit http://localhost:3000/app/startup/cases
   - Should show demo cases or mock data
   - Try filters: Verdict, Sector

2. **View Analytics**
   - Visit http://localhost:3000/app/startup/analytics
   - Should show verdict summary and breakdowns

3. **View Blog**
   - Visit http://localhost:3000/blog
   - Should show blog posts or mock posts
   - Try filters: Topic, Sector

### Option B: API Testing

```bash
# Get all cases
curl http://localhost:3000/api/cases?limit=10

# Get single case
curl http://localhost:3000/api/cases/1

# Get analytics
curl http://localhost:3000/api/cases/analytics

# Get blog posts
curl http://localhost:3000/api/blog?limit=10

# Get single blog post
curl http://localhost:3000/api/blog/anthropic-deep-vc-critique
```

### Option C: Full End-to-End Test

```bash
# 1. Ingest cases
curl -X POST http://localhost:3000/api/cases/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "yc_limit": 3,
    "cb_limit": 3,
    "tc_limit": 3,
    "sec_limit": 3
  }'

# Wait 10-15 seconds...

# 2. Analyze cases (use IDs from ingestion response)
curl -X POST http://localhost:3000/api/cases/analyze \
  -H "Content-Type: application/json" \
  -d '{"case_ids": [1, 2, 3]}'

# Wait 5 seconds...

# 3. Generate blog posts
curl -X POST http://localhost:3000/api/blog/generate \
  -H "Content-Type: application/json" \
  -d '{"case_ids": [1, 2, 3], "publish": false}'

# 4. View results in browser
# - http://localhost:3000/app/startup/cases
# - http://localhost:3000/app/startup/analytics
# - http://localhost:3000/blog
```

---

## 5. Common Issues

### "Table does not exist" Error

```bash
# Apply missing migration
psql -h [host] -U [user] -d [database] << 'EOF'
-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  case_id INTEGER,
  case_name VARCHAR(255),
  tags TEXT[] DEFAULT '{}',
  sectors TEXT[] DEFAULT '{}',
  published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP DEFAULT NOW(),
  author VARCHAR(255) DEFAULT 'MIZHAR Analysis',
  read_time INTEGER DEFAULT 5,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT fk_case FOREIGN KEY(case_id) REFERENCES startup_cases(id)
);
EOF
```

### "No Cases Found" Error

Mock data is shown automatically if database is empty. To add real data:

```bash
curl -X POST http://localhost:3000/api/cases/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "yc_limit": 5,
    "cb_limit": 5,
    "tc_limit": 5,
    "sec_limit": 5
  }'
```

### "Cannot find module" Error

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Environment Variables Not Loading

```bash
# Verify .env.local exists
cat .env.local

# Verify keys are set
echo $NEXT_PUBLIC_SUPABASE_URL
echo $SUPABASE_SERVICE_ROLE_KEY

# If not set, restart dev server
# Press Ctrl+C in terminal
npm run dev
```

---

## 6. Project Structure

```
mizhar-app/
├── src/
│   ├── app/              # Pages and API routes
│   ├── components/       # React components
│   └── ai_engine/        # Python AI modules
├── supabase/
│   └── migrations/       # Database migrations
├── .env.local            # Environment variables
├── package.json          # Dependencies
└── next.config.js        # Next.js config
```

---

## 7. Development Workflow

### Add New Case

```bash
curl -X POST http://localhost:3000/api/cases/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "yc_limit": 1,
    "cb_limit": 0,
    "tc_limit": 0,
    "sec_limit": 0
  }'
```

### Analyze Case

```bash
curl -X POST http://localhost:3000/api/cases/analyze \
  -H "Content-Type: application/json" \
  -d '{"case_ids": [1]}'
```

### Generate Blog Post

```bash
curl -X POST http://localhost:3000/api/blog/generate \
  -H "Content-Type: application/json" \
  -d '{"case_ids": [1], "publish": false}'
```

### View Data

Visit:
- Cases: http://localhost:3000/app/startup/cases
- Case Detail: http://localhost:3000/app/startup/cases/1
- Analytics: http://localhost:3000/app/startup/analytics
- Blog: http://localhost:3000/blog
- Blog Post: http://localhost:3000/blog/[slug]

---

## 8. Useful Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Format code
npm run format

# Check types
npm run type-check
```

---

## 9. Database Queries

### Check If Data Exists

```bash
# Via Supabase SQL Editor
SELECT COUNT(*) FROM startup_cases;
SELECT COUNT(*) FROM case_analyses;
SELECT COUNT(*) FROM blog_posts;
```

### Reset Data (WARNING: Destructive)

```bash
-- Delete all blog posts
DELETE FROM blog_posts;

-- Delete all analyses
DELETE FROM case_analyses;

-- Delete all cases
DELETE FROM startup_cases;

-- Reset IDs
ALTER SEQUENCE startup_cases_id_seq RESTART WITH 1;
ALTER SEQUENCE case_analyses_id_seq RESTART WITH 1;
ALTER SEQUENCE blog_posts_id_seq RESTART WITH 1;
```

---

## 10. Deployment

### Deploy to Render

```bash
# 1. Push to GitHub
git add .
git commit -m "Deploy MIZHAR platform"
git push origin main

# 2. Go to Render.com
# 3. Create new Web Service
# 4. Connect to GitHub repository
# 5. Set environment variables:
#    - NEXT_PUBLIC_SUPABASE_URL
#    - NEXT_PUBLIC_SUPABASE_ANON_KEY
#    - SUPABASE_SERVICE_ROLE_KEY
# 6. Deploy
```

---

## 11. Documentation

For detailed information, see:

- **Database Integration**: `DATABASE_INTEGRATION_COMPLETE.md`
- **Blog System**: `BLOG_SYSTEM_INTEGRATION.md`
- **Testing**: `TESTING_GUIDE.md`
- **Project Status**: `PROJECT_STATUS_MAY_22_5PM.md`
- **SPRINT 2 Status**: `SPRINT_2_COMPLETION_STATUS.md`

---

## 12. Support

### Check Logs

```bash
# Browser console (F12)
# Check for any red errors

# Terminal output
# Watch for "error" messages in dev server output
```

### API Status

```bash
# Health check
curl http://localhost:3000/api/cases/analytics
# Should return JSON (or mock data)
```

### Database Status

```bash
# Test connection
psql -h [host] -U [user] -d [database] -c "SELECT 1;"
# Should return "1" if connected
```

---

## 13. Next Steps

Once basic setup works:

1. ✅ **Ingest real cases** (via API)
2. ✅ **Analyze cases** (triggers Challenge Mode)
3. ✅ **Generate blog posts** (from analyses)
4. ✅ **View in dashboard** (all data displays)
5. ✅ **Test mobile** (responsive design)
6. ✅ **Run full test suite** (see TESTING_GUIDE.md)
7. ✅ **Deploy to production** (Render)

---

## 14. Tips & Tricks

### Faster Development

- Use mock data while developing UI
- Disable migrations if not changing schema
- Use browser DevTools network tab to inspect API calls

### Better Testing

- Test one endpoint at a time
- Check database before and after API calls
- Use curl with `-i` flag to see response headers

### Performance

- Monitor API response times
- Check database query performance
- Review browser DevTools Network tab

---

## 15. Keyboard Shortcuts

**In Browser DevTools:**
- `F12` - Open DevTools
- `Ctrl+Shift+J` - Open Console
- `Ctrl+Shift+K` - Open Network tab
- `Ctrl+K` - Search

**In Terminal:**
- `Ctrl+C` - Stop dev server
- `Ctrl+L` - Clear terminal
- `↑` - Previous command

---

## 🚀 You're Ready!

Run `npm run dev` and visit http://localhost:3000

**Happy coding! 🎉**
