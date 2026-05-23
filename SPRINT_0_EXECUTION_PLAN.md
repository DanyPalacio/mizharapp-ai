# 🚀 SPRINT 0 EXECUTION PLAN
## Build AI Intelligence Layer (Local Testing)

**Status:** READY TO START
**Timeline:** 5 days
**Objective:** Complete AI foundation ready for testing

## IMMEDIATE SETUP (30 min)

```bash
cd /Volumes/MUSIC\ USB-C/MIZHAR/mizhar-app

# Create venv
python3 -m venv venv_ai
source venv_ai/bin/activate

# Install dependencies
pip install anthropic openai supabase python-dotenv
pip install pytrends fredapi beautifulsoup4 pymupdf pandas numpy

# Create .env.local with your API keys
ANTHROPIC_API_KEY=sk-ant-api03-...
OPENAI_API_KEY=sk-proj-...
FRED_API_KEY=f25f65a124b19ed05422544774f15079
SUPABASE_URL=your-url
SUPABASE_KEY=your-key
```

## TASKS

### Task 1: Vector DB Setup
Run in Supabase SQL Editor:
- CREATE EXTENSION vector
- Create knowledge_sources table
- Create knowledge_chunks table with vector(1536)
- Create vector index

### Task 2-6: Python Implementation
Create files:
- src/ai_engine/prompts.py (System prompts)
- src/ai_engine/apis.py (FRED, Google Trends)
- src/ai_engine/rag.py (Vector search)
- src/ai_engine/agent.py (Challenge Mode)

### Task 7: Testing
Create test_sprint_0.py
Run: python test_sprint_0.py

## Expected Results
✅ FRED API data
✅ Google Trends
✅ Challenge Mode analysis
✅ All systems go

**Next: SPRINT 1 (Dashboard UI)**
