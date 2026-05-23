-- MIZHAR Platform - Knowledge Base & RAG Infrastructure
-- Created: May 23, 2026
-- Purpose: Vector embeddings, semantic search, knowledge chunks

-- =============================================================================
-- 1. ENABLE PGVECTOR EXTENSION
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS vector;

-- =============================================================================
-- 2. KNOWLEDGE SOURCES TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS knowledge_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Source metadata
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    category TEXT, -- "strategic", "startup", "research", "market", "domain"
    tier INT DEFAULT 3, -- 1=highest priority, 5=lowest

    -- Source details
    url TEXT,
    author TEXT,
    published_date DATE,
    source_type TEXT, -- "case_study", "article", "research", "guide", etc

    -- Ingestion tracking
    total_chunks INT DEFAULT 0,
    ingested_chunks INT DEFAULT 0,
    last_ingested TIMESTAMP WITH TIME ZONE,
    next_sync TIMESTAMP WITH TIME ZONE,

    -- Quality metrics
    is_active BOOLEAN DEFAULT TRUE,
    quality_score DECIMAL(3, 2) DEFAULT 0.80, -- 0-1.0
    citation_count INT DEFAULT 0,

    -- Cost tracking
    tokens_used INT DEFAULT 0,
    embedding_cost DECIMAL(10, 4) DEFAULT 0,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_sources_active ON knowledge_sources(is_active);
CREATE INDEX idx_sources_category ON knowledge_sources(category);
CREATE INDEX idx_sources_tier ON knowledge_sources(tier);
CREATE INDEX idx_sources_last_ingested ON knowledge_sources(last_ingested DESC);

-- =============================================================================
-- 3. KNOWLEDGE CHUNKS TABLE (CORE)
-- =============================================================================

CREATE TABLE IF NOT EXISTS knowledge_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Content
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    content_length INT,

    -- Embeddings (OpenAI ada-002: 1536 dimensions)
    embedding vector(1536),
    embedding_model TEXT DEFAULT 'text-embedding-ada-002',

    -- Metadata
    source_id UUID REFERENCES knowledge_sources(id) ON DELETE CASCADE,
    source TEXT NOT NULL,
    source_url TEXT,
    source_date DATE,
    category TEXT,
    tags TEXT[] DEFAULT '{}',

    -- Relationships
    parent_chunk_id UUID REFERENCES knowledge_chunks(id) ON DELETE SET NULL,
    related_chunk_ids UUID[] DEFAULT '{}',

    -- Quality & Tracking
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    quality_score DECIMAL(3, 2) DEFAULT 0.80,
    usage_count INT DEFAULT 0,
    citations INT DEFAULT 0,

    -- Search metrics
    search_relevance DECIMAL(3, 2) DEFAULT 0.80,
    last_searched TIMESTAMP WITH TIME ZONE,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    indexed_at TIMESTAMP WITH TIME ZONE,

    -- Constraints
    CONSTRAINT content_not_empty CHECK (LENGTH(content) > 0),
    CONSTRAINT valid_score CHECK (quality_score >= 0 AND quality_score <= 1)
);

-- Create IVFFlat index for vector similarity search
CREATE INDEX ON knowledge_chunks USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Full-text search index
CREATE INDEX knowledge_fts ON knowledge_chunks USING GIN (
    to_tsvector('english', title || ' ' || content)
);

-- Standard indexes
CREATE INDEX idx_chunks_source ON knowledge_chunks(source);
CREATE INDEX idx_chunks_category ON knowledge_chunks(category);
CREATE INDEX idx_chunks_active ON knowledge_chunks(is_active);
CREATE INDEX idx_chunks_verified ON knowledge_chunks(is_verified);
CREATE INDEX idx_chunks_tags ON knowledge_chunks USING GIN (tags);
CREATE INDEX idx_chunks_created ON knowledge_chunks(created_at DESC);
CREATE INDEX idx_chunks_usage ON knowledge_chunks(usage_count DESC);

-- =============================================================================
-- 4. SEARCH QUERIES TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS search_queries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID,
    context TEXT,

    query TEXT NOT NULL,
    query_embedding vector(1536),

    matched_chunk_ids UUID[],
    results_count INT,

    execution_time_ms INT,
    relevance_score DECIMAL(3, 2),

    user_feedback_rating INT,
    user_feedback_text TEXT,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    indexed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_queries_user ON search_queries(user_id);
CREATE INDEX idx_queries_context ON search_queries(context);
CREATE INDEX idx_queries_created ON search_queries(created_at DESC);
CREATE INDEX idx_queries_rating ON search_queries(user_feedback_rating);

-- =============================================================================
-- 5. INGESTION LOGS
-- =============================================================================

CREATE TABLE IF NOT EXISTS ingestion_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    source_id UUID REFERENCES knowledge_sources(id) ON DELETE CASCADE,
    source_name TEXT,

    status TEXT,
    chunks_processed INT DEFAULT 0,
    chunks_failed INT DEFAULT 0,
    chunks_created INT DEFAULT 0,

    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    duration_seconds INT,

    tokens_used INT DEFAULT 0,
    api_cost DECIMAL(10, 4) DEFAULT 0,

    error_message TEXT,
    error_details JSONB,

    batch_size INT DEFAULT 100,
    embedding_model TEXT DEFAULT 'text-embedding-ada-002',

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_ingestion_source ON ingestion_logs(source_id);
CREATE INDEX idx_ingestion_status ON ingestion_logs(status);
CREATE INDEX idx_ingestion_created ON ingestion_logs(created_at DESC);

-- =============================================================================
-- 6. RLS POLICIES
-- =============================================================================

ALTER TABLE knowledge_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_queries ENABLE ROW LEVEL SECURITY;

-- Everyone can read active chunks
CREATE POLICY public_read_chunks ON knowledge_chunks
    FOR SELECT USING (is_active = TRUE);

-- Users can only see their own searches
CREATE POLICY user_searches ON search_queries
    FOR SELECT USING (auth.uid() = user_id);

-- =============================================================================
-- 7. FUNCTIONS FOR VECTOR SEARCH
-- =============================================================================

CREATE OR REPLACE FUNCTION search_knowledge_semantic(
    query_embedding vector,
    match_threshold float DEFAULT 0.7,
    match_count int DEFAULT 5
) RETURNS TABLE(
    id uuid,
    title text,
    content text,
    excerpt text,
    source text,
    source_url text,
    category text,
    tags text[],
    similarity float,
    quality_score numeric
) LANGUAGE SQL STABLE AS $$
    SELECT
        kc.id,
        kc.title,
        kc.content,
        kc.excerpt,
        kc.source,
        kc.source_url,
        kc.category,
        kc.tags,
        (1 - (kc.embedding <=> query_embedding)) as similarity,
        kc.quality_score
    FROM knowledge_chunks kc
    WHERE kc.is_active = TRUE
    AND kc.embedding IS NOT NULL
    AND (1 - (kc.embedding <=> query_embedding)) > match_threshold
    ORDER BY kc.embedding <=> query_embedding
    LIMIT match_count;
$$;

-- =============================================================================
-- 8. VERIFICATION
-- =============================================================================

SELECT EXISTS (
    SELECT 1 FROM information_schema.tables WHERE table_name = 'knowledge_chunks'
) as chunks_exists;

SELECT EXISTS (
    SELECT 1 FROM information_schema.tables WHERE table_name = 'knowledge_sources'
) as sources_exists;

