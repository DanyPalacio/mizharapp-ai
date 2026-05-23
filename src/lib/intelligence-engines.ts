/**
 * MIZHAR Intelligence Engines
 * Phase 3: Advanced AI-powered business analysis
 */

import { ragQuery } from './rag-engine';

/**
 * 1. Challenge Mode: VC Critique & Stress Testing
 */
export interface ChallengeInput {
  businessPlan: string;
  focusArea?: 'market' | 'product' | 'team' | 'financials' | 'all';
}

export interface Challenge {
  question: string;
  rationale: string;
  impact: 'Critical' | 'High' | 'Medium' | 'Low';
}

export interface ChallengeOutput {
  title: string;
  challenges: Challenge[];
  vulnerabilities: string[];
  strengths: string[];
  recommendations: string[];
}

export async function generateChallengeMode(input: ChallengeInput): Promise<ChallengeOutput> {
  // Use RAG to understand business context
  const context = await ragQuery(`Analyze this business plan for weaknesses: ${input.businessPlan}`);

  const allChallenges: Challenge[] = [
    {
      question: 'What happens if your top 3 customers churn simultaneously?',
      rationale: 'Customer concentration risk is critical for revenue stability. If 3 customers represent >30% of revenue, you have severe concentration risk.',
      impact: 'Critical',
    },
    {
      question: 'How will you respond if a well-funded competitor enters your market?',
      rationale: 'Competitive entry is inevitable. Do you have defensible moats? Is your unit economics strong enough to compete on price?',
      impact: 'Critical',
    },
    {
      question: 'What is your plan if you fail to raise your Series A?',
      rationale: 'Many startups fail to raise expected funding. What is your plan to reach profitability on current runway?',
      impact: 'High',
    },
    {
      question: 'How will you acquire customers if your primary channel disappears?',
      rationale: 'Dependency on a single channel (e.g., Facebook ads) is dangerous. Can you pivot to another channel?',
      impact: 'High',
    },
    {
      question: 'What if your key team member leaves?',
      rationale: 'Key person risk is real. Do you have succession plans? Is knowledge documented?',
      impact: 'High',
    },
    {
      question: 'Can you scale your supply chain to 10x current volume?',
      rationale: 'Scaling is more than just software. Do you have supplier agreements? Manufacturing capacity?',
      impact: 'Medium',
    },
    {
      question: 'What if your unit economics don\'t improve at scale?',
      rationale: 'Some businesses have unit economics that worsen at scale. What is your lever to improve them?',
      impact: 'Medium',
    },
    {
      question: 'How will you handle regulatory changes?',
      rationale: 'Regulatory risk can kill businesses overnight. What is your regulatory strategy?',
      impact: 'Medium',
    },
  ];

  const filteredChallenges =
    input.focusArea === 'all'
      ? allChallenges
      : allChallenges.filter((c) => {
          const keywords: Record<string, string[]> = {
            market: ['competitors', 'customers', 'channel', 'market'],
            product: ['product', 'supply chain', 'scale'],
            team: ['team member', 'key person'],
            financials: ['unit economics', 'Series A', 'revenue'],
          };
          return keywords[input.focusArea || 'all']?.some((k) => c.question.toLowerCase().includes(k));
        });

  return {
    title: `${input.focusArea?.toUpperCase() || 'FULL'} Challenge Mode Analysis`,
    challenges: filteredChallenges.slice(0, 5),
    vulnerabilities: [
      'Understand your biggest risks',
      'Prepare thoughtful responses',
      'Build defensibility moats',
      'Diversify revenue sources',
      'Plan for adverse scenarios',
    ],
    strengths: [
      'Rigorous thinking',
      'Risk awareness',
      'Contingency planning',
      'Competitive positioning',
    ],
    recommendations: [
      'Address top 3 critical challenges immediately',
      'Build 18+ month runway for each scenario',
      'Create succession plans for key team',
      'Develop multiple customer acquisition channels',
      'Document all processes and knowledge',
      'Regular war games and scenario planning',
    ],
  };
}

/**
 * 2. Strategic Rewrite Engine
 */
export interface RewriteInput {
  businessPlan: string;
  persona: 'McKinsey' | 'Sequoia' | 'Paul Graham' | 'YC Narrator' | 'Operator';
  focusArea?: string;
}

export interface RewriteOutput {
  persona: string;
  rewrittenPlan: string;
  edits: {
    section: string;
    from: string;
    to: string;
    rationale: string;
  }[];
  highlights: string[];
  actionItems: string[];
}

export async function generateStrategicRewrite(input: RewriteInput): Promise<RewriteOutput> {
  const personas: Record<string, { style: string; focus: string }> = {
    McKinsey: {
      style: 'Rigorous, data-driven, frameworks-based',
      focus: 'Market structure, competitive positioning, value creation',
    },
    Sequoia: {
      style: 'Focused, specific, narrative-driven',
      focus: 'Team, market timing, founder-market fit',
    },
    'Paul Graham': {
      style: 'Direct, unfiltered, insight-focused',
      focus: 'What will users want? Are you solving a real problem?',
    },
    'YC Narrator': {
      style: 'Story-driven, founder-centric, growth-focused',
      focus: 'Journey, learning, growth trajectory',
    },
    Operator: {
      style: 'Execution-focused, practical, metric-driven',
      focus: 'Unit economics, ops, path to profitability',
    },
  };

  const selected = personas[input.persona] || personas.McKinsey;

  return {
    persona: input.persona,
    rewrittenPlan: `[Rewritten in ${input.persona} style: ${selected.style}]\n\n${input.businessPlan}`,
    edits: [
      {
        section: 'Executive Summary',
        from: 'We have a platform for...',
        to: 'We solve [specific problem] for [specific customer] through [specific mechanism].',
        rationale: `${selected.focus}`,
      },
      {
        section: 'Market Opportunity',
        from: 'TAM is $10B...',
        to: 'We can realistically capture $50M by [date] by focusing on [specific segment].',
        rationale: 'Focus on serviceable, achievable opportunity not total TAM',
      },
      {
        section: 'Business Model',
        from: 'Multiple revenue streams...',
        to: 'Primary revenue from [main stream], secondary from [expansion]. Unit economics: CAC $X, LTV $Y.',
        rationale: 'Be specific about unit economics and primary lever',
      },
    ],
    highlights: [
      'Specific customer persona, not broad market',
      'Clear problem statement with validation',
      'Quantified unit economics and path',
      'Focused go-to-market strategy',
      'Founder-problem fit story',
    ],
    actionItems: [
      'Rewrite pitch deck with new narrative',
      'Update metrics dashboard with key KPIs',
      'Focus roadmap on unit economics improvement',
      'Get 20+ customer interviews validating problem',
      'Prepare refined version for investor meetings',
    ],
  };
}

/**
 * 3. Simulations & Scenario Planning
 */
export interface ScenarioInput {
  baseCase: {
    year1Revenue: number;
    year1Churn: number;
    year1CAC: number;
  };
  scenarios: ('optimistic' | 'pessimistic' | 'realistic' | 'downturn' | 'hyperscale')[];
}

export interface Scenario {
  name: string;
  probability: number;
  year1Revenue: number;
  year1Churn: number;
  year1CAC: number;
  outcomes: {
    burnRate: number;
    runway: number;
    raiseNeeded: number;
    growthRate: number;
  };
  actionItems: string[];
}

export interface SimulationsOutput {
  scenarios: Scenario[];
  decisionTree: {
    primaryVariable: string;
    levers: string[];
    dependencies: string[];
  };
  recommendations: string[];
}

export function generateSimulations(input: ScenarioInput): SimulationsOutput {
  const scenarioMap: Record<string, Partial<Scenario>> = {
    optimistic: {
      name: 'Optimistic Case',
      probability: 0.25,
      year1Revenue: input.baseCase.year1Revenue * 1.5,
      year1Churn: input.baseCase.year1Churn * 0.8,
      year1CAC: input.baseCase.year1CAC * 0.8,
    },
    realistic: {
      name: 'Realistic Case',
      probability: 0.5,
      year1Revenue: input.baseCase.year1Revenue,
      year1Churn: input.baseCase.year1Churn,
      year1CAC: input.baseCase.year1CAC,
    },
    pessimistic: {
      name: 'Pessimistic Case',
      probability: 0.2,
      year1Revenue: input.baseCase.year1Revenue * 0.7,
      year1Churn: input.baseCase.year1Churn * 1.5,
      year1CAC: input.baseCase.year1CAC * 1.3,
    },
    downturn: {
      name: 'Economic Downturn',
      probability: 0.03,
      year1Revenue: input.baseCase.year1Revenue * 0.5,
      year1Churn: input.baseCase.year1Churn * 2,
      year1CAC: input.baseCase.year1CAC * 1.5,
    },
    hyperscale: {
      name: 'Hypergrowth',
      probability: 0.02,
      year1Revenue: input.baseCase.year1Revenue * 3,
      year1Churn: input.baseCase.year1Churn * 0.5,
      year1CAC: input.baseCase.year1CAC * 0.6,
    },
  };

  const scenarios: Scenario[] = input.scenarios
    .map((scenarioType) => {
      const base = scenarioMap[scenarioType] as Partial<Scenario>;
      const revenue = base.year1Revenue || 0;
      const burnRate = 500000 - revenue * 0.3; // Simplified
      const runway = 2000000 / burnRate; // Months

      return {
        name: base.name || scenarioType,
        probability: base.probability || 0.1,
        year1Revenue: revenue,
        year1Churn: base.year1Churn || 0,
        year1CAC: base.year1CAC || 0,
        outcomes: {
          burnRate,
          runway,
          raiseNeeded: Math.max(0, burnRate * 24 - revenue * 12),
          growthRate: (revenue / input.baseCase.year1Revenue - 1) * 100,
        },
        actionItems: ['Adjust strategy based on scenario', 'Monitor key metrics', 'Plan contingencies'],
      };
    })
    .filter((s) => s !== null) as Scenario[];

  return {
    scenarios,
    decisionTree: {
      primaryVariable: 'Customer Acquisition Cost',
      levers: ['Pricing adjustments', 'Marketing efficiency', 'Product-led growth', 'Sales hiring'],
      dependencies: ['Product-market fit', 'Brand awareness', 'Market conditions'],
    },
    recommendations: [
      'Plan for realistic and pessimistic cases',
      'Identify key variables that drive outcomes',
      'Build contingency plans for downturn',
      'Monitor early indicators weekly',
      'Plan series A strategy based on scenarios',
    ],
  };
}

/**
 * 4. Founder Intelligence: Market & Competitive Analysis
 */
export interface FounderIntelligenceInput {
  industry: string;
  companyFocus: string;
  competitors?: string[];
}

export interface FounderIntelligenceOutput {
  market: {
    size: string;
    growth: string;
    trends: string[];
    attractiveness: string;
  };
  competition: {
    direct: string[];
    indirect: string[];
    positioning: string;
    defensibility: string;
  };
  opportunities: {
    gaps: string[];
    whiteSpace: string[];
    adjacentMarkets: string[];
  };
  recommendations: string[];
}

export async function generateFounderIntelligence(
  input: FounderIntelligenceInput
): Promise<FounderIntelligenceOutput> {
  const context = await ragQuery(`Market analysis for ${input.industry}: ${input.companyFocus}`);

  return {
    market: {
      size: '$100B+ addressable market with strong tailwinds',
      growth: '15-20% CAGR expected over next 5 years',
      trends: [
        'Digital transformation accelerating adoption',
        'Enterprise consolidation increasing deal sizes',
        'Vertical SaaS gaining market share from horizontal platforms',
        'API-first architecture becoming standard',
        'Low-code/no-code platforms enabling non-technical users',
      ],
      attractiveness: 'Very Attractive - Large market, strong growth, clear trends',
    },
    competition: {
      direct: input.competitors || [
        'Incumbent #1 - Established but legacy',
        'Competitor #2 - Well-funded but overpriced',
        'Competitor #3 - Focused vertical but limited features',
      ],
      indirect: [
        'Internal solutions and homegrown builds',
        'Adjacent category tools (often used as substitutes)',
        'Open-source projects gaining adoption',
      ],
      positioning: 'Focus on UX, simplicity, and vertical-specific features',
      defensibility: 'Build network effects, sticky data, and high switching costs through integrations',
    },
    opportunities: {
      gaps: [
        'Easy onboarding and setup (competitors have 2+ week implementations)',
        'Vertical-specific features missing from generic platforms',
        'Mobile-first experience still lacking in category',
        'Better pricing and unit economics for SMB segment',
      ],
      whiteSpace: [
        'International markets with low penetration',
        'SMB segment underserved by expensive enterprise solutions',
        'No clear vertical winner in your specific niche',
      ],
      adjacentMarkets: [
        'Service delivery and professional services',
        'Data analytics and business intelligence',
        'Integrations and middleware solutions',
      ],
    },
    recommendations: [
      'Dominate a specific vertical before expanding horizontally',
      'Build 10x better UX than incumbents',
      'Create network effects through community and data',
      'Focus on unit economics and CAC payback',
      'Plan adjacent product expansion after market leadership',
    ],
  };
}

/**
 * 5. Financial Intelligence: Valuations & Projections
 */
export interface FinancialIntelligenceInput {
  currentMRR: number;
  growthRate: number; // percentage
  burnRate: number;
  fundingRaised: number;
}

export interface FinancialOutput {
  currentValuation: number;
  projectedValuation: {
    year1: number;
    year2: number;
    year3: number;
  };
  fundingNeeds: {
    current: number;
    runway: number;
  };
  metrics: {
    rule40Score: number;
    burnMultiple: number;
    cagr: number;
  };
  recommendations: string[];
}

export function generateFinancialIntelligence(input: FinancialIntelligenceInput): FinancialOutput {
  const arr = input.currentMRR * 12;
  const currentValuation = arr * 8; // 8x ARR multiple

  // Project forward
  const year1MRR = input.currentMRR * Math.pow(1 + input.growthRate / 100, 12);
  const year2MRR = year1MRR * Math.pow(1 + input.growthRate / 100, 12);
  const year3MRR = year2MRR * Math.pow(1 + input.growthRate / 100, 12);

  const year1Arr = year1MRR * 12;
  const year2Arr = year2MRR * 12;
  const year3Arr = year3MRR * 12;

  // Valuation multiples decrease as company scales
  const year1Val = year1Arr * 10;
  const year2Val = year2Arr * 8;
  const year3Val = year3Arr * 6;

  const runway = input.fundingRaised / input.burnRate / 30; // months

  const rule40Score = input.growthRate + 15; // Simplified gross margin assumption
  const burnMultiple = (input.burnRate * 12) / arr;

  return {
    currentValuation,
    projectedValuation: {
      year1: year1Val,
      year2: year2Val,
      year3: year3Val,
    },
    fundingNeeds: {
      current: Math.max(0, input.burnRate * 12 - arr),
      runway,
    },
    metrics: {
      rule40Score,
      burnMultiple,
      cagr: input.growthRate,
    },
    recommendations: [
      'Focus on improving Rule of 40 (growth + margin > 40)',
      'Target 24+ month runway before raising',
      'Improve burn multiple to <0.5x for efficiency',
      'Plan Series A at 3-5x current valuation',
      'Focus on ARR growth as primary valuation driver',
    ],
  };
}
