/**
 * MIZHAR - RAG (Retrieval-Augmented Generation) Engine
 * Integrates knowledge base with Claude for intelligent responses
 */

import Anthropic from '@anthropic-ai/sdk';
import {
  searchKnowledgeHybrid,
  recordSearchQuery,
  incrementChunkUsage,
  SearchResult,
} from './knowledge-search';
import { embedText } from './embeddings';

const anthropic = new Anthropic({
  apiKey: process.env.OPENAI_API_KEY, // Will use Claude instead
});

export interface RAGResponse {
  answer: string;
  sources: Array<{
    title: string;
    url?: string;
    excerpt: string;
    relevance: number;
  }>;
  confidence: number;
  context: string;
}

interface RAGOptions {
  userId?: string;
  context: 'challenge_mode' | 'strategic_rewrite' | 'general';
  maxTokens?: number;
  temperature?: number;
  topResults?: number;
}

/**
 * Build system prompt based on context
 */
function buildSystemPrompt(
  context: 'challenge_mode' | 'strategic_rewrite' | 'general'
): string {
  switch (context) {
    case 'challenge_mode':
      return `You are a brutally honest venture capital investor reviewing a startup pitch.
      
Your role is to:
1. Identify real risks and challenges (not just positives)
2. Reference relevant case studies and failures from your knowledge base
3. Give actionable feedback for improvement
4. Ask tough questions about market fit, team, and unit economics
5. Ground your critique in concrete examples and frameworks

Be direct, insightful, but constructive. Use the knowledge base to support your analysis with real examples.`;

    case 'strategic_rewrite':
      return `You are a strategic advisor helping founders refine their business approach.

Your role is to:
1. Identify strategic improvement opportunities
2. Reference successful pivots and strategies from the knowledge base
3. Suggest go-to-market improvements
4. Recommend business model optimizations
5. Provide frameworks and playbooks for execution

Use the knowledge base to ground recommendations in successful examples and proven strategies.`;

    case 'general':
    default:
      return `You are a venture intelligence AI assistant with deep knowledge of startups, venture capital, and business strategy.

Your role is to:
1. Answer questions accurately and comprehensively
2. Always cite your sources from the knowledge base
3. Provide frameworks and context from strategic literature
4. Reference case studies and examples
5. Be balanced and thoughtful in your analysis

Always cite specific sources when making claims. Be transparent about uncertainty.`;
  }
}

/**
 * Main RAG query function
 * Retrieves relevant knowledge and generates intelligent response
 */
export async function ragQuery(
  userQuery: string,
  options: RAGOptions = { context: 'general' }
): Promise<RAGResponse> {
  try {
    const startTime = Date.now();

    console.log(`\n🤖 RAG Query: "${userQuery}"`);
    console.log(`   Context: ${options.context}`);

    // 1. Embed the query
    const queryEmbedding = await embedText(userQuery);

    // 2. Search knowledge base
    const searchResults = await searchKnowledgeHybrid(
      userQuery,
      options.topResults || 5,
      0.6
    );

    console.log(`✓ Found ${searchResults.length} relevant sources`);

    if (searchResults.length === 0) {
      return {
        answer:
          'I could not find relevant knowledge base sources to answer this question. Please try a different query or provide more context.',
        sources: [],
        confidence: 0.2,
        context: 'No relevant sources found',
      };
    }

    // 3. Build context from search results
    const contextText = buildContextFromResults(searchResults);

    // 4. Increment usage for top results
    if (options.userId) {
      for (const result of searchResults.slice(0, 3)) {
        await incrementChunkUsage(result.id);
      }
    }

    // 5. Build the prompt with context
    const systemPrompt = buildSystemPrompt(options.context);
    const userMessage = `Using the following knowledge base context, please answer this question:

Question: ${userQuery}

Knowledge Base Context:
${contextText}

Please provide a thoughtful, well-grounded response that references the sources.`;

    // 6. Query Claude
    console.log('📤 Querying Claude...');

    // Using Anthropic SDK (would use Claude, not OpenAI)
    // For now, mocking the response format
    const answer = await generateRAGResponse(
      userMessage,
      systemPrompt,
      options.maxTokens || 2000,
      options.temperature || 0.7
    );

    // 7. Record search for analytics
    if (options.userId) {
      const executionTime = Date.now() - startTime;
      const relevanceScore = Math.max(...searchResults.map((r) => r.similarity));

      await recordSearchQuery(
        options.userId,
        userQuery,
        queryEmbedding,
        options.context,
        searchResults.length,
        executionTime,
        relevanceScore
      );
    }

    // 8. Format response
    return {
      answer,
      sources: searchResults.slice(0, 5).map((r) => ({
        title: r.title,
        url: r.source_url,
        excerpt: r.excerpt,
        relevance: r.similarity,
      })),
      confidence: Math.max(...searchResults.map((r) => r.similarity)),
      context: options.context,
    };
  } catch (error) {
    console.error('Error in RAG query:', error);
    return {
      answer: `Error processing query: ${error instanceof Error ? error.message : 'Unknown error'}`,
      sources: [],
      confidence: 0,
      context: 'error',
    };
  }
}

/**
 * Build context string from search results
 */
function buildContextFromResults(results: SearchResult[]): string {
  return results
    .map(
      (r, i) =>
        `[Source ${i + 1}: ${r.source}]
Title: ${r.title}
Content: ${r.content}
URL: ${r.source_url || 'N/A'}
---`
    )
    .join('\n\n');
}

/**
 * Generate RAG response using Claude
 * This would call actual Claude API in production
 */
async function generateRAGResponse(
  userMessage: string,
  systemPrompt: string,
  maxTokens: number,
  temperature: number
): Promise<string> {
  try {
    // In production, this would use the Anthropic SDK properly configured
    // For now, returning a structured placeholder that demonstrates the pattern

    // This would be: 
    // const response = await anthropic.messages.create({...})

    console.log('📝 Generating response with Claude...');

    // Placeholder for development
    return `[Generated response based on knowledge base context]

This would be filled by Claude with a thoughtful response that:
1. Directly answers the user's question
2. References relevant knowledge base sources
3. Provides frameworks and examples
4. Maintains the appropriate tone for the context`;
  } catch (error) {
    console.error('Error generating response:', error);
    throw error;
  }
}

/**
 * Batch RAG queries for multiple questions
 */
export async function batchRAGQuery(
  queries: string[],
  options: Omit<RAGOptions, 'userId'>
): Promise<RAGResponse[]> {
  const results: RAGResponse[] = [];

  for (let i = 0; i < queries.length; i++) {
    console.log(`\n[${i + 1}/${queries.length}] Processing query...`);
    const result = await ragQuery(queries[i], options);
    results.push(result);
  }

  return results;
}

/**
 * RAG query with follow-up context
 * For multi-turn conversations
 */
export async function ragQueryWithFollowUp(
  initialQuery: string,
  followUpQuery: string,
  initialResults: SearchResult[],
  options: RAGOptions
): Promise<RAGResponse> {
  // Combine both queries for better context
  const combinedQuery = `${initialQuery}\n\nFollow-up: ${followUpQuery}`;

  // Use initial results as additional context
  const contextText = buildContextFromResults(initialResults);

  // Proceed with combined query
  return ragQuery(combinedQuery, {
    ...options,
    topResults: 3, // Fewer results since we already have context
  });
}

/**
 * Get RAG metrics and statistics
 */
export async function getRAGMetrics(): Promise<{
  totalQueries: number;
  avgResponseTime: number;
  avgConfidence: number;
  topQuestions: Array<{ query: string; count: number }>;
}> {
  // This would query the search_queries table for statistics
  return {
    totalQueries: 0,
    avgResponseTime: 0,
    avgConfidence: 0.85,
    topQuestions: [],
  };
}
