# Phase 0: Knowledge Bank & RAG Infrastructure

**Status**: 🔴 Not Started - Critical Foundation  
**Duration**: 2-4 weeks to complete  
**Complexity**: High - Requires vector embeddings, semantic search, integration  
**Impact**: 🔥 Unlocks all intelligence engines  

---

## Overview

The Knowledge Bank is the intelligent foundation of MIZHAR. It uses Retrieval-Augmented Generation (RAG) to give the AI access to:

- **Strategic Frameworks** (Harvard Business School, McKinsey, BCG, Bain)
- **Academic Research** (MIT Sloan, Stanford GSB, arXiv papers)
- **Startup Intelligence** (YC, Sequoia, a16z, Benchmark case studies)
- **Financial Data** (Crunchbase, PitchBook, SEC filings)
- **Market Intelligence** (Google Trends, FRED, Statista)

This transforms MIZHAR from a template generator to a true AI venture intelligence engine.

---

## Architecture

### 3-Layer System

```
┌─────────────────────────────────────────────────────┐
│  APPLICATION LAYER                                  │
│  ├─ Challenge Mode                                  │
│  ├─ Strategic Rewrite                               │
│  ├─ Simulations & Scenarios                         │
│  ├─ Founder Intelligence                            │
│  └─ Financial Intelligence                          │
└────────────────┬────────────────────────────────────┘
                 │
┌─────────────────────────────────────────────────────┐
│  RAG QUERY ENGINE                                   │
│  ├─ Query understanding & expansion                 │
│  ├─ Semantic search in knowledge base               │
│  ├─ Retrieved context ranking                       │
│  └─ Answer synthesis & verification                 │
└────────────────┬────────────────────────────────────┘
                 │
┌─────────────────────────────────────────────────────┐
│  KNOWLEDGE BANK (pgvector + PostgreSQL)             │
│  ├─ 10,000+ chunks across 50+ sources              │
│  ├─ Vector embeddings (OpenAI ada-002)              │
│  ├─ Metadata (source, date, category, citations)    │
│  ├─ Semantic similarity search                      │
│  └─ Full-text search                                │
└─────────────────────────────────────────────────────┘
```

### Data Sources (50+ Sources)

#### Tier 1: Strategic Frameworks (1,000+ chunks)
- Harvard Business School case studies (500+)
- McKinsey reports & articles (300+)
- BCG insights (200+)
- Bain case studies (150+)
- MIT Sloan research (100+)
- Stanford GSB ventures (80+)

#### Tier 2: Startup Intelligence (3,000+ chunks)
- Y Combinator startup advice (400+)
- Sequoia Capital memo (1)
- a16z founder school (200+)
- Benchmark Ops Team (300+)
- First Round Review articles (200+)
- Greylock essays (100+)
- Bessemer venture library (500+)
- Index Ventures reports (300+)

#### Tier 3: Academic Research (2,000+ chunks)
- arXiv papers (500+)
- SSRN research (300+)
- Google Books summaries (400+)
- Stanford/Harvard theses (300+)
- MIT research papers (300+)
- Berkeley startup research (200+)

#### Tier 4: Market Intelligence (2,000+ chunks)
- SEC EDGAR filings (500+)
- Crunchbase startup data (600+)
- PitchBook insights (400+)
- Google Trends patterns (300+)
- FRED economic data (200+)

#### Tier 5: Domain-Specific (1,000+ chunks)
- SaaS benchmarks (300+)
- Marketplace playbooks (200+)
- Fintech regulations (200+)
- Climate tech strategies (150+)
- AI/ML best practices (150+)

---

## Technical Stack

### Database & Vector Storage

**PostgreSQL + pgvector**
- Vector similarity search
- Hybrid search (semantic + keyword)
- CRUD operations on knowledge chunks
- 10,000+ chunk capacity
- < 100ms query latency

### Embeddings

**OpenAI Embeddings (ada-002)**
- Dimensions: 1,536
- Cost: $0.0001 per 1K tokens
- 10,000 chunks ≈ $1-2 for initial embedding
- Real-time embedding for user queries

### Search Strategy

**Hybrid Approach**:
1. Vector similarity search (semantic)
2. Full-text search (keywords)
3. Metadata filters (source, category, date)
4. Ranking & deduplication
5. Citation tracking

### Integration Points

```
User Query
    ↓
[Query Expansion] - Add synonyms, related terms
    ↓
[Vector Embedding] - OpenAI ada-002
    ↓
[Similarity Search] - pgvector search in Supabase
    ↓
[Full-Text Filter] - Keyword matching
    ↓
[Context Ranking] - Relevance scoring
    ↓
[Prompt Engineering] - Context-aware prompts
    ↓
[Claude API] - Generate answer with context
    ↓
[Citation Tracking] - Mark sources used
    ↓
Response with sources
```

---

## Implementation Plan

### Phase 0a: Database Setup (1-2 days)

**1. Create Knowledge Chunk Table**

```sql
CREATE TABLE knowledge_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Content
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT, -- First 200 chars for preview
    
    -- Embeddings
    embedding vector(1536), -- OpenAI embedding
    
    -- Metadata
    source TEXT NOT NULL, -- "Harvard_HBS", "McKinsey_Article", etc
    source_url TEXT,
    source_date DATE,
    category TEXT, -- "framework", "case_study", "research", etc
    tags TEXT[], -- ["startup", "fundraising", "pitch"]
    
    -- Relationships
    parent_chunk_id UUID REFERENCES knowledge_chunks(id),
    related_chunks UUID[],
    
    -- Tracking
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    quality_score DECIMAL(3,2) -- 0.00 to 1.00
);

-- Create vector similarity index
CREATE INDEX ON knowledge_chunks USING ivfflat (embedding vector_cosine_ops);

-- Create full-text search index
CREATE INDEX knowledge_fts ON knowledge_chunks USING GIN (to_tsvector('english', content));
```

**2. Create Knowledge Source Table**

```sql
CREATE TABLE knowledge_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    category TEXT,
    
    -- Source details
    url TEXT,
    author TEXT,
    published_date DATE,
    
    -- Ingestion tracking
    total_chunks INT DEFAULT 0,
    ingested_chunks INT DEFAULT 0,
    last_ingested TIMESTAMP,
    next_sync TIMESTAMP,
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    priority INT, -- 1=highest, 100=lowest
    
    created_at TIMESTAMP DEFAULT NOW()
);
```

**3. Create Search History (for optimization)**

```sql
CREATE TABLE search_queries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    user_id UUID,
    query TEXT NOT NULL,
    query_embedding vector(1536),
    
    results_count INT,
    execution_time_ms INT,
    
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Phase 0b: Embedding Infrastructure (2-3 days)

**1. Create Embedding Service**

```typescript
// src/lib/embeddings.ts
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function embedText(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: text,
  });

  return response.data[0].embedding;
}

export async function batchEmbed(
  texts: string[]
): Promise<number[][]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: texts,
  });

  return response.data
    .sort((a, b) => a.index - b.index)
    .map(item => item.embedding);
}

// Embed with caching to avoid duplicate requests
const embeddingCache = new Map<string, number[]>();

export async function embedWithCache(text: string): Promise<number[]> {
  const hash = hashText(text);
  if (embeddingCache.has(hash)) {
    return embeddingCache.get(hash)!;
  }

  const embedding = await embedText(text);
  embeddingCache.set(hash, embedding);
  return embedding;
}

function hashText(text: string): string {
  return require('crypto')
    .createHash('sha256')
    .update(text)
    .digest('hex');
}
```

**2. Create Vector Search Service**

```typescript
// src/lib/knowledge-search.ts
import { createClient } from '@supabase/supabase-js';
import { embedText } from './embeddings';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface SearchResult {
  id: string;
  title: string;
  content: string;
  source: string;
  source_url: string;
  similarity: number;
  category: string;
  tags: string[];
}

export async function searchKnowledge(
  query: string,
  limit: number = 5,
  minSimilarity: number = 0.7
): Promise<SearchResult[]> {
  // Embed the query
  const queryEmbedding = await embedText(query);

  // Vector similarity search
  const { data: vectorResults, error: vectorError } = await supabase.rpc(
    'search_knowledge_vectors',
    {
      query_embedding: queryEmbedding,
      match_threshold: minSimilarity,
      match_count: limit,
    }
  );

  if (vectorError) {
    console.error('Vector search error:', vectorError);
    return [];
  }

  // Full-text search for additional context
  const { data: textResults } = await supabase
    .from('knowledge_chunks')
    .select('*')
    .or(
      query
        .split(' ')
        .map(word => `content.ilike.%${word}%`)
        .join(',')
    )
    .limit(3);

  // Combine and deduplicate results
  const allResults = [...(vectorResults || []), ...(textResults || [])];
  const uniqueResults = Array.from(
    new Map(allResults.map(item => [item.id, item])).values()
  );

  return uniqueResults.slice(0, limit).map(chunk => ({
    id: chunk.id,
    title: chunk.title,
    content: chunk.content,
    source: chunk.source,
    source_url: chunk.source_url,
    similarity: chunk.similarity || 0,
    category: chunk.category,
    tags: chunk.tags || [],
  }));
}

// Create vector search function in Supabase
export const CREATE_SEARCH_FUNCTION = `
CREATE OR REPLACE FUNCTION search_knowledge_vectors(
  query_embedding vector,
  match_threshold float,
  match_count int
) RETURNS TABLE(
  id uuid,
  title text,
  content text,
  source text,
  source_url text,
  similarity float,
  category text,
  tags text[]
) LANGUAGE SQL STABLE AS $$
  SELECT
    id,
    title,
    content,
    source,
    source_url,
    (1 - (embedding <=> query_embedding)) as similarity,
    category,
    tags
  FROM knowledge_chunks
  WHERE is_active = true
  AND (1 - (embedding <=> query_embedding)) > match_threshold
  ORDER BY embedding <=> query_embedding
  LIMIT match_count;
$$;
`;
```

### Phase 0c: Knowledge Ingestion (3-5 days)

**1. HBS Case Studies Ingestion**

```typescript
// scripts/ingest-hbs.ts
import { ingestFromURL } from '@/lib/knowledge-ingest';

const HBS_CASES = [
  'https://www.hbs.edu/case-studies/a-case-study-database/', // 500+ cases
  // Individual case URLs...
];

async function ingestHBSCases() {
  for (const url of HBS_CASES) {
    await ingestFromURL(url, {
      source: 'Harvard_HBS',
      category: 'case_study',
      tags: ['startup', 'strategy', 'business'],
    });
  }
}
```

**2. McKinsey Articles**

```typescript
// Ingest from McKinsey website
const MCKINSEY_URLS = [
  'https://www.mckinsey.com/articles/', // Article archive
];
```

**3. Research Papers (arXiv)**

```typescript
// Ingest from arXiv API
import axios from 'axios';

async function ingestArXiv() {
  const response = await axios.get('http://export.arxiv.org/api/query?', {
    params: {
      search_query: 'cat:cs.AI OR cat:econ.GN',
      start: 0,
      max_results: 500,
    },
  });

  // Parse and chunk papers
  // Create embeddings
  // Store in database
}
```

**4. Startup Advice & Memos**

```typescript
// Manual ingestion of key documents:
// - Sequoia's Startup Guide
// - a16z Founder's Guide
// - YC Startup School notes
// - Benchmark Ops docs
```

**5. Ingestion Pipeline**

```typescript
// src/lib/knowledge-ingest.ts
import { createClient } from '@supabase/supabase-js';
import { embedText } from './embeddings';

interface IngestOptions {
  source: string;
  category: string;
  tags: string[];
  batchSize?: number;
}

export async function ingestKnowledgeChunks(
  chunks: string[],
  options: IngestOptions
) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  console.log(`Ingesting ${chunks.length} chunks from ${options.source}...`);

  // Embed all chunks
  const embeddings = await batchEmbed(chunks);

  // Prepare records
  const records = chunks.map((content, i) => ({
    title: `${options.source} - Chunk ${i + 1}`,
    content,
    excerpt: content.substring(0, 200),
    embedding: embeddings[i],
    source: options.source,
    category: options.category,
    tags: options.tags,
    is_active: true,
    quality_score: 0.95, // Adjust based on source
  }));

  // Batch insert
  const batchSize = options.batchSize || 100;
  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize);

    const { error } = await supabase
      .from('knowledge_chunks')
      .insert(batch);

    if (error) {
      console.error(`Error inserting batch ${i / batchSize}:`, error);
    } else {
      console.log(
        `✓ Inserted ${batch.length} chunks (${i + batch.length}/${records.length})`
      );
    }
  }

  // Update source stats
  await supabase
    .from('knowledge_sources')
    .update({
      total_chunks: chunks.length,
      ingested_chunks: chunks.length,
      last_ingested: new Date().toISOString(),
    })
    .eq('name', options.source);
}
```

### Phase 0d: RAG Integration (2-3 days)

**1. RAG Prompt Engineering**

```typescript
// src/lib/rag-engine.ts
import { searchKnowledge } from './knowledge-search';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

export async function ragQuery(
  userQuery: string,
  context: 'challenge_mode' | 'strategic_rewrite' | 'general'
): Promise<{
  answer: string;
  sources: Array<{ title: string; url: string }>;
  confidence: number;
}> {
  // Search for relevant knowledge
  const results = await searchKnowledge(userQuery, 5, 0.7);

  // Build context from results
  const contextText = results
    .map(
      (r, i) =>
        `[Source ${i + 1}: ${r.source}]\n${r.content}\nURL: ${r.source_url}`
    )
    .join('\n\n');

  // Build system prompt based on context
  const systemPrompt = buildSystemPrompt(context);

  // Query Claude with context
  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 2000,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: `Using the following knowledge base context, please answer this question:\n\nQuestion: ${userQuery}\n\nContext:\n${contextText}`,
      },
    ],
  });

  const answer =
    response.content[0].type === 'text' ? response.content[0].text : '';

  return {
    answer,
    sources: results.map(r => ({
      title: r.title,
      url: r.source_url,
    })),
    confidence: Math.max(...results.map(r => r.similarity)),
  };
}

function buildSystemPrompt(
  context: 'challenge_mode' | 'strategic_rewrite' | 'general'
): string {
  switch (context) {
    case 'challenge_mode':
      return `You are a venture capital investor reviewing a startup pitch. 
      Use the provided knowledge base to give brutally honest feedback, identify risks, 
      and suggest improvements. Reference case studies and frameworks from the knowledge base.`;

    case 'strategic_rewrite':
      return `You are a startup strategist helping founders refine their approach. 
      Use the knowledge base to provide strategic recommendations grounded in successful examples 
      and proven frameworks. Cite specific cases and principles.`;

    case 'general':
    default:
      return `You are a venture intelligence AI assistant. Use the provided knowledge base 
      to answer questions about startups, venture capital, strategy, and market trends. 
      Always cite your sources from the knowledge base.`;
  }
}
```

**2. Chat Interface with RAG**

```typescript
// src/app/api/chat/route.ts
import { ragQuery } from '@/lib/rag-engine';

export async function POST(request: Request) {
  const { message, context } = await request.json();

  const result = await ragQuery(message, context);

  return Response.json({
    message: result.answer,
    sources: result.sources,
    confidence: result.confidence,
  });
}
```

### Phase 0e: Quality & Optimization (1-2 days)

**1. Knowledge Quality Scoring**

```typescript
// Score chunks based on:
// - Source quality (HBS > arXiv > web)
// - Recency (recent > old)
// - Relevance (based on usage)
// - Citations (more cited = higher)

export async function scoreChunk(chunkId: string): Promise<number> {
  const chunk = await getChunk(chunkId);

  let score = 0.5; // Base score

  // Source quality (0-0.3)
  const sourceWeights: Record<string, number> = {
    Harvard_HBS: 0.3,
    McKinsey: 0.25,
    BCG: 0.25,
    Bain: 0.2,
    Sequoia: 0.3,
    arXiv: 0.15,
    web: 0.1,
  };
  score += sourceWeights[chunk.source] || 0.1;

  // Recency (0-0.2)
  const ageMonths = getMonthsSince(chunk.source_date);
  if (ageMonths < 6) score += 0.2;
  else if (ageMonths < 12) score += 0.15;
  else if (ageMonths < 24) score += 0.1;

  // Usage (0-0.2)
  const usageCount = await getChunkUsageCount(chunkId);
  score += Math.min(0.2, usageCount * 0.05);

  return Math.min(1.0, score);
}
```

**2. Search Quality Metrics**

```typescript
// Track:
// - Query success rate
// - Result relevance (user feedback)
// - Search latency
// - Index size and health

export async function getSearchMetrics() {
  return {
    avg_query_time_ms: 45,
    total_queries: 15000,
    success_rate: 0.94,
    avg_results_per_query: 4.2,
    index_size_chunks: 10450,
    index_health: 'excellent',
  };
}
```

---

## Data Size & Cost Estimates

### Knowledge Base Growth

```
Tier 1 (Strategic): 1,000 chunks × 2KB = 2MB
Tier 2 (Startup):   3,000 chunks × 2KB = 6MB
Tier 3 (Research):  2,000 chunks × 2KB = 4MB
Tier 4 (Market):    2,000 chunks × 2KB = 4MB
Tier 5 (Domain):    1,000 chunks × 2KB = 2MB
───────────────────────────────────
TOTAL:             10,000 chunks = 18MB
+ Embeddings:      10,000 × 1,536 × 4 bytes = 61MB
───────────────────────────────────
Total DB Size: ~100MB (Supabase free tier: 500MB)
```

### Operational Costs

**Monthly Costs** (estimated):
- OpenAI Embeddings: $2-5/month
- OpenAI Chat (Claude calls): $10-50/month
- Supabase storage: Free (< 500MB)
- Supabase compute: Free tier sufficient

**Total**: ~$15-60/month at scale

---

## Integration with Intelligence Engines

### Challenge Mode (Phase 1 Feature)

```typescript
// Uses RAG to enhance VC critique
async function challengeMode(pitchData: PitchData) {
  // Search knowledge for:
  // 1. Similar failed startups
  // 2. Industry benchmarks
  // 3. Founder profiles
  // 4. Market risks

  const similarFailures = await searchKnowledge(
    `startups that failed in ${pitchData.industry}`
  );
  const benchmarks = await searchKnowledge(
    `${pitchData.industry} unit economics`
  );

  // Enhance critique with real examples
  return generateChallenge({
    pitch: pitchData,
    similarCases: similarFailures,
    benchmarks: benchmarks,
  });
}
```

### Strategic Rewrite (Phase 2 Feature)

```typescript
// Uses frameworks from knowledge base
async function strategicRewrite(businessPlan: BusinessPlan) {
  // Search for:
  // 1. Best-practice business models
  // 2. Go-to-market strategies
  // 3. Success case studies
  // 4. Strategic frameworks

  const bestPractices = await searchKnowledge(
    `successful ${businessPlan.model_type} business models`
  );

  return rewritePlan({
    plan: businessPlan,
    examples: bestPractices,
  });
}
```

---

## Timeline

```
Week 1: Database setup + embedding infrastructure
├─ Create tables (day 1-2)
├─ Build embedding service (day 2-3)
├─ Vector search implementation (day 3-4)
└─ Testing & optimization (day 4-5)

Week 2-3: Knowledge ingestion
├─ HBS cases (300+ chunks, 3 days)
├─ McKinsey articles (200+ chunks, 2 days)
├─ arXiv papers (500+ chunks, 3 days)
├─ YC/startup advice (200+ chunks, 2 days)
└─ Market data (500+ chunks, 3 days)

Week 4: Integration & optimization
├─ RAG engine (day 1-2)
├─ Chat interface (day 2-3)
├─ Quality metrics (day 3-4)
└─ Load testing (day 4-5)
```

---

## Success Criteria

✅ **Phase 0 Complete When:**
- [ ] 10,000+ knowledge chunks ingested
- [ ] All vector embeddings generated
- [ ] Vector similarity search < 100ms latency
- [ ] RAG integration with Claude working
- [ ] Sources tracked and cited correctly
- [ ] Search quality metrics > 90% accuracy
- [ ] Zero data loss/corruption

---

## Resource Requirements

**Knowledge Curation** (1 person):
- Research & identify 50+ sources
- Extract & chunk documents
- Verify quality & accuracy
- Estimated 2-3 weeks

**Engineering** (1-2 people):
- Database design & optimization
- Embedding pipeline
- Search implementation
- RAG integration
- Estimated 2-3 weeks

**Total**: 4-6 weeks with 1-2 people

---

## Next Steps

1. **Week 1**: Build database + embedding infrastructure
2. **Week 2-3**: Ingest 10,000+ knowledge chunks
3. **Week 4**: Integrate with intelligence engines
4. **Week 5+**: Fine-tune & optimize

---

**Status**: 🔴 Not Started  
**Priority**: 🔥 CRITICAL  
**Impact**: Enables all advanced features
