/**
 * MIZHAR - Harvard Business School Cases Ingestion
 * Ingests HBS case studies into knowledge base
 * 
 * Usage: npx ts-node scripts/ingest-hbs-cases.ts
 */

import { ingestKnowledgeChunks, getIngestionStats } from '../src/lib/knowledge-ingest';

// Sample HBS case studies (simplified for demo)
const HBS_CASES = [
  {
    title: 'Airbnb: Disrupting the Hotel Industry',
    content: `
Airbnb started in 2008 as a simple idea: help people rent out their spare rooms during a conference.
Founders Brian Chesky, Joe Gebbia, and Nathan Blecharczyk began by renting out air mattresses in their apartment.

Key Lessons:
1. Start with a specific problem (finding affordable lodging)
2. Build trust through transparency and identity verification
3. Network effects: More hosts attract more guests, more guests attract more hosts
4. Expansion strategy: Localize operations in each market
5. Brand management: Navigate regulatory challenges proactively

Market Impact:
- Disrupted traditional hotel industry
- Created sharing economy category
- Generated billions in value
- Changed urban accommodation landscape

Critical Success Factors:
- Strong founder-market fit
- Willingness to do things that don't scale early
- Obsessive focus on host and guest experience
- Navigating regulatory landscape
- Building community trust
    `,
  },
  {
    title: 'Uber: The Technology Platform for Transportation',
    content: `
Uber transformed from a luxury car service (UberBlack) to a transportation platform.
Founded by Travis Kalanick and Garrett Camp in 2009, Uber exemplifies platform economics.

Key Lessons:
1. Network effects create winner-take-most markets
2. Unit economics matter more than total revenue
3. Regulatory strategy is as important as product strategy
4. International expansion requires local expertise
5. Driver quality and customer service are competitive moats

Market Strategy:
- Started in San Francisco with premium service
- Expanded to budget-friendly UberX
- Added Uber Eats for food delivery
- Expanded globally with local partnerships

Challenges:
- Regulatory battles in multiple jurisdictions
- Driver classification debates
- Competition from Lyft and local players
- Profitability concerns despite scale

Lessons for Startups:
- Build network effects into product
- Understand regulatory landscape early
- Focus on unit economics
- Invest in customer retention
- Build brand loyalty through experience
    `,
  },
  {
    title: 'Netflix: From DVDs to Streaming Dominance',
    content: `
Netflix transformed the entertainment industry by shifting from DVD rental to streaming.
Founded by Reed Hastings and Marc Randolph in 1997, Netflix shows the power of strategic pivots.

Key Transitions:
1. DVD rental by mail (competed with Blockbuster)
2. Streaming (disrupted itself)
3. Content production (became a studio)
4. Global expansion (adapted to local markets)

Critical Decisions:
- Embrace streaming despite DVD business success
- Invest heavily in original content
- Use data analytics for recommendations
- International expansion strategy

Competitive Advantages:
- Recommendation algorithm (proprietary data)
- Content library and originals
- Subscriber data insights
- Flexible pricing and packaging

Market Position:
- Grew from niche to dominant player
- Multiple revenue streams
- Global presence in 190+ countries
- Influenced entire industry model

Strategic Lessons:
- Cannibalize your own business before competitors do
- Data-driven decision making
- Content is king in media
- Understand local markets
- Build habit-forming products
    `,
  },
  {
    title: 'Amazon: The Everything Store',
    content: `
Amazon started as an online bookstore in 1994 and evolved into an everything retailer.
Jeff Bezos built a company focused on customer obsession and long-term thinking.

Core Philosophy:
1. Customer obsession over competitor focus
2. Long-term thinking (willing to sacrifice short-term profits)
3. Willingness to invent and experiment
4. Bias for action

Key Expansions:
- Electronics and general merchandise
- Cloud computing (AWS)
- Streaming video (Prime Video)
- Voice assistant (Alexa)
- Same-day delivery

Success Factors:
- Logistics network investment
- Technology infrastructure
- Customer service obsession
- Supply chain innovation

AWS Impact:
- Created cloud computing market
- Generates significant margin
- Powers entire technology ecosystem
- Strategic business segment

Lessons for Founders:
- Think long-term, not quarterly
- Invest in infrastructure before needed
- Expand into adjacent markets
- Focus on customer, not competitors
- Build systems that scale
    `,
  },
];

async function ingestHBSCases() {
  console.log('📚 Ingesting Harvard Business School Cases\n');

  let totalChunks = 0;
  let successCount = 0;

  for (let i = 0; i < HBS_CASES.length; i++) {
    const caseStudy = HBS_CASES[i];
    console.log(`[${i + 1}/${HBS_CASES.length}] ${caseStudy.title}`);

    const result = await ingestKnowledgeChunks(
      caseStudy.content,
      caseStudy.title,
      {
        source: `HBS_Case_${i + 1}`,
        sourceUrl: `https://www.hbs.edu/case-study/${i + 1}`,
        category: 'startup',
        tags: ['case-study', 'startup', 'strategy', 'business-model', 'hbs'],
        qualityScore: 0.95,
      }
    );

    if (result.success) {
      totalChunks += result.chunksCreated;
      successCount++;
      console.log(`   ✅ ${result.chunksCreated} chunks created\n`);
    } else {
      console.log(`   ❌ Failed: ${result.error}\n`);
    }
  }

  console.log('\n📊 HBS Cases Ingestion Summary:');
  console.log(`   Total chunks: ${totalChunks}`);
  console.log(`   Cases processed: ${successCount}/${HBS_CASES.length}`);
  console.log(`   Average chunks per case: ${Math.round(totalChunks / successCount)}`);

  const stats = await getIngestionStats();
  console.log(`\n📈 Knowledge Base Stats:`);
  console.log(`   Total chunks: ${stats.totalChunks}`);
  console.log(`   Active chunks: ${stats.activeChunks}`);
  console.log(`   Total sources: ${stats.totalSources}`);
  console.log(`   Average quality: ${stats.averageQuality}`);
}

ingestHBSCases().catch(console.error);
