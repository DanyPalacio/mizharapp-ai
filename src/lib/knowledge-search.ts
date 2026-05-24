/**
 * MIZHAR - Knowledge Base Search Service
 * Semantic search using vector embeddings + hybrid search
 */

import { createClient } from '@supabase/supabase-js';
import { embedText } from './embeddings';

const supabase = createClient(
  (process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'),
  (process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key')
);

export interface SearchResult {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  source: string;
  source_url: string;
  category: string;
  tags: string[];
  similarity: number;
  quality_score: number;
}

/**
 * Search knowledge base by semantic similarity
 * Uses vector embeddings for semantic search
 */
export async function searchKnowledgeSemantic(
  query: string,
  limit: number = 5,
  minSimilarity: number = 0.7
): Promise<SearchResult[]> {
  try {
    console.log(`Searching knowledge base: "${query}"`);

    // Embed the query
    const queryEmbedding = await embedText(query);

    // Call Supabase RPC function for vector search
    const { data: results, error } = await supabase.rpc(
      'search_knowledge_semantic',
      {
        query_embedding: queryEmbedding,
        match_threshold: minSimilarity,
        match_count: limit,
      }
    );

    if (error) {
      console.error('Vector search error:', error);
      return [];
    }

    console.log(`✓ Found ${results?.length || 0} semantic results`);
    return (results || []) as SearchResult[];
  } catch (error) {
    console.error('Error in semantic search:', error);
    return [];
  }
}

/**
 * Search using full-text search (keywords)
 */
export async function searchKnowledgeFullText(
  query: string,
  limit: number = 5
): Promise<SearchResult[]> {
  try {
    const words = query
      .split(/\s+/)
      .filter((w) => w.length > 2)
      .join(' & ');

    const { data: results, error } = await supabase
      .from('knowledge_chunks')
      .select('*')
      .textSearch(
        'fts',
        `'${words}'`
      )
      .eq('is_active', true)
      .limit(limit);

    if (error) {
      console.error('Full-text search error:', error);
      return [];
    }

    console.log(`✓ Found ${results?.length || 0} full-text results`);
    return (results || []) as SearchResult[];
  } catch (error) {
    console.error('Error in full-text search:', error);
    return [];
  }
}

/**
 * Hybrid search combining semantic + keyword
 * Best overall results
 */
export async function searchKnowledgeHybrid(
  query: string,
  limit: number = 5,
  minSimilarity: number = 0.6
): Promise<SearchResult[]> {
  try {
    console.log(`Hybrid search: "${query}"`);

    // Run both searches in parallel
    const [semanticResults, keywordResults] = await Promise.all([
      searchKnowledgeSemantic(query, limit * 2, minSimilarity),
      searchKnowledgeFullText(query, limit * 2),
    ]);

    // Combine and deduplicate
    const combined = new Map<string, SearchResult>();

    // Add semantic results (higher weight)
    semanticResults.forEach((r) => {
      combined.set(r.id, {
        ...r,
        similarity: r.similarity * 0.6, // 60% weight to semantic
      });
    });

    // Add keyword results (lower weight, only if not already present)
    keywordResults.forEach((r) => {
      if (!combined.has(r.id)) {
        combined.set(r.id, {
          ...r,
          similarity: r.similarity * 0.4, // 40% weight to keyword
        });
      }
    });

    // Convert to array and sort by combined score
    const results = Array.from(combined.values())
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);

    console.log(`✓ Hybrid search returned ${results.length} results`);
    return results;
  } catch (error) {
    console.error('Error in hybrid search:', error);
    return [];
  }
}

/**
 * Search by category
 */
export async function searchKnowledgeByCategory(
  category: string,
  limit: number = 10
): Promise<SearchResult[]> {
  try {
    const { data: results, error } = await supabase
      .from('knowledge_chunks')
      .select('*')
      .eq('category', category)
      .eq('is_active', true)
      .order('usage_count', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Category search error:', error);
      return [];
    }

    return (results || []) as SearchResult[];
  } catch (error) {
    console.error('Error searching by category:', error);
    return [];
  }
}

/**
 * Search by tags
 */
export async function searchKnowledgeByTags(
  tags: string[],
  limit: number = 10
): Promise<SearchResult[]> {
  try {
    const { data: results, error } = await supabase
      .from('knowledge_chunks')
      .select('*')
      .containedBy('tags', tags)
      .eq('is_active', true)
      .order('quality_score', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Tag search error:', error);
      return [];
    }

    return (results || []) as SearchResult[];
  } catch (error) {
    console.error('Error searching by tags:', error);
    return [];
  }
}

/**
 * Get trending/popular chunks
 */
export async function getTrendingKnowledge(
  limit: number = 10
): Promise<SearchResult[]> {
  try {
    const { data: results, error } = await supabase
      .from('knowledge_chunks')
      .select('*')
      .eq('is_active', true)
      .eq('is_verified', true)
      .order('usage_count', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Trending search error:', error);
      return [];
    }

    return (results || []) as SearchResult[];
  } catch (error) {
    console.error('Error getting trending knowledge:', error);
    return [];
  }
}

/**
 * Record a search query for analytics
 */
export async function recordSearchQuery(
  userId: string | undefined,
  query: string,
  queryEmbedding: number[],
  context: string,
  resultsCount: number,
  executionTimeMs: number,
  relevanceScore: number
): Promise<void> {
  try {
    const { error } = await supabase.from('search_queries').insert({
      user_id: userId,
      query,
      query_embedding: queryEmbedding,
      context,
      results_count: resultsCount,
      execution_time_ms: executionTimeMs,
      relevance_score: relevanceScore,
    });

    if (error) {
      console.warn('Error recording search query:', error);
    }
  } catch (error) {
    console.warn('Error in recordSearchQuery:', error);
  }
}

/**
 * Increment chunk usage count
 */
export async function incrementChunkUsage(chunkId: string): Promise<void> {
  try {
    const { error } = await supabase.rpc('increment_chunk_usage', {
      chunk_id: chunkId,
    });

    if (error) {
      console.warn('Error incrementing chunk usage:', error);
    }
  } catch (error) {
    console.warn('Error in incrementChunkUsage:', error);
  }
}
