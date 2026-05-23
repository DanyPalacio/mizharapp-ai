# SPRINT 2 Integration Guide for SPRINT 1

**Purpose**: Quick reference for integrating SPRINT 2 (Case Studies) into the dashboard (SPRINT 1)

**Read Time**: 15 minutes

---

## Quick Start: Use SPRINT 2 Modules

### 1. Backend API Endpoint Example

Create a new API route: `src/app/api/cases/analyze/route.ts`

```typescript
import { CaseAnalyzer, CaseIngestion } from '@/ai_engine';

export async function POST(request: Request) {
  try {
    const { startups } = await request.json();
    
    // Analyze startups
    const analyzer = new CaseAnalyzer();
    const results = await analyzer.analyze_batch(startups);
    
    return Response.json({
      success: true,
      analyzed: results.analyses.length,
      verdicts: analyzer.extract_verdicts(),
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
```

### 2. Frontend Integration Example

Create component: `src/components/case-studies/CaseAnalysisWidget.tsx`

```typescript
'use client';

import { useState } from 'react';
import { CaseAnalyzer } from '@/ai_engine';

export function CaseAnalysisWidget() {
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);

  async function analyzeStartup(startupData) {
    setAnalyzing(true);
    try {
      const response = await fetch('/api/cases/analyze', {
        method: 'POST',
        body: JSON.stringify({ startups: [startupData] }),
      });
      const data = await response.json();
      setResults(data);
    } finally {
      setAnalyzing(false);
    }
  }

  return (
    <div className="case-analysis-widget">
      {/* Your component JSX here */}
    </div>
  );
}
```

### 3. Display Verdicts (React Component)

```typescript
function VerdictBadge({ verdict }: { verdict: string }) {
  const colors = {
    PASS: 'bg-green-100 text-green-800',
    CONDITIONAL: 'bg-yellow-100 text-yellow-800',
    FAIL: 'bg-red-100 text-red-800',
  };

  return (
    <span className={`px-3 py-1 rounded-full ${colors[verdict] || 'bg-gray-100'}`}>
      {verdict}
    </span>
  );
}
```

### 4. Risk Score Visualization

```typescript
function RiskScore({ score }: { score: number }) {
  const percentage = (score / 10) * 100;
  
  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className={`h-2 rounded-full ${
          score <= 3 ? 'bg-green-500' :
          score <= 7 ? 'bg-yellow-500' :
          'bg-red-500'
        }`}
        style={{ width: `${percentage}%` }}
      />
      <p className="text-sm font-semibold">{score}/10</p>
    </div>
  );
}
```

---

## Module API Reference

### CaseIngestion

```python
from ai_engine import CaseIngestion

ingestion = CaseIngestion()

# Ingest from all sources
result = ingestion.ingest_all(
    yc_limit=50,
    cb_limit=50,
    tc_limit=50,
    sec_limit=50
)

# Access ingested data
print(result['total_ingested'])  # int
print(result['by_source'])       # dict
print(result['all_cases'])       # list
```

### CaseAnalyzer

```python
from ai_engine import CaseAnalyzer

analyzer = CaseAnalyzer(
    max_workers=3,           # Parallel threads
    rate_limit_delay=0.5     # Seconds between API calls
)

# Analyze single case
result = analyzer.analyze_single(startup_profile)
# Returns: {startup_name, original_data, challenge_analysis, strategic_alternatives}

# Analyze batch
results = analyzer.analyze_batch(
    startup_cases=[...],
    progress_callback=lambda done, total: print(f"{done}/{total}")
)

# Extract aggregated data
verdicts = analyzer.extract_verdicts()          # {name: verdict}
risk_scores = analyzer.extract_risk_scores()    # {name: score}
critical_issues = analyzer.extract_critical_issues()  # {name: [issues]}

# Generate summary
summary = analyzer.generate_summary_report()
```

### BlogGenerator

```python
from ai_engine import BlogGenerator

generator = BlogGenerator()

# Generate case study post
post = generator.generate_case_post(case_analysis)
# Returns: {slug, front_matter, content, markdown}

# Generate comparison
comparison = generator.generate_comparison(
    cases=[analysis1, analysis2, ...],
    comparison_title="Startup A vs B comparison"
)

# Export all posts
generator.export_posts('/tmp/blog_posts/')

# Get post index
index = generator.generate_index()
# Returns: {total_posts, generated_at, posts: [{slug, title, date, tags}]}
```

### ComparisonEngine

```python
from ai_engine import ComparisonEngine

engine = ComparisonEngine(analyses=[...])

# Find similar cases
similar = engine.find_similar_cases(
    startup_name="Anthropic",
    similarity_threshold=0.5
)
# Returns: [(name, similarity_score), ...]

# Get verdict distribution by sector
verdicts_by_sector = engine.compare_verdicts_by_sector()
# Returns: {sector: {total, verdicts: {PASS/CONDITIONAL/FAIL}}}

# Get verdict distribution by stage
verdicts_by_stage = engine.compare_verdicts_by_stage()
# Returns: {stage: {total, verdicts: {...}}}

# Get recommendations
recommendations = engine.generate_recommendations("CompanyX")
# Returns: {startup, similar_cases, verdict_distribution, recommendation}

# Cluster by risk
clusters = engine.cluster_by_risk_profile()
# Returns: {low_risk: [...], medium_risk: [...], high_risk: [...]}

# Generate sector report
report = engine.generate_sector_report()
# Returns: {timestamp, total_cases, sectors: {...}}
```

---

## Database Integration

### Tables to Use (Already in schema):

**`startup_cases`** - Store ingested data
```sql
CREATE TABLE startup_cases (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  description TEXT,
  data_source VARCHAR(50),
  raw_data JSONB,
  normalized_profile JSONB,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

**`case_analyses`** - Store analysis results
```sql
CREATE TABLE case_analyses (
  id SERIAL PRIMARY KEY,
  case_id INTEGER REFERENCES startup_cases(id),
  challenge_analysis JSONB,
  risk_score INTEGER,
  verdict VARCHAR(50),
  critical_issues TEXT[],
  strategic_alternatives JSONB,
  created_at TIMESTAMP
);
```

**`blog_posts`** - Store generated posts
```sql
CREATE TABLE blog_posts (
  id SERIAL PRIMARY KEY,
  case_id INTEGER REFERENCES startup_cases(id),
  slug VARCHAR(255) UNIQUE,
  title VARCHAR(255),
  content TEXT,
  front_matter JSONB,
  published_at TIMESTAMP,
  created_at TIMESTAMP
);
```

### Example Insert Query

```typescript
// Save analysis to database
const { data, error } = await supabase
  .from('case_analyses')
  .insert([
    {
      case_id: startupCaseId,
      challenge_analysis: analysisResult.challenge_analysis,
      risk_score: extractRiskScore(analysisResult),
      verdict: extractVerdict(analysisResult),
      critical_issues: extractCriticalIssues(analysisResult),
    }
  ]);
```

---

## UI Component Examples

### CaseStudyCard

```typescript
function CaseStudyCard({ 
  case: caseData, 
  analysis 
}: { 
  case: any, 
  analysis: any 
}) {
  const verdict = extractVerdict(analysis);
  const risk = extractRiskScore(analysis);

  return (
    <div className="border rounded-lg p-6 hover:shadow-lg transition">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold">{caseData.name}</h3>
        <VerdictBadge verdict={verdict} />
      </div>

      {/* Description */}
      <p className="text-gray-600 mb-4">{caseData.description}</p>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500">Stage</p>
          <p className="font-semibold">{caseData.stage}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Funding</p>
          <p className="font-semibold">${caseData.total_funding/1e6}M</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Risk Score</p>
          <p className="font-semibold">{risk}/10</p>
        </div>
      </div>

      {/* Risk Visualization */}
      <RiskScore score={risk} />

      {/* CTA */}
      <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded">
        View Full Analysis
      </button>
    </div>
  );
}
```

### CaseAnalysisPage

```typescript
export default function CaseAnalysisPage({ params }: any) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch analysis from database or API
    fetch(`/api/cases/${params.id}`)
      .then(r => r.json())
      .then(data => {
        setAnalysis(data);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) return <LoadingSpinner />;
  if (!analysis) return <NotFound />;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-2">{analysis.name}</h1>
      <VerdictBadge verdict={analysis.verdict} />

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4 my-8">
        <StatCard label="Risk Score" value={`${analysis.risk_score}/10`} />
        <StatCard label="Stage" value={analysis.original_data.stage} />
        <StatCard label="Funding" value={`$${analysis.original_data.total_funding/1e6}M`} />
        <StatCard label="Source" value={analysis.original_data.data_source} />
      </div>

      {/* Analysis */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Challenge Mode Analysis</h2>
        <div className="whitespace-pre-wrap text-gray-700">
          {analysis.challenge_analysis.analysis}
        </div>
      </div>

      {/* Strategic Alternatives */}
      {analysis.strategic_alternatives && (
        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Strategic Alternatives</h2>
          <p className="text-gray-700">
            {analysis.strategic_alternatives.alternative_strategies}
          </p>
        </div>
      )}

      {/* Similar Cases */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Similar Cases</h2>
        <div className="grid grid-cols-2 gap-4">
          {/* Load similar cases from ComparisonEngine */}
        </div>
      </div>
    </div>
  );
}
```

---

## API Endpoints to Create

### POST `/api/cases/ingest`

Trigger case ingestion from all sources

```typescript
// Request
{
  "yc_limit": 50,
  "cb_limit": 50,
  "tc_limit": 50,
  "sec_limit": 50
}

// Response
{
  "success": true,
  "total_ingested": 200,
  "by_source": {
    "yc": 50,
    "crunchbase": 50,
    "techcrunch": 50,
    "sec_edgar": 50
  }
}
```

### POST `/api/cases/analyze`

Analyze ingested cases

```typescript
// Request
{
  "case_ids": [1, 2, 3, ...],
  "include_rewrite": true
}

// Response
{
  "success": true,
  "analyzed": 3,
  "verdicts": {
    "Company A": "PASS",
    "Company B": "CONDITIONAL",
    "Company C": "FAIL"
  }
}
```

### GET `/api/cases/verdicts/sector/:sector`

Get verdict distribution by sector

```typescript
// Response
{
  "sector": "software",
  "total": 42,
  "distribution": {
    "PASS": { "count": 12, "percentage": 28.6 },
    "CONDITIONAL": { "count": 20, "percentage": 47.6 },
    "FAIL": { "count": 10, "percentage": 23.8 }
  }
}
```

### GET `/api/cases/similar/:name`

Find similar cases

```typescript
// Response
{
  "startup": "Anthropic",
  "similar": [
    { "name": "OpenAI", "similarity": 0.92 },
    { "name": "DeepSeek", "similarity": 0.87 },
    { "name": "Mistral", "similarity": 0.81 }
  ]
}
```

---

## Performance Tips

### 1. Batch Analysis Efficiently

```python
# Good: Analyze in batches
analyzer = CaseAnalyzer(max_workers=3)
results = analyzer.analyze_batch(startup_cases)

# Avoid: One at a time (10x slower)
for case in startup_cases:
    analyzer.analyze_single(case)
```

### 2. Cache Results

```typescript
// Use React Query or SWR
const { data: cases } = useSWR('/api/cases', fetcher, {
  revalidateOnFocus: false,
  dedupingInterval: 60000  // 1 minute
});
```

### 3. Lazy Load Blog Posts

```typescript
// Only render visible posts
import { useInView } from 'react-intersection-observer';

export function BlogPostList() {
  return posts.map(post => (
    <LazyPostCard key={post.slug} post={post} />
  ));
}
```

### 4. Pre-compute Comparisons

```python
# Run nightly comparison aggregation
# Store results in cache or database
comparison_report = engine.generate_sector_report()
cache.set('sector_report', comparison_report, ttl=24h)
```

---

## Testing Integration

### Unit Test Example

```typescript
import { CaseAnalyzer } from '@/ai_engine';

describe('CaseAnalyzer', () => {
  it('should analyze startup and return verdict', async () => {
    const analyzer = new CaseAnalyzer();
    const result = await analyzer.analyze_single(mockStartup);

    expect(result).toHaveProperty('challenge_analysis');
    expect(result.verdict).toMatch(/PASS|CONDITIONAL|FAIL/);
  });

  it('should extract verdicts correctly', async () => {
    const analyzer = new CaseAnalyzer();
    // ... setup
    
    const verdicts = analyzer.extract_verdicts();
    expect(Object.keys(verdicts).length).toBeGreaterThan(0);
  });
});
```

### Integration Test

```typescript
test('Full case analysis pipeline', async () => {
  // 1. Ingest
  const ingestion = new CaseIngestion();
  const cases = await ingestion.ingest_all();
  
  // 2. Analyze
  const analyzer = new CaseAnalyzer();
  const analyses = analyzer.analyze_batch(cases.all_cases);
  
  // 3. Generate blog
  const generator = new BlogGenerator();
  analyses.forEach(analysis => {
    generator.generate_case_post(analysis);
  });
  
  // 4. Compare
  const engine = new ComparisonEngine(analyses);
  const report = engine.generate_sector_report();
  
  expect(report.total_cases).toBe(cases.all_cases.length);
});
```

---

## Troubleshooting

### Issue: Analysis takes too long

**Solution**: Increase worker threads
```python
analyzer = CaseAnalyzer(max_workers=5)  # Default is 3
```

### Issue: API rate limiting

**Solution**: Increase delay between calls
```python
analyzer = CaseAnalyzer(rate_limit_delay=1.0)  # Default is 0.5
```

### Issue: Out of memory with large batch

**Solution**: Use BatchProcessor instead
```python
processor = BatchProcessor(analyzer, batch_size=10)
results = processor.process_with_progress(all_cases)
```

### Issue: Blog posts not generating

**Check**: ANTHROPIC_API_KEY is set
```bash
echo $ANTHROPIC_API_KEY
```

---

## Next Steps After Integration

Once SPRINT 1 integration is complete:

1. ✅ Wire SPRINT 2 modules to dashboard
2. ✅ Create case study pages
3. ✅ Add blog system
4. ✅ Implement comparison analytics
5. 📊 Collect user feedback
6. 🚀 Launch publicly
7. 📈 Scale analysis pipeline
8. 🤖 Add more data sources

---

**SPRINT 2 is ready for integration!**

For questions, refer to:
- `SPRINT_2_COMPLETION_STATUS.md` - Full overview
- `SPRINT_2_EXECUTION_PLAN.md` - Detailed architecture
- Source code inline documentation
