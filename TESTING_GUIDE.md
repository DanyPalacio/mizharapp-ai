# MIZHAR Testing Guide - May 22, 2026

**Complete testing guide for SPRINT 1 and SPRINT 2 integration**

---

## Pre-Testing Checklist

- [ ] Supabase project is running and connected
- [ ] Environment variables are set (.env.local)
- [ ] Database migrations have been applied
- [ ] Next.js dev server is running
- [ ] Python modules are in place (for future integration)

---

## Phase 1: Database Integration Testing

### 1.1 Test Case Ingestion

**Trigger data ingestion:**

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

**Expected response:**
```json
{
  "success": true,
  "ingestion": {
    "total_ingested": 4,
    "cases_created": [
      { "id": 1, "name": "Case 1", ... },
      { "id": 2, "name": "Case 2", ... }
    ]
  }
}
```

**Verify in browser:**
- Visit http://localhost:3000/app/startup/cases
- Should see cases displayed in grid
- Cases should be clickable

### 1.2 Test Case Analysis

**Trigger analysis for ingested cases:**

```bash
curl -X POST http://localhost:3000/api/cases/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "case_ids": [1, 2, 3]
  }'
```

**Expected response:**
```json
{
  "success": true,
  "verdict_summary": {
    "PASS": 1,
    "CONDITIONAL": 1,
    "FAIL": 1
  }
}
```

**Verify:**
- Check database: `SELECT * FROM case_analyses LIMIT 5;`
- Should have verdict, risk_score, challenge_analysis
- Visit case detail page to see analysis

### 1.3 Test Case Retrieval

**Get all cases with pagination:**

```bash
curl http://localhost:3000/api/cases?page=0&limit=10
```

**Verify response includes:**
- Case metadata (id, name, description, stage, sectors, funding)
- Latest verdict and risk_score
- Pagination info (total, current page)

**Filter by verdict:**

```bash
curl "http://localhost:3000/api/cases?verdict=PASS&limit=10"
```

**Filter by sector:**

```bash
curl "http://localhost:3000/api/cases?sector=AI&limit=10"
```

### 1.4 Test Single Case Detail

**Get full case with analysis:**

```bash
curl http://localhost:3000/api/cases/1
```

**Verify response includes:**
- All case data
- Latest analysis: verdict, risk_score, challenge_analysis
- Critical issues array
- Strategic alternatives text
- Similar cases list

**Test in browser:**
- Visit http://localhost:3000/app/startup/cases/1
- Should display all case information
- Should show analysis results
- Links to related cases should work

### 1.5 Test Analytics

**Get analytics aggregation:**

```bash
curl http://localhost:3000/api/cases/analytics
```

**Verify response includes:**
```json
{
  "sectors": {
    "AI": {
      "total": 5,
      "verdicts": { "PASS": 2, "CONDITIONAL": 2, "FAIL": 1 },
      "percentages": { "PASS": "40", "CONDITIONAL": "40", "FAIL": "20" }
    }
  },
  "stages": { ... },
  "risk_clusters": {
    "low_risk": ["Anthropic", ...],
    "medium_risk": [...],
    "high_risk": [...]
  },
  "verdict_totals": { "PASS": 5, "CONDITIONAL": 5, "FAIL": 5 }
}
```

**Test in browser:**
- Visit http://localhost:3000/app/startup/analytics
- Should show verdict summary cards
- Sector breakdown with progress bars
- Stage breakdown with stacked charts
- Risk clustering by level

---

## Phase 2: Blog System Testing

### 2.1 Test Blog Post Generation

**Generate blog posts from analyzed cases:**

```bash
curl -X POST http://localhost:3000/api/blog/generate \
  -H "Content-Type: application/json" \
  -d '{
    "case_ids": [1, 2, 3],
    "publish": false
  }'
```

**Expected response:**
```json
{
  "success": true,
  "generated": 3,
  "saved": 3,
  "published": false,
  "posts": [
    {
      "id": 1,
      "slug": "case-1-slug",
      "title": "Case 1: In-Depth Challenge Mode Analysis",
      "case_name": "Case 1",
      "tags": ["venture-analysis", "stage", "sector"],
      "sectors": ["AI", "Software"]
    }
  ],
  "errors": []
}
```

### 2.2 Test Blog Index

**Fetch all blog posts:**

```bash
curl http://localhost:3000/api/blog?limit=10&offset=0
```

**Verify response includes:**
- Array of blog posts
- Each post has: id, title, slug, excerpt, content, tags, sectors, published_at, read_time
- Total count of posts

**Test in browser:**
- Visit http://localhost:3000/blog
- Should display blog post cards
- Cards should show: title, excerpt, tags, sectors, metadata
- Should have filter options for tags and sectors

### 2.3 Test Blog Filtering

**Filter by tag:**

```bash
curl "http://localhost:3000/api/blog?tag=venture-analysis&limit=10"
```

**Filter by sector:**

```bash
curl "http://localhost:3000/api/blog?sector=AI&limit=10"
```

**Test in browser:**
- Go to /blog
- Select different filter options
- Results should update
- Should show "X posts found" message
- "Clear filters" button should work

### 2.4 Test Blog Detail Page

**Get single blog post:**

```bash
curl http://localhost:3000/api/blog/some-case-slug
```

**Verify response includes:**
- Full post content (markdown)
- Title, excerpt, tags, sectors, metadata
- Associated case information
- Read time, author, publication date

**Test in browser:**
- Click on a blog post card
- Should navigate to /blog/[slug]
- Should display full post content
- Should show "Read the Full Case Study" link
- Back button should work
- Related links should navigate correctly

### 2.5 Test Blog/Case Integration

**Verify blog posts link to case studies:**

In browser:
- Go to blog post detail
- Look for "Read the Full Case Study" link
- Click link → should navigate to /app/startup/cases/[id]
- Case detail should display analysis

---

## Phase 3: Filtering and Search Testing

### 3.1 Cases Page Filters

**In browser at /app/startup/cases:**

1. **Verdict Filter:**
   - [ ] "All Verdicts" shows all cases
   - [ ] "PASS" shows only PASS verdicts
   - [ ] "CONDITIONAL" shows only CONDITIONAL
   - [ ] "FAIL" shows only FAIL
   - [ ] Count updates correctly

2. **Sector Filter:**
   - [ ] "All Sectors" shows all cases
   - [ ] Each sector filters correctly
   - [ ] Multiple sector options are available
   - [ ] Combined verdict + sector filters work

3. **Case Cards:**
   - [ ] Display case name
   - [ ] Display description
   - [ ] Display sectors as tags
   - [ ] Display stage, funding, source
   - [ ] Display verdict badge
   - [ ] Display risk score
   - [ ] Are clickable and navigate to detail

### 3.2 Blog Index Filters

**In browser at /blog:**

1. **Topic Filter:**
   - [ ] "All Topics" shows all posts
   - [ ] Each topic filters correctly
   - [ ] Multiple topics available

2. **Sector Filter:**
   - [ ] "All Sectors" shows all posts
   - [ ] Each sector filters correctly
   - [ ] Combined topic + sector filters work

3. **Blog Cards:**
   - [ ] Display title
   - [ ] Display excerpt (truncated)
   - [ ] Display topic tags
   - [ ] Display sector tags
   - [ ] Display author, date, read time
   - [ ] Are clickable and navigate to detail

### 3.3 Analytics Dashboard

**In browser at /app/startup/analytics:**

1. **Verdict Summary:**
   - [ ] Shows 4 cards: Ready to Fund, Needs Work, Major Issues, Not Analyzed
   - [ ] Displays correct counts
   - [ ] Updates after new analyses

2. **By Sector:**
   - [ ] Lists all sectors
   - [ ] Shows verdict breakdown for each
   - [ ] Progress bars are proportional
   - [ ] Percentages sum to 100%

3. **By Funding Stage:**
   - [ ] Lists all stages (Seed, Series A, B, C+)
   - [ ] Shows stacked bar chart
   - [ ] Percentages display correctly
   - [ ] Legend shows verdict breakdown

4. **Risk Clustering:**
   - [ ] Three columns: Low, Medium, High Risk
   - [ ] Shows case names in each cluster
   - [ ] Company count is accurate

---

## Phase 4: Error Handling Testing

### 4.1 Invalid Requests

**Test API with invalid parameters:**

```bash
# Invalid case ID
curl http://localhost:3000/api/cases/99999

# Invalid slug
curl http://localhost:3000/api/blog/invalid-slug-that-does-not-exist

# Invalid JSON
curl -X POST http://localhost:3000/api/blog/generate \
  -H "Content-Type: application/json" \
  -d 'invalid json'

# Missing required fields
curl -X POST http://localhost:3000/api/blog/generate \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Verify:**
- [ ] Appropriate HTTP status codes (400, 404, 500)
- [ ] Descriptive error messages
- [ ] No sensitive information exposed
- [ ] Frontend shows error UI gracefully

### 4.2 Database Errors

**Verify error handling when:**
- [ ] Database is down → Fallback to mock data
- [ ] Slug is missing → 404 response
- [ ] Invalid query parameters → 400 response
- [ ] Large result sets → Proper pagination

### 4.3 Frontend Error States

**In browser:**
- [ ] Loading states show spinner
- [ ] Empty states show helpful message
- [ ] Error states show error message with context
- [ ] Fallback mock data works
- [ ] Navigation still works even with errors

---

## Phase 5: Performance Testing

### 5.1 Load Testing

**Measure response times:**

```bash
# Test with 100 cases
time curl http://localhost:3000/api/cases?limit=100

# Test with pagination
time curl "http://localhost:3000/api/cases?page=0&limit=50"
time curl "http://localhost:3000/api/cases?page=1&limit=50"
time curl "http://localhost:3000/api/cases?page=2&limit=50"
```

**Expected performance:**
- API responses < 200ms
- Database queries < 100ms
- Frontend loads < 2s

### 5.2 Memory Usage

**Monitor during testing:**
- Check browser console for memory leaks
- Monitor Next.js dev server memory
- Verify no unnecessary re-renders

### 5.3 Network Testing

**Test with Network Throttling:**
1. Open DevTools
2. Go to Network tab
3. Select "Slow 3G"
4. Reload pages
5. Verify loading states and error handling work

---

## Phase 6: Mobile Responsive Testing

### 6.1 Test All Pages on Mobile

**Use Chrome DevTools:**
1. F12 to open DevTools
2. Click device toolbar icon
3. Select iPhone 12 or similar

**Test each page:**
- [ ] /app/startup/cases
- [ ] /app/startup/cases/[id]
- [ ] /app/startup/analytics
- [ ] /blog
- [ ] /blog/[slug]

**Verify:**
- [ ] Text is readable
- [ ] Buttons are clickable
- [ ] Images scale properly
- [ ] Forms are usable
- [ ] Navigation works
- [ ] No horizontal scrolling

### 6.2 Test Tablet

**Use iPad layout:**
- [ ] 2-column grids work
- [ ] All content fits
- [ ] Touch interactions work

---

## Phase 7: Browser Compatibility Testing

**Test in:**
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

**Verify:**
- [ ] All pages load
- [ ] Styles are applied correctly
- [ ] JavaScript works
- [ ] No console errors

---

## Testing Automation Script

```bash
#!/bin/bash

echo "🧪 MIZHAR Platform Testing Suite"
echo "================================="

# Test Case Ingestion
echo -e "\n1️⃣ Testing Case Ingestion..."
curl -X POST http://localhost:3000/api/cases/ingest \
  -H "Content-Type: application/json" \
  -d '{"yc_limit": 2, "cb_limit": 2, "tc_limit": 2, "sec_limit": 2}' \
  -w "\nStatus: %{http_code}\n\n"

# Test Case Analysis
echo -e "\n2️⃣ Testing Case Analysis..."
curl -X POST http://localhost:3000/api/cases/analyze \
  -H "Content-Type: application/json" \
  -d '{"case_ids": [1, 2]}' \
  -w "\nStatus: %{http_code}\n\n"

# Test Get Cases
echo -e "\n3️⃣ Testing Get Cases..."
curl http://localhost:3000/api/cases?limit=5 \
  -w "\nStatus: %{http_code}\n\n"

# Test Get Analytics
echo -e "\n4️⃣ Testing Analytics..."
curl http://localhost:3000/api/cases/analytics \
  -w "\nStatus: %{http_code}\n\n"

# Test Blog Generation
echo -e "\n5️⃣ Testing Blog Generation..."
curl -X POST http://localhost:3000/api/blog/generate \
  -H "Content-Type: application/json" \
  -d '{"case_ids": [1, 2]}' \
  -w "\nStatus: %{http_code}\n\n"

# Test Get Blog Posts
echo -e "\n6️⃣ Testing Get Blog Posts..."
curl http://localhost:3000/api/blog?limit=5 \
  -w "\nStatus: %{http_code}\n\n"

echo -e "\n✅ Testing Complete!"
```

---

## Expected Test Results

### Successful Run

```
✅ Case ingestion creates 4 cases
✅ Cases are queryable via API
✅ Case analysis generates verdicts
✅ Analytics aggregates correctly
✅ Blog generation creates posts
✅ Blog posts are queryable and displayable
✅ Filtering works for both cases and posts
✅ Error handling returns appropriate responses
✅ Mock data fallback works
✅ All pages load without errors
```

### Database Verification

```sql
-- Check tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check row counts
SELECT COUNT(*) FROM startup_cases;
SELECT COUNT(*) FROM case_analyses;
SELECT COUNT(*) FROM blog_posts;

-- Check foreign keys
SELECT * FROM startup_cases 
LEFT JOIN case_analyses ON startup_cases.id = case_analyses.case_id 
LIMIT 5;

-- Check blog relationships
SELECT * FROM blog_posts 
WHERE case_id IS NOT NULL 
LIMIT 5;
```

---

## Troubleshooting

### Issue: "Table does not exist"

**Solution:**
```bash
# Apply migrations
cd supabase
psql -h localhost -U postgres -f migrations/20260522_create_blog_posts_table.sql
```

### Issue: "No cases found"

**Solution:**
1. Trigger case ingestion via API
2. Or manually insert test data:
```sql
INSERT INTO startup_cases (name, description, stage, sectors, total_funding, data_source)
VALUES ('Test Case', 'Test Description', 'Seed', '{"AI", "Software"}', 1000000000, 'test');
```

### Issue: Mock data not showing

**Solution:**
- Frontend checks for empty result set
- Ensure API returns proper JSON
- Check browser console for errors

### Issue: Blog generation fails

**Solution:**
1. Verify cases have analyses
2. Check case_analyses table has data
3. Review API logs for error messages
4. Try with fewer case_ids first

---

## Performance Benchmarks

| Operation | Target | Actual |
|-----------|--------|--------|
| List 50 cases | < 200ms | |
| Get case detail | < 200ms | |
| Analytics aggregation | < 300ms | |
| List 50 blog posts | < 200ms | |
| Blog generation (3 posts) | < 1s | |
| Page load (cases) | < 2s | |
| Page load (analytics) | < 2s | |
| Page load (blog index) | < 2s | |
| Page load (blog detail) | < 1.5s | |

---

## Sign-Off Checklist

After testing, verify:

- [ ] All API endpoints respond correctly
- [ ] Database tables have proper data
- [ ] Frontend pages display data
- [ ] Filters work correctly
- [ ] Error handling is graceful
- [ ] Mobile responsive works
- [ ] Performance is acceptable
- [ ] No console errors
- [ ] No broken links
- [ ] All CSS styles applied

**Sign-off date**: ___________  
**Tested by**: ___________  
**Status**: ☐ Ready for Deployment
