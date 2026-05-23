# SPRINT 2: Real Case Studies - Execution Plan

**Objective**: Ingest 20-30 real startup cases and generate Challenge Mode analyses  
**Estimated Duration**: 3-4 days  
**Parallel with**: SPRINT 1 (Dashboard UI)  
**Status**: 🚀 READY TO START

---

## What SPRINT 2 Builds

### 🎯 Core System
1. **Case Ingestion Engine** - Pull real startup data from multiple sources
2. **Batch Analysis Pipeline** - Run Challenge Mode on each startup
3. **Results Storage** - Save analyses in PostgreSQL
4. **Case Study Blog** - Display results with comparisons

### 📊 Data Sources
- **YCombinator** (API or web scraping) - 500+ startups
- **TechCrunch** (RSS/Scraping) - Recent fundraising articles
- **Crunchbase** (API) - Company data + funding rounds
- **SEC EDGAR** (API) - Public company financials
- **Startup databases** - Pre-compiled datasets

### 🧠 Analysis Pipeline
```
Raw Startup Data
    ↓
Profile Normalization
    ↓
Challenge Mode Analysis (Claude)
    ↓
Strategic Alternatives (Claude)
    ↓
Results Storage (PostgreSQL)
    ↓
Blog Display + Comparisons
```

---

## Implementation Steps

### Phase 1: Data Ingestion (1 day)

#### Step 1.1: Create Case Ingestion Module
```python
# File: src/ai_engine/case_ingestion.py

class CaseIngestion:
    """Ingest startup data from multiple sources"""
    
    def ingest_yc(self):
        """Get YC startup data"""
        # Parse YC API or directory
        # Extract: company name, description, founding date, founders, sector
        
    def ingest_crunchbase(self):
        """Get Crunchbase data via API"""
        # Query Crunchbase API for recent funding rounds
        # Extract: company, founders, funding amount, stage, metrics
        
    def ingest_techcrunch(self):
        """Get TechCrunch funding news"""
        # Parse TechCrunch RSS/articles
        # Extract: startup, funding amount, round, investors
        
    def ingest_sec_edgar(self):
        """Get public company data"""
        # Query SEC EDGAR for recent IPOs, S-1 filings
        # Extract: company metrics, business model, risk factors
        
    def normalize_profile(self, raw_data):
        """Convert various formats to standard profile"""
        return {
            "name": "",
            "description": "",
            "founding_date": "",
            "founders": [],
            "sector": "",
            "stage": "",
            "funding_raised": 0,
            "last_funding_round": "",
            "employees": 0,
            "website": "",
            "location": "",
            "market": ""
        }
```

#### Step 1.2: Set Up PostgreSQL Storage
```sql
-- New table for cases
CREATE TABLE startup_cases (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    data_source VARCHAR(100),  -- "YC", "Crunchbase", "TechCrunch"
    raw_data JSONB,
    normalized_profile JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Table for analyses
CREATE TABLE case_analyses (
    id SERIAL PRIMARY KEY,
    case_id INT REFERENCES startup_cases(id),
    challenge_analysis JSONB,  -- Full Claude response
    risk_score INT,
    verdict VARCHAR(50),  -- PASS, CONDITIONAL, FAIL
    critical_issues TEXT[],
    major_concerns TEXT[],
    strategic_alternatives JSONB,
    analyzed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_cases_source ON startup_cases(data_source);
CREATE INDEX idx_cases_sector ON startup_cases((normalized_profile->>'sector'));
CREATE INDEX idx_analyses_verdict ON case_analyses(verdict);
```

### Phase 2: Analysis Pipeline (1.5 days)

#### Step 2.1: Create Batch Analyzer
```python
# File: src/ai_engine/case_analyzer.py

class CaseAnalyzer:
    """Run Challenge Mode analysis on startup cases"""
    
    def __init__(self):
        self.agent = ChallengeModeAgent()
        self.db = SupabaseConnection()
    
    def analyze_batch(self, case_ids: List[int], concurrent: int = 5):
        """Analyze multiple cases in parallel"""
        # Use ThreadPoolExecutor for parallel analysis
        # Rate limit to avoid API throttling
        # Save results to PostgreSQL
        
    def analyze_single(self, case_id: int):
        """Analyze one startup case"""
        case = self.db.get_case(case_id)
        profile = case.normalized_profile
        
        # Run Challenge Mode
        analysis = self.agent.analyze_startup(profile)
        
        # Run Strategic Rewrite
        alternatives = self.agent.propose_strategic_rewrite(
            profile,
            analysis["analysis"]
        )
        
        # Extract metrics
        verdict = self._extract_verdict(analysis["analysis"])
        risk_score = self._extract_risk_score(analysis["analysis"])
        
        # Store results
        self.db.save_analysis({
            "case_id": case_id,
            "challenge_analysis": analysis,
            "strategic_alternatives": alternatives,
            "verdict": verdict,
            "risk_score": risk_score
        })
        
        return {
            "case_id": case_id,
            "verdict": verdict,
            "risk_score": risk_score
        }
```

#### Step 2.2: Implement Parallel Processing
```python
# File: src/ai_engine/batch_processor.py

from concurrent.futures import ThreadPoolExecutor, as_completed
import time

class BatchProcessor:
    """Process multiple cases in parallel with rate limiting"""
    
    def __init__(self, max_workers: int = 5, rate_limit: float = 0.5):
        self.max_workers = max_workers
        self.rate_limit = rate_limit  # Seconds between API calls
        self.last_api_call = 0
    
    def process_cases(self, case_ids: List[int]):
        """Process multiple cases with rate limiting"""
        analyzer = CaseAnalyzer()
        results = []
        
        with ThreadPoolExecutor(max_workers=self.max_workers) as executor:
            futures = {}
            
            for case_id in case_ids:
                # Rate limit
                elapsed = time.time() - self.last_api_call
                if elapsed < self.rate_limit:
                    time.sleep(self.rate_limit - elapsed)
                
                future = executor.submit(analyzer.analyze_single, case_id)
                futures[future] = case_id
                self.last_api_call = time.time()
            
            for future in as_completed(futures):
                try:
                    result = future.result()
                    results.append(result)
                    print(f"✅ Analyzed case {result['case_id']}: {result['verdict']}")
                except Exception as e:
                    print(f"❌ Error analyzing case {futures[future]}: {str(e)}")
        
        return results
```

### Phase 3: Blog System (1 day)

#### Step 3.1: Create Blog Backend
```python
# File: src/ai_engine/blog_generator.py

class BlogGenerator:
    """Generate blog posts from case analyses"""
    
    def generate_case_post(self, case_id: int):
        """Create a blog post for one case"""
        case = self.db.get_case(case_id)
        analysis = self.db.get_analysis(case_id)
        
        post = {
            "title": f"Venture Analysis: {case.name}",
            "slug": self._generate_slug(case.name),
            "excerpt": self._generate_excerpt(analysis),
            "body": self._generate_body(case, analysis),
            "verdict_badge": self._create_verdict_badge(analysis["verdict"]),
            "risk_score": analysis["risk_score"],
            "published_at": datetime.now(),
            "case_id": case_id
        }
        
        # Save to database
        self.db.save_blog_post(post)
        return post
    
    def generate_comparison(self, case_ids: List[int]):
        """Compare multiple cases side-by-side"""
        cases = [self.db.get_case(cid) for cid in case_ids]
        analyses = [self.db.get_analysis(cid) for cid in case_ids]
        
        comparison = {
            "title": f"Comparative Analysis: {len(cases)} Startups",
            "cases": cases,
            "analyses": analyses,
            "verdict_distribution": self._analyze_verdicts(analyses),
            "risk_comparison": self._compare_risks(analyses),
            "common_issues": self._find_common_issues(analyses)
        }
        
        return comparison
```

#### Step 3.2: Create Next.js Blog Pages
```typescript
// File: src/app/blog/[slug]/page.tsx

export default async function CaseStudyPage({ params }) {
    const post = await getCaseBlogPost(params.slug);
    const analysis = await getCaseAnalysis(post.case_id);
    
    return (
        <div className="case-study-page">
            <header>
                <h1>{post.title}</h1>
                <VerdictBadge verdict={analysis.verdict} />
                <RiskScore score={analysis.risk_score} />
            </header>
            
            <section className="startup-overview">
                {/* Company info */}
            </section>
            
            <section className="challenge-analysis">
                {/* Display challenge verdict, critical issues, concerns */}
            </section>
            
            <section className="strategic-alternatives">
                {/* Show alternative business models */}
            </section>
            
            <section className="related-cases">
                {/* Similar startups for comparison */}
            </section>
        </div>
    );
}
```

### Phase 4: Comparisons & Discovery (0.5 day)

#### Step 4.1: Comparison Engine
```python
# File: src/ai_engine/comparisons.py

class ComparisonEngine:
    """Find similar cases and create comparisons"""
    
    def find_similar_cases(self, case_id: int, top_n: int = 5):
        """Find similar startups using semantic similarity"""
        target = self.db.get_case(case_id)
        
        # Use vector similarity on descriptions
        # OR use sector/stage filtering + manual comparison
        
        similar_cases = self.db.find_similar({
            "sector": target.sector,
            "stage": target.stage,
            "founding_year_range": [
                target.founding_date.year - 1,
                target.founding_date.year + 1
            ]
        })
        
        return similar_cases[:top_n]
    
    def compare_verdicts_by_sector(self):
        """Analytics: Which sectors get PASS/CONDITIONAL/FAIL most?"""
        stats = self.db.query("""
            SELECT 
                normalized_profile->>'sector' as sector,
                verdict,
                COUNT(*) as count,
                AVG(risk_score) as avg_risk
            FROM case_analyses
            GROUP BY sector, verdict
            ORDER BY sector, verdict
        """)
        
        return stats
```

---

## Data Sources Setup

### YCombinator Directory
```bash
# Option 1: Use YC API (if available)
curl https://api.ycombinator.com/companies

# Option 2: Scrape YC directory
# Extract from https://www.ycombinator.com/directory/companies
```

### Crunchbase
```python
# Using Crunchbase API
class CrunchbaseSource:
    def __init__(self, api_key):
        self.api_key = api_key
        self.endpoint = "https://api.crunchbase.com/v4/entities/organizations"
    
    def search(self, filters):
        """Search for companies matching criteria"""
        # Query Crunchbase API
        # Parse funding rounds, founders, etc.
```

### TechCrunch
```python
# Parse TechCrunch RSS and articles
import feedparser

class TechCrunchSource:
    def fetch_recent_funding(self):
        """Get recent funding announcements"""
        feed = feedparser.parse("https://techcrunch.com/feed")
        # Parse articles for company data
```

### SEC EDGAR
```python
# Query SEC EDGAR for public company data
from sec_api import QueryApi

class SECSource:
    def __init__(self, api_key):
        self.queryApi = QueryApi(api_key=api_key)
    
    def get_recent_ipo_filings(self):
        """Get recent S-1 filings (IPO companies)"""
        filings = self.queryApi.get_filings(...)
        # Extract company info
```

---

## Testing Strategy

### Unit Tests
```python
# File: tests/test_case_ingestion.py

def test_yc_ingestion():
    """Test YC data ingestion"""
    ingestion = CaseIngestion()
    cases = ingestion.ingest_yc()
    
    assert len(cases) > 0
    assert all("name" in c for c in cases)

def test_profile_normalization():
    """Test profile format consistency"""
    raw_data = {"company": "Acme", "series": "A"}
    normalized = CaseIngestion().normalize_profile(raw_data)
    
    assert "name" in normalized
    assert "stage" in normalized

def test_batch_analysis():
    """Test parallel analysis"""
    processor = BatchProcessor(max_workers=3)
    results = processor.process_cases([1, 2, 3])
    
    assert len(results) == 3
    assert all("verdict" in r for r in results)
```

### Integration Tests
```python
# File: tests/test_case_pipeline.py

def test_end_to_end_pipeline():
    """Test full ingestion -> analysis -> storage pipeline"""
    # 1. Ingest test data
    ingestion = CaseIngestion()
    cases = ingestion.ingest_test_dataset()
    
    # 2. Store in database
    db = SupabaseConnection()
    case_ids = [db.save_case(c) for c in cases]
    
    # 3. Run analysis
    analyzer = CaseAnalyzer()
    results = analyzer.analyze_batch(case_ids)
    
    # 4. Verify results stored
    for cid in case_ids:
        analysis = db.get_analysis(cid)
        assert analysis is not None
        assert "verdict" in analysis
```

---

## Success Criteria

### ✅ Phase 1: Ingestion
- [ ] Successfully ingest from at least 2 sources
- [ ] Normalize all data to standard profile format
- [ ] Store 20+ startup cases in PostgreSQL
- [ ] Handle missing/incomplete data gracefully

### ✅ Phase 2: Analysis
- [ ] Run Challenge Mode on all cases without errors
- [ ] Extract verdict, risk score, issues for each case
- [ ] Store complete analyses in database
- [ ] Performance: < 5 seconds per case analysis

### ✅ Phase 3: Blog
- [ ] Create blog post template
- [ ] Generate blog pages for each case
- [ ] Implement case comparison feature
- [ ] Add "similar cases" discovery

### ✅ Phase 4: Launch
- [ ] Blog discoverable from dashboard
- [ ] Comparison stats visible
- [ ] Can filter by sector, verdict, risk
- [ ] Load times < 2 seconds

---

## Files to Create

```
src/ai_engine/
├── case_ingestion.py       # Data ingestion from multiple sources
├── case_analyzer.py        # Run Challenge Mode on cases
├── batch_processor.py      # Parallel analysis with rate limiting
├── blog_generator.py       # Create blog posts from analyses
└── comparisons.py          # Find similar cases, generate comparisons

tests/
├── test_case_ingestion.py  # Ingestion tests
├── test_case_analyzer.py   # Analysis tests
└── test_pipeline.py        # End-to-end tests

src/app/blog/
├── page.tsx               # Blog listing
└── [slug]/page.tsx        # Individual case study

database/
└── sprint_2_migration.sql # Blog posts, case metadata tables
```

---

## Implementation Checklist

- [ ] Create case_ingestion.py with YC + Crunchbase sources
- [ ] Create PostgreSQL migrations for cases & analyses tables
- [ ] Implement CaseAnalyzer with parallel processing
- [ ] Create batch_processor.py with rate limiting
- [ ] Create blog_generator.py
- [ ] Create Next.js blog pages
- [ ] Create comparison engine
- [ ] Write comprehensive tests
- [ ] Populate with 20+ test cases
- [ ] Verify all analyses complete successfully
- [ ] Generate blog posts from analyses
- [ ] Test blog discovery and filtering
- [ ] Document data sources and API keys needed

---

## Timeline

**Day 1**: Data ingestion + database setup  
**Day 2**: Analysis pipeline + parallel processing  
**Day 3**: Blog system + comparisons + testing  
**Day 4**: Deploy + quality assurance + documentation  

**Estimated**: 3-4 full days

---

## Key Dependencies

- Crunchbase API access (paid or free tier)
- SEC EDGAR API access (free)
- TechCrunch RSS feed (free)
- YC directory data (web scraping or API)
- Claude API (already configured)
- PostgreSQL (Supabase)

---

## Success Metrics

- ✅ 20+ real startup cases analyzed
- ✅ 100% analysis completion rate
- ✅ Average analysis time < 5 seconds per case
- ✅ Blog posts generated and published
- ✅ Case comparison working
- ✅ Discovery/filtering functional
- ✅ Load times < 2 seconds
- ✅ Tests passing (90%+ coverage)

---

**Status**: Ready to start  
**Complexity**: High (multi-source data ingestion)  
**Risk**: API rate limits, data quality  
**Mitigation**: Batch processing, error handling, fallback data sources

Ready to begin? Let's go! 🚀
