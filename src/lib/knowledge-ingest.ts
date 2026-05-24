/**
 * MIZHAR - Knowledge Base Ingestion Service
 * Handles chunking, embedding, and storing knowledge
 */

import { createClient } from '@supabase/supabase-js';
import { batchEmbed } from './embeddings';

const supabase = createClient(
  (process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'),
  (process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key')
);

export interface IngestionOptions {
  source: string;
  sourceId?: string;
  sourceUrl?: string;
  sourceDate?: Date;
  category: 'strategic' | 'startup' | 'research' | 'market' | 'domain';
  tags: string[];
  batchSize?: number;
  qualityScore?: number;
}

interface KnowledgeChunk {
  title: string;
  content: string;
  excerpt: string;
  source: string;
  source_id?: string;
  source_url?: string;
  source_date?: Date;
  category: string;
  tags: string[];
  embedding: number[];
  quality_score: number;
  is_active: boolean;
  is_verified: boolean;
}

/**
 * Chunk text into smaller pieces
 * Uses both semantic boundaries and fixed sizes
 */
export function chunkText(
  text: string,
  maxChunkSize: number = 1000,
  overlapSize: number = 100
): string[] {
  const chunks: string[] = [];

  // Split by paragraphs first
  const paragraphs = text.split('\n\n').filter((p) => p.trim().length > 0);

  let currentChunk = '';

  for (const paragraph of paragraphs) {
    // If adding this paragraph would exceed max size, save current chunk
    if (
      currentChunk.length + paragraph.length > maxChunkSize &&
      currentChunk.length > 0
    ) {
      chunks.push(currentChunk.trim());

      // Add overlap (last 100 chars of previous chunk)
      currentChunk = currentChunk.slice(-overlapSize);
    }

    currentChunk += paragraph + '\n\n';

    // If paragraph itself is larger than max, split it
    if (paragraph.length > maxChunkSize) {
      const sentences = paragraph.split(/[.!?]+/).filter((s) => s.trim());
      let sentenceChunk = '';

      for (const sentence of sentences) {
        if (
          sentenceChunk.length + sentence.length > maxChunkSize &&
          sentenceChunk.length > 0
        ) {
          chunks.push(sentenceChunk.trim());
          sentenceChunk = sentenceChunk.slice(-overlapSize);
        }
        sentenceChunk += sentence + '. ';
      }

      if (sentenceChunk.trim()) {
        currentChunk = sentenceChunk;
      }
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks.filter((chunk) => chunk.length > 50); // Filter very small chunks
}

/**
 * Ingest knowledge chunks into the database
 */
export async function ingestKnowledgeChunks(
  content: string,
  title: string,
  options: IngestionOptions
): Promise<{
  success: boolean;
  chunksCreated: number;
  error?: string;
}> {
  try {
    console.log(`\n🔄 Starting ingestion: ${title}`);
    console.log(`   Source: ${options.source}`);
    console.log(`   Category: ${options.category}`);

    // Create source if doesn't exist
    const { data: source, error: sourceError } = await supabase
      .from('knowledge_sources')
      .upsert(
        {
          name: options.source,
          url: options.sourceUrl,
          published_date: options.sourceDate,
          category: options.category,
          is_active: true,
        },
        { onConflict: 'name' }
      )
      .select()
      .single();

    if (sourceError) {
      console.error('Error creating source:', sourceError);
      return { success: false, chunksCreated: 0, error: sourceError.message };
    }

    // Chunk the content
    console.log('📄 Chunking content...');
    const chunks = chunkText(content);
    console.log(`   Created ${chunks.length} chunks`);

    if (chunks.length === 0) {
      return {
        success: false,
        chunksCreated: 0,
        error: 'No chunks created from content',
      };
    }

    // Embed all chunks
    console.log('🧠 Embedding chunks...');
    const embeddings = await batchEmbed(chunks);

    // Prepare database records
    const records: KnowledgeChunk[] = chunks.map((content, i) => ({
      title: `${options.source} - ${i + 1}`,
      content,
      excerpt: content.substring(0, 200),
      source: options.source,
      source_id: source.id,
      source_url: options.sourceUrl,
      source_date: options.sourceDate,
      category: options.category,
      tags: options.tags,
      embedding: embeddings[i],
      quality_score: options.qualityScore || 0.85,
      is_active: true,
      is_verified: false,
    }));

    // Batch insert into database
    const batchSize = options.batchSize || 50;
    let totalCreated = 0;

    console.log(`💾 Inserting ${records.length} chunks (batch size: ${batchSize})...`);

    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize);

      const { error: insertError, data } = await supabase
        .from('knowledge_chunks')
        .insert(batch);

      if (insertError) {
        console.error(
          `Error inserting batch ${Math.floor(i / batchSize) + 1}:`,
          insertError
        );
      } else {
        totalCreated += batch.length;
        console.log(
          `   ✓ Batch ${Math.floor(i / batchSize) + 1}: ${batch.length} chunks (${totalCreated}/${records.length})`
        );
      }
    }

    // Update source stats
    await supabase
      .from('knowledge_sources')
      .update({
        total_chunks: chunks.length,
        ingested_chunks: totalCreated,
        last_ingested: new Date().toISOString(),
      })
      .eq('id', source.id);

    console.log(`✅ Ingestion complete: ${totalCreated} chunks created\n`);

    return { success: true, chunksCreated: totalCreated };
  } catch (error) {
    console.error('Error during ingestion:', error);
    return {
      success: false,
      chunksCreated: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Ingest multiple documents
 */
export async function ingestMultipleDocuments(
  documents: Array<{
    title: string;
    content: string;
    sourceUrl?: string;
    sourceDate?: Date;
  }>,
  baseSource: string,
  options: Omit<IngestionOptions, 'source'>
): Promise<{
  totalChunks: number;
  successfulDocs: number;
  failedDocs: number;
}> {
  let totalChunks = 0;
  let successfulDocs = 0;
  let failedDocs = 0;

  for (let i = 0; i < documents.length; i++) {
    const doc = documents[i];
    const source = `${baseSource}_${i + 1}`;

    console.log(`\n[${i + 1}/${documents.length}] Processing: ${doc.title}`);

    const result = await ingestKnowledgeChunks(doc.content, doc.title, {
      ...options,
      source,
      sourceUrl: doc.sourceUrl,
      sourceDate: doc.sourceDate,
    });

    if (result.success) {
      totalChunks += result.chunksCreated;
      successfulDocs++;
    } else {
      failedDocs++;
      console.error(`   ❌ Failed: ${result.error}`);
    }
  }

  console.log(`\n📊 Batch Summary:`);
  console.log(`   Total chunks: ${totalChunks}`);
  console.log(`   Successful: ${successfulDocs}/${documents.length}`);
  console.log(`   Failed: ${failedDocs}/${documents.length}`);

  return { totalChunks, successfulDocs, failedDocs };
}

/**
 * Get ingestion statistics
 */
export async function getIngestionStats(): Promise<{
  totalChunks: number;
  activeChunks: number;
  verifiedChunks: number;
  totalSources: number;
  averageQuality: number;
}> {
  try {
    const { data: chunks } = await supabase
      .from('knowledge_chunks')
      .select('count')
      .eq('is_active', true)
      .single();

    const { data: verified } = await supabase
      .from('knowledge_chunks')
      .select('count')
      .eq('is_verified', true)
      .single();

    const { data: sources } = await supabase
      .from('knowledge_sources')
      .select('count')
      .eq('is_active', true)
      .single();

    const { data: quality } = await supabase
      .from('knowledge_chunks')
      .select('quality_score');

    const avgQuality =
      quality && quality.length > 0
        ? (quality as any[]).reduce((sum, q) => sum + q.quality_score, 0) /
          quality.length
        : 0;

    return {
      totalChunks: (chunks as any)?.count || 0,
      activeChunks: (chunks as any)?.count || 0,
      verifiedChunks: (verified as any)?.count || 0,
      totalSources: (sources as any)?.count || 0,
      averageQuality: Math.round(avgQuality * 100) / 100,
    };
  } catch (error) {
    console.error('Error getting ingestion stats:', error);
    return {
      totalChunks: 0,
      activeChunks: 0,
      verifiedChunks: 0,
      totalSources: 0,
      averageQuality: 0,
    };
  }
}
