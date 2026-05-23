/**
 * MIZHAR - Sample Knowledge Ingestion Script
 * Demonstrates how to ingest knowledge into the knowledge base
 * 
 * Usage: npx ts-node scripts/ingest-sample-knowledge.ts
 */

import { ingestKnowledgeChunks, getIngestionStats } from '../src/lib/knowledge-ingest';

// Sample startup knowledge content
const STARTUP_KNOWLEDGE = `
## Startup Success Factors

### Market Fit
Market fit is the degree to which a product satisfies a strong market demand. It's about finding customers who want what you're building.

Key indicators of market fit:
1. High user engagement and retention
2. Word-of-mouth growth
3. Strong product-market fit score (>40% would be "very happy" without product)
4. Customers willing to pay for the product
5. Growing demand for your solution

### Product Development
Build something people want. This requires:
1. Talking to customers constantly
2. Iterating based on feedback
3. Focusing on the core value proposition
4. Not over-building features

### Team Composition
A successful startup team typically needs:
1. Product/design person
2. Technical co-founder(s)
3. Business/operations person
4. Complementary skill sets
5. Strong alignment on vision and values

### Fundraising
Raising capital is about:
1. Building a compelling story
2. Demonstrating traction
3. Finding the right investor match
4. Understanding the funding landscape
5. Knowing what stage of funding you need
`;

const VENTURE_CAPITAL_KNOWLEDGE = `
## Venture Capital Fundamentals

### VC Investment Thesis
A good VC thesis includes:
1. Industry focus or vertical expertise
2. Stage focus (seed, Series A, Series B)
3. Geographic focus
4. Typical check sizes
5. Value-add beyond capital

### Due Diligence
VCs evaluate startups by examining:
1. Market size and growth potential
2. Team quality and experience
3. Product traction and metrics
4. Competitive landscape
5. Business model and unit economics
6. Risk factors and mitigations

### Term Sheets
Key terms in a term sheet:
1. Valuation
2. Investment amount
3. Type of security (preferred stock, SAFE, note)
4. Liquidation preferences
5. Governance rights
6. Anti-dilution provisions

### Portfolio Construction
VCs build portfolios with:
1. Diversification across sectors
2. Diversification across stages
3. Size of each position
4. Expected return targets
5. Risk management strategies
`;

const BUSINESS_STRATEGY_KNOWLEDGE = `
## Business Strategy Framework

### Mission, Vision, and Values
A clear strategic foundation includes:
1. Mission: Why the company exists
2. Vision: Where the company is going
3. Values: What the company believes in
4. Goals: Specific, measurable objectives

### Competitive Advantage
Build sustainable advantages through:
1. Network effects
2. Data advantages
3. Brand loyalty
4. Technology moats
5. Switching costs

### Go-to-Market Strategy
A successful GTM strategy addresses:
1. Target customer profile
2. Distribution channels
3. Sales model (direct, self-serve, enterprise)
4. Customer acquisition cost
5. Customer lifetime value
6. Unit economics

### Growth Strategy
Growth can come from:
1. Product-led growth
2. Sales-driven growth
3. Marketing-led growth
4. Partner-driven growth
5. Viral/network effects
`;

async function main() {
  console.log('📚 MIZHAR Knowledge Base Ingestion\n');

  try {
    // Ingest sample documents
    const documents = [
      {
        title: 'Startup Success Fundamentals',
        content: STARTUP_KNOWLEDGE,
        category: 'startup' as const,
        source: 'Startup_Knowledge_Base',
      },
      {
        title: 'Venture Capital Fundamentals',
        content: VENTURE_CAPITAL_KNOWLEDGE,
        category: 'startup' as const,
        source: 'VC_Fundamentals',
      },
      {
        title: 'Business Strategy Framework',
        content: BUSINESS_STRATEGY_KNOWLEDGE,
        category: 'strategic' as const,
        source: 'Business_Strategy',
      },
    ];

    console.log(`Ingesting ${documents.length} sample documents...\n`);

    let totalChunks = 0;

    for (const doc of documents) {
      const result = await ingestKnowledgeChunks(doc.content, doc.title, {
        source: doc.source,
        category: doc.category,
        tags: ['sample', 'knowledge-base', doc.category],
        qualityScore: 0.9,
      });

      if (result.success) {
        totalChunks += result.chunksCreated;
        console.log(`✅ ${doc.title}: ${result.chunksCreated} chunks created`);
      } else {
        console.log(`❌ ${doc.title}: ${result.error}`);
      }
    }

    console.log(`\n📊 Total chunks ingested: ${totalChunks}`);

    // Get statistics
    console.log('\n📈 Knowledge Base Statistics:');
    const stats = await getIngestionStats();
    console.log(`   Total chunks: ${stats.totalChunks}`);
    console.log(`   Active chunks: ${stats.activeChunks}`);
    console.log(`   Verified chunks: ${stats.verifiedChunks}`);
    console.log(`   Total sources: ${stats.totalSources}`);
    console.log(`   Average quality: ${stats.averageQuality}`);

    console.log('\n✨ Sample knowledge ingestion complete!');
    console.log('You can now search the knowledge base with semantic search.\n');
  } catch (error) {
    console.error('Error during ingestion:', error);
    process.exit(1);
  }
}

main();
