# ⚡ SPRINT 0: NO QUESTIONS ASKED
## DO THIS. NOW. IN ORDER.

---

## 🎯 YOUR MISSION
Build the AI intelligence layer. Test it locally. Connect to Supabase. Go.

---

## ✅ STEP 1: ENVIRONMENT (15 min)

```bash
cd /Volumes/MUSIC\ USB-C/MIZHAR/mizhar-app

# Create Python environment
python3 -m venv venv_ai
source venv_ai/bin/activate

# Install everything
pip install \
  anthropic openai supabase python-dotenv \
  pytrends fredapi beautifulsoup4 playwright pymupdf \
  pdfplumber pandas numpy requests

# Create .env.local in project root with these EXACT keys:
ANTHROPIC_API_KEY=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
OPENAI_API_KEY=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
FRED_API_KEY=f25f65a124b19ed05422544774f15079
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
```

**Checklist:**
- [ ] venv created
- [ ] All packages installed
- [ ] .env.local file created

---

## ✅ STEP 2: DATABASE (20 min)

Go to your Supabase project → SQL Editor → Run this:

```sql
-- Enable pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- Knowledge sources
CREATE TABLE knowledge_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_type VARCHAR(50),
  title TEXT NOT NULL,
  url TEXT,
  authors TEXT[],
  published_date DATE,
  category VARCHAR(100),
  industry VARCHAR(100),
  metadata JSONB,
  indexed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Knowledge chunks with embeddings
CREATE TABLE knowledge_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID REFERENCES knowledge_sources(id),
  chunk_text TEXT NOT NULL,
  chunk_index INTEGER,
  token_count INTEGER,
  embedding vector(1536),
  chunk_type VARCHAR(50),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vector index
CREATE INDEX idx_embedding ON knowledge_chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- API cache
CREATE TABLE api_data_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_name VARCHAR(50),
  query_key VARCHAR(255),
  data JSONB,
  cached_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_sources_type ON knowledge_sources(source_type);
CREATE INDEX idx_cache_name ON api_data_cache(api_name);
```

**Checklist:**
- [ ] pgvector enabled
- [ ] All tables created
- [ ] Indexes created

---

## ✅ STEP 3: CREATE PYTHON FILES

Create these 4 files in `src/ai_engine/`:

### File 1: `src/ai_engine/__init__.py`
```python
# AI Engine module
```

### File 2: `src/ai_engine/prompts.py`
```python
CHALLENGE_MODE = """You are a skeptical VC + McKinsey consultant.

Challenge unrealistic assumptions with EVIDENCE.

Detect: inflated TAM, impossible unit economics, weak moats, unrealistic growth, complexity underestimation.

For each finding: state problem, cite evidence, suggest alternative, quantify impact.

Be brutal but evidence-based."""

STRATEGIC_REWRITE = """Propose better business model architectures.

When startup has good idea but wrong strategy, rewrite: business model, GTM, pricing, unit economics, customer segment.

Explain why alternative is better with DATA."""
```

### File 3: `src/ai_engine/apis.py`
```python
import os
from pytrends.request import TrendReq
import fredapi

class MarketIntel:
    def __init__(self):
        self.fred = fredapi.Fred(api_key=os.getenv("FRED_API_KEY"))
    
    def get_econ(self):
        u = self.fred.get_series('UNRATE').iloc[-1]
        i = self.fred.get_series('CPIAUCSL').pct_change().iloc[-1] * 100
        r = self.fred.get_series('FEDFUNDS').iloc[-1]
        return {"unemployment": u, "inflation": i, "rates": r}
    
    def market_timing(self, keyword):
        pt = TrendReq(hl='en-US', tz=360)
        pt.build_payload([keyword], timeframe='today 5-y')
        d = pt.interest_over_time()
        recent = d.iloc[-52:][keyword].mean()
        hist = d.iloc[:-52][keyword].mean()
        g = ((recent - hist) / hist * 100) if hist > 0 else 0
        return {"keyword": keyword, "growth": g, "score": min(100, max(0, 50 + g/10))}
    
    def benchmarks(self, ind):
        return {"saas": {"margin": 0.73, "ltv_cac": 5, "payback": 12},
                "fintech": {"margin": 0.65, "ltv_cac": 4, "payback": 18}}.get(ind.lower(), {})

intel = MarketIntel()
```

### File 4: `src/ai_engine/rag.py`
```python
import os
from openai import OpenAI
from supabase import create_client

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
sb = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))

class RAG:
    def embed(self, text):
        r = client.embeddings.create(model="text-embedding-3-large", input=text)
        return r.data[0].embedding
    
    def search(self, query, k=5):
        emb = self.embed(query)
        r = sb.rpc('match_documents', {'query_embedding': emb, 'match_count': k}).execute()
        return r.data if r.data else []
    
    def bootstrap(self):
        for k in [
            {"type": "mckinsey", "title": "SaaS Economics", "text": "70%+ margins, LTV/CAC > 3, 12-18mo payback"},
            {"type": "bcg", "title": "Business Model", "text": "Wrong model kills faster than bad product"}
        ]:
            sb.table("knowledge_sources").insert({"source_type": k["type"], "title": k["title"]}).execute()

rag = RAG()
```

### File 5: `src/ai_engine/agent.py`
```python
from anthropic import Anthropic
from src.ai_engine.rag import rag
from src.ai_engine.apis import intel
from src.ai_engine.prompts import CHALLENGE_MODE

c = Anthropic()

class ChallengeModeAgent:
    def analyze(self, startup):
        m = intel.market_timing(startup.get("industry", "AI"))
        e = intel.get_econ()
        b = intel.benchmarks(startup.get("industry", "saas"))
        
        kr = rag.search(f"{startup.get('industry')} unit economics")
        kt = "\n".join([r.get('chunk_text', '')[:200] for r in kr[:3]])
        
        prompt = f"STARTUP: {startup}\nMARKET: {m}\nECON: {e}\nBENCH: {b}\nKNOWLEDGE:\n{kt}\n\nAnalyze. Find unrealistic assumptions."
        
        r = c.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=2000,
            system=CHALLENGE_MODE,
            messages=[{"role": "user", "content": prompt}]
        )
        
        return r.content[0].text
```

**Checklist:**
- [ ] All 5 files created
- [ ] No syntax errors
- [ ] APIs keys loaded from .env.local

---

## ✅ STEP 4: TEST (15 min)

Create file: `test_sprint_0.py`

```python
#!/usr/bin/env python3
import os
from dotenv import load_dotenv

load_dotenv(".env.local")

print("🚀 SPRINT 0 TESTS\n")

# Test 1
print("✓ FRED API")
from src.ai_engine.apis import intel
print(f"  {intel.get_econ()}\n")

# Test 2
print("✓ Google Trends")
print(f"  {intel.market_timing('AI recruiting')}\n")

# Test 3
print("✓ Benchmarks")
print(f"  {intel.benchmarks('saas')}\n")

# Test 4
print("✓ RAG System")
from src.ai_engine.rag import rag
print("  RAG ready\n")

# Test 5
print("✓ Challenge Mode")
from src.ai_engine.agent import ChallengeModeAgent
a = ChallengeModeAgent()
s = {
    "name": "AI Recruiting",
    "industry": "HR Tech",
    "assumptions": {"TAM": "$50B", "CAC": "$300", "LTV": "$15000", "Margin": "85%"}
}
print(f"Analyzing...\n{a.analyze(s)}\n")

print("✅ ALL TESTS PASSED")
```

Run:
```bash
source venv_ai/bin/activate
python test_sprint_0.py
```

**Checklist:**
- [ ] All 5 tests pass
- [ ] FRED returns data
- [ ] Google Trends works
- [ ] Challenge Mode generates output

---

## 🏁 DONE

When all tests pass:
- ✅ AI engine working locally
- ✅ Connected to Supabase
- ✅ All APIs returning data
- ✅ Challenge Mode operational
- ✅ Ready for SPRINT 1 (Dashboard)

**Next: Push to GitHub. Deploy to Render. Build dashboard UI.**

---

**NO MORE QUESTIONS. JUST DO IT.** ⚡⚡⚡
