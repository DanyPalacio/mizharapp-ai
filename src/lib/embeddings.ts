/**
 * MIZHAR - Embedding Service
 * Handles OpenAI embeddings for knowledge base chunks
 */

import OpenAI from 'openai';
import crypto from 'crypto';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'placeholder-key',
});

const embeddingCache = new Map<string, number[]>();

function hashText(text: string): string {
  return crypto.createHash('sha256').update(text).digest('hex');
}

/**
 * Embed a single text string
 */
export async function embedText(text: string): Promise<number[]> {
  if (!text || text.trim().length === 0) {
    throw new Error('Cannot embed empty text');
  }

  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text,
      encoding_format: 'float',
    });

    if (!response.data || response.data.length === 0) {
      throw new Error('No embedding returned from OpenAI');
    }

    return response.data[0].embedding as number[];
  } catch (error) {
    console.error('Error embedding text:', error);
    throw error;
  }
}

/**
 * Embed multiple texts in batch (much cheaper)
 */
export async function batchEmbed(texts: string[]): Promise<number[][]> {
  if (!texts || texts.length === 0) {
    throw new Error('No texts provided for batch embedding');
  }

  try {
    console.log(`Embedding batch of ${texts.length} items...`);

    const response = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: texts,
      encoding_format: 'float',
    });

    if (!response.data) {
      throw new Error('No embeddings returned from OpenAI');
    }

    const embeddings = response.data
      .sort((a, b) => a.index - b.index)
      .map((item) => item.embedding as number[]);

    console.log(`✓ Embedded ${embeddings.length} items`);
    return embeddings;
  } catch (error) {
    console.error('Error in batch embedding:', error);
    throw error;
  }
}

/**
 * Embed text with caching
 */
export async function embedWithCache(
  text: string,
  options: { useCache?: boolean } = { useCache: true }
): Promise<number[]> {
  const hash = hashText(text);

  if (options.useCache && embeddingCache.has(hash)) {
    console.log('📦 Cache hit');
    return embeddingCache.get(hash)!;
  }

  const embedding = await embedText(text);
  if (options.useCache) {
    embeddingCache.set(hash, embedding);
  }

  return embedding;
}

/**
 * Batch embed with caching
 */
export async function batchEmbedWithCache(
  texts: string[],
  options: { useCache?: boolean } = { useCache: true }
): Promise<number[][]> {
  const results: number[][] = [];
  const textsToEmbed: { index: number; text: string }[] = [];

  for (let i = 0; i < texts.length; i++) {
    const hash = hashText(texts[i]);
    if (options.useCache && embeddingCache.has(hash)) {
      results[i] = embeddingCache.get(hash)!;
    } else {
      textsToEmbed.push({ index: i, text: texts[i] });
    }
  }

  if (textsToEmbed.length > 0) {
    const newTexts = textsToEmbed.map((t) => t.text);
    const newEmbeddings = await batchEmbed(newTexts);

    for (let i = 0; i < textsToEmbed.length; i++) {
      const originalIndex = textsToEmbed[i].index;
      results[originalIndex] = newEmbeddings[i];

      if (options.useCache) {
        const hash = hashText(textsToEmbed[i].text);
        embeddingCache.set(hash, newEmbeddings[i]);
      }
    }
  }

  return results;
}

/**
 * Clear the embedding cache
 */
export function clearEmbeddingCache(): void {
  const size = embeddingCache.size;
  embeddingCache.clear();
  console.log(`🗑️ Cleared ${size} cached embeddings`);
}

/**
 * Test embedding function
 */
export async function testEmbedding(): Promise<void> {
  try {
    const testText = 'Hello, this is a test embedding.';
    const embedding = await embedText(testText);

    console.log('✅ Embedding test successful');
    console.log(`   Dimensions: ${embedding.length}`);
    console.log(`   Sample values: [${embedding.slice(0, 5).join(', ')}...]`);
  } catch (error) {
    console.error('❌ Embedding test failed:', error);
  }
}
