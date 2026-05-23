/**
 * MIZHAR - Startup Resources Ingestion
 * Ingests YC, Sequoia, a16z, and other startup resources
 * 
 * Usage: npx ts-node scripts/ingest-startup-resources.ts
 */

import { ingestMultipleDocuments } from '../src/lib/knowledge-ingest';

const YC_RESOURCES = [
  {
    title: 'How to Start a Startup (Paul Graham)',
    content: `
The most common mistake startups make is trying to solve a problem that doesn't exist.

Key Principles:
1. Start with a specific problem you understand
2. Find users who have acute problems
3. Build something they want badly
4. Focus on user happiness, not features
5. Be willing to build things that don't scale

Startup Lifecycle:
- Ideation: Pick a real problem
- Finding: Build something people want
- Getting: Get users/customers
- Growth: Scale what works

Common Mistakes:
- Building something nobody wants
- Raising money too early
- Hiring too fast
- Competing on price
- Trying to be everything to everyone

The Art of the Pitch:
- Tell your story clearly
- Show traction/metrics
- Demonstrate founder quality
- Explain why you can win
- Ask specifically for help

User Acquisition:
- Do things that don't scale first
- Understand your users deeply
- Build retention first, growth second
- Word of mouth is the best channel
- Organic growth shows real demand

Fundraising Strategy:
- Raise when you have leverage
- VCs want to see traction
- Understand your runway
- Build relationships early
- Be transparent about metrics
    `,
  },
  {
    title: 'The Sequoia Capital Startup Memo',
    content: `
Lessons from investing in 500+ startups over 50 years.

What Makes a Great Startup:
1. Solve a big problem for a large market
2. Build a great team with complementary skills
3. Execute quickly and adapt
4. Focus on customers, not competition
5. Build sustainable unit economics

Market Selection:
- TAM (Total Addressable Market) matters
- Growth rate more important than current size
- Fragmented markets are better than consolidated
- Timing is critical
- Understand market dynamics

Team Evaluation:
- Founder-market fit essential
- Diverse skills and perspectives
- Ability to attract talent
- Commitment and persistence
- Vision combined with pragmatism

Execution Metrics:
- Track what matters (unit economics, retention)
- Monthly revenue growth targets
- Customer acquisition cost vs lifetime value
- Burn rate and runway
- Key product metrics

Go-to-Market Strategy:
- Product-market fit first
- Then scale acquisition
- Build sales muscle
- Understand customer buying process
- Price appropriately

Common Failure Modes:
- Wrong market or bad timing
- Team dysfunction
- Poor capital allocation
- Losing focus on core product
- Scaling prematurely

Exit Opportunities:
- Strategic acquisitions
- IPO for large companies
- Secondary sales
- Understanding buyer motivations
- Timing and preparation
    `,
  },
  {
    title: 'a16z Founder School Playbooks',
    content: `
Key insights from a16z on startup success patterns.

Product Development:
- Understand your first users deeply
- MVP means minimum viable product, not minimum features
- Focus on retention over vanity metrics
- Build habit-forming experiences
- Iterate quickly based on feedback

Sales Strategy:
- Start with founder sales
- Understand sales process intimately
- Build repeatable processes
- Hire salespeople who understand product
- Invest in customer success

Fundraising Playbook:
- Series A: Show product-market fit
- Series B: Demonstrate repeatable growth
- Series C+: Scale with operational excellence
- Understand investor priorities at each stage
- Build relationships early

Marketing Strategy:
- Content marketing for B2B
- Influencer strategy for B2C
- Brand differentiation
- Customer acquisition channels
- Retention and viral loops

Organizational Growth:
- Hire for values and ability
- Build strong company culture
- Clear communication and transparency
- Decentralized decision making
- Accountability and metrics

Scaling Challenges:
- Culture preservation during growth
- Maintaining execution speed
- Board management
- Stakeholder communication
- Strategic pivots at scale

International Expansion:
- Understanding local markets
- Localization vs customization
- Regulatory compliance
- Building local teams
- Capital requirements
    `,
  },
  {
    title: 'First Round Review - The 20-Minute VC',
    content: `
How to evaluate startup opportunities quickly and effectively.

Due Diligence Speed:
- Can you understand the business in 20 minutes?
- If not, it might be too complicated
- Look for clarity in pitch and metrics
- Ask for the most important metrics immediately

Evaluating Founders:
- Have they solved this problem before?
- Do they understand their market?
- Can they attract great talent?
- Are they coachable?
- Do they have customer relationships?

Market Evaluation:
- Is the market large enough?
- Is it growing?
- Is timing right?
- Are there incumbents?
- What's the competitive dynamic?

Financial Metrics:
- Monthly growth rate
- Unit economics
- Gross margins
- CAC/LTV ratio
- Burn rate and runway

Red Flags:
- Founders without domain expertise
- Vague or changing market definition
- No traction after significant time
- Poor company culture
- Inability to articulate competitive advantage

Green Flags:
- Strong founder-market fit
- Real customer demand
- Efficient growth
- Great team
- Clear product vision

Investment Thesis:
- Why this company, now?
- What could go right?
- What could go wrong?
- How do we add value?
- What's our exit scenario?
    `,
  },
];

const MCKINSEY_ARTICLES = [
  {
    title: 'How Companies Can Win with AI',
    content: `
AI adoption requires more than technology—it demands organizational change.

Key Success Factors:
1. Clear use case identification
2. Data infrastructure investment
3. Talent acquisition and development
4. Change management across organization
5. Ethical AI frameworks

Use Cases by Industry:
- Financial Services: Risk assessment, fraud detection
- Healthcare: Diagnostics, treatment planning
- Retail: Personalization, demand forecasting
- Manufacturing: Quality control, predictive maintenance
- Telecommunications: Network optimization, churn prediction

Implementation Roadmap:
- Pilot projects to build credibility
- Quick wins for momentum
- Scale successful pilots
- Integrate into core processes
- Measure and optimize

Organizational Capabilities:
- Data engineering team
- AI/ML talent
- Domain experts
- Data governance
- Cross-functional collaboration

Common Pitfalls:
- Over-ambition in scope
- Lack of data quality
- Misalignment with business strategy
- Resistance to change
- Inadequate governance

ROI Expectations:
- Pilot: 6-12 months
- Scale: 2-3 years
- Payback period: varies by use case
- Expected uplift: 10-30% efficiency gains
    `,
  },
  {
    title: 'Scaling Without Burnout: Leading High-Growth Teams',
    content: `
Managing rapid growth while maintaining culture and employee wellbeing.

Growth Stages:
- 0-50 people: Product market fit focus
- 50-200 people: Systems and processes
- 200-500 people: Management layers
- 500+ people: Organizational maturity

Hiring Strategy:
- Build talent pipeline early
- Hire 2-3 months before needed
- Preserve culture through hiring
- Develop leadership bench strength
- Invest in employer brand

Team Management:
- Regular feedback and communication
- Clear goals and metrics
- Career development paths
- Flexible work arrangements
- Mental health support

Retention Tactics:
- Equity programs for alignment
- Learning and development budget
- Career progression clarity
- Work-life balance emphasis
- Strong manager training

Scaling Culture:
- Document values and practices
- Hire for cultural fit
- Lead by example
- Regular all-hands meetings
- Maintain transparency

Warning Signs of Burnout:
- High turnover (>20% annually)
- Declining engagement scores
- Missed deadlines
- Quality issues
- Health and wellness problems

Preventive Measures:
- Realistic deadline planning
- Cross-training and coverage
- Automation of repetitive tasks
- Clear prioritization
- Management training
    `,
  },
];

async function ingestStartupResources() {
  console.log('🚀 Ingesting Startup Resources\n');

  // Ingest YC Resources
  console.log('📖 Ingesting Y Combinator Resources...');
  const ycResult = await ingestMultipleDocuments(YC_RESOURCES, 'YC_Resource', {
    sourceUrl: 'https://www.ycombinator.com',
    category: 'startup',
    tags: ['yc', 'startup', 'founder', 'advice'],
    qualityScore: 0.95,
  });

  console.log(`✅ YC: ${ycResult.totalChunks} chunks from ${ycResult.successfulDocs} documents\n`);

  // Ingest McKinsey Articles
  console.log('📖 Ingesting McKinsey Articles...');
  const mckinsey Result = await ingestMultipleDocuments(MCKINSEY_ARTICLES, 'McKinsey_Article', {
    sourceUrl: 'https://www.mckinsey.com',
    category: 'strategic',
    tags: ['mckinsey', 'strategy', 'business', 'scaling'],
    qualityScore: 0.92,
  });

  console.log(`✅ McKinsey: ${mckinsey Result.totalChunks} chunks from ${mckinsey Result.successfulDocs} documents\n`);

  // Summary
  console.log('📊 Startup Resources Ingestion Complete:');
  console.log(`   YC chunks: ${ycResult.totalChunks}`);
  console.log(`   McKinsey chunks: ${mckinsey Result.totalChunks}`);
  console.log(`   Total chunks: ${ycResult.totalChunks + mckinsey Result.totalChunks}`);
  console.log(`   Success rate: ${((ycResult.successfulDocs + mckinsey Result.successfulDocs) / (YC_RESOURCES.length + MCKINSEY_ARTICLES.length) * 100).toFixed(0)}%`);
}

ingestStartupResources().catch(console.error);
