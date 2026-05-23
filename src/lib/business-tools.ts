/**
 * MIZHAR Free Business Tools
 * Phase 2: Core acquisition tools
 */

/**
 * 1. Business Plan Generator
 */
export interface BusinessPlanInput {
  companyName: string;
  industry: string;
  problemStatement: string;
  solution: string;
  targetMarket: string;
  businessModel: string;
  revenue: number;
  teamSize: number;
}

export interface BusinessPlanOutput {
  title: string;
  executiveSummary: string;
  company: {
    mission: string;
    vision: string;
    values: string[];
  };
  market: {
    totalAddressableMarket: string;
    targetAudience: string;
    problemValidation: string;
  };
  product: {
    description: string;
    features: string[];
    uniqueValue: string;
  };
  business: {
    model: string;
    revenue: {
      streams: string[];
      projections: string;
    };
    costStructure: string;
  };
  marketing: {
    strategies: string[];
    channels: string[];
    customerAcquisition: string;
  };
  financials: {
    startup: number;
    projectedRevenue: number;
    breakeven: string;
  };
  team: {
    size: number;
    roles: string[];
    hiring: string;
  };
  implementation: {
    timeline: string;
    milestones: string[];
    resources: string;
  };
}

export function generateBusinessPlan(input: BusinessPlanInput): BusinessPlanOutput {
  return {
    title: `${input.companyName} - Business Plan`,
    executiveSummary: `${input.companyName} addresses the problem of "${input.problemStatement}" through ${input.solution}.
    Operating in the ${input.industry} industry, we target ${input.targetMarket} with a ${input.businessModel} model.
    The market opportunity is substantial, with our annual revenue projected at $${input.revenue.toLocaleString()}.`,

    company: {
      mission: `Help ${input.targetMarket} achieve their goals through innovative ${input.solution}.`,
      vision: `Become the leading ${input.solution} platform in the ${input.industry} space.`,
      values: ['Innovation', 'Customer Focus', 'Integrity', 'Excellence', 'Collaboration'],
    },

    market: {
      totalAddressableMarket: `The ${input.industry} market is worth billions globally, with strong growth tailwinds.`,
      targetAudience: `Primary target: ${input.targetMarket}. Secondary: Adjacent customer segments.`,
      problemValidation: `${input.problemStatement} is a critical pain point affecting time, cost, or quality for our target market.`,
    },

    product: {
      description: `${input.solution} built to solve ${input.problemStatement} for ${input.targetMarket}.`,
      features: [
        'Easy onboarding and setup',
        'Powerful core functionality',
        'Seamless integrations',
        'Beautiful user experience',
        'World-class customer support',
        'Data-driven insights',
        'Customizable workflows',
        'Mobile-first design',
      ],
      uniqueValue: `Unlike existing solutions, we provide ${input.solution} specifically designed for ${input.targetMarket},
      with ${input.businessModel} pricing that aligns with customer value.`,
    },

    business: {
      model: input.businessModel,
      revenue: {
        streams: [
          'Subscription / monthly recurring revenue',
          'Usage-based pricing for power users',
          'Enterprise licensing and custom development',
          'Professional services and training',
        ],
        projections: 'Year 1: $100K MRR | Year 2: $500K MRR | Year 3: $2M+ MRR',
      },
      costStructure: `COGS: 10-15% (hosting, compute). Sales & Marketing: 30-40%. R&D: 20-25%. Operations: 15-20%.`,
    },

    marketing: {
      strategies: [
        'Content marketing and SEO for organic reach',
        'Product-led growth with freemium model',
        'Influencer and thought leader partnerships',
        'Community building and developer advocacy',
        'Strategic partnerships with complementary tools',
        'Case studies and social proof',
      ],
      channels: [
        'Organic search and SEO',
        'Paid advertising (Google, Facebook)',
        'Email marketing and nurture sequences',
        'Social media and community engagement',
        'Industry conferences and events',
        'Word-of-mouth and referral programs',
      ],
      customerAcquisition: `Target CAC under $500 within 24 months through product-led growth and organic channels.`,
    },

    financials: {
      startup: 250000,
      projectedRevenue: input.revenue,
      breakeven: '18-24 months from launch with disciplined unit economics',
    },

    team: {
      size: input.teamSize,
      roles: ['Product', 'Engineering', 'Sales & Marketing', 'Customer Success', 'Finance & Operations'],
      hiring: 'Target 30 employees by Year 2, with emphasis on engineering and sales talent.',
    },

    implementation: {
      timeline: '6 months to launch MVP, 12 months to feature parity, 24 months to market leadership',
      milestones: [
        'Month 1-2: Product development and beta testing',
        'Month 3: Public launch and early adopter acquisition',
        'Month 6: 100+ paying customers',
        'Month 12: $100K+ MRR and Series A fundraising',
        'Month 24: $2M+ MRR and market leadership',
      ],
      resources: 'Seed funding of $250K-$500K to reach profitability. Thereafter, self-funded through operations.',
    },
  };
}

/**
 * 2. SWOT Analysis Generator
 */
export interface SWOTInput {
  companyName: string;
  industry: string;
  yearFounded: number;
  keyProducts: string[];
  teamSize: number;
}

export interface SWOTOutput {
  company: string;
  strengths: {
    internal: string[];
    defensibility: string[];
  };
  weaknesses: {
    internal: string[];
    risks: string[];
  };
  opportunities: {
    market: string[];
    expansion: string[];
  };
  threats: {
    competitive: string[];
    external: string[];
  };
  analysis: {
    position: string;
    recommendations: string[];
  };
}

export function generateSWOT(input: SWOTInput): SWOTOutput {
  const yearsInBusiness = new Date().getFullYear() - input.yearFounded;

  return {
    company: input.companyName,

    strengths: {
      internal: [
        `${yearsInBusiness} years of market experience and domain knowledge`,
        `Focused product suite: ${input.keyProducts.slice(0, 3).join(', ')}`,
        `Team of ${input.teamSize} dedicated professionals`,
        'Established customer relationships and trust',
        'Operational efficiency and lean processes',
      ],
      defensibility: [
        'Brand recognition in the ${input.industry} market',
        'Network effects from established customer base',
        'Switching costs and customer lock-in',
        'Proprietary technology or data',
        'Strong company culture and retention',
      ],
    },

    weaknesses: {
      internal: [
        'Limited brand awareness outside core market',
        'Smaller marketing budget vs. larger competitors',
        'Dependency on key team members',
        'Legacy systems may limit agility',
        'Limited international presence',
      ],
      risks: [
        'Resource constraints limiting expansion',
        'Technology debt from rapid growth',
        'Difficulty attracting top talent',
        'Cash burn rate management',
        'Dependency on single revenue stream',
      ],
    },

    opportunities: {
      market: [
        `Expanding into adjacent verticals within ${input.industry}`,
        'International expansion to new geographies',
        'Vertical integration or acquisition targets',
        'Strategic partnerships with larger platforms',
        'Data monetization and insights products',
      ],
      expansion: [
        'Developing adjacent products for existing customers',
        'Building marketplace or ecosystem',
        'Enterprise upsell to current user base',
        'Launching platform for third-party developers',
        'Creating education and certification programs',
      ],
    },

    threats: {
      competitive: [
        'New entrants with well-funded competitors',
        'Existing incumbents building competitive features',
        'Open-source alternatives gaining adoption',
        'Price competition eroding margins',
        'Consolidation in industry reducing addressable market',
      ],
      external: [
        'Regulatory changes affecting business model',
        'Economic downturn reducing customer spending',
        'Technological disruption making product obsolete',
        'Cybersecurity threats and data breaches',
        'Talent wars increasing hiring costs',
      ],
    },

    analysis: {
      position: `${input.companyName} is well-positioned as an established player in ${input.industry}. With strong internal strengths and clear opportunities for growth, the key to success is focusing resources on the highest-leverage expansion areas while defending against competitive threats.`,
      recommendations: [
        'Invest in product innovation to maintain competitive edge',
        'Expand sales team to capture market share from competitors',
        'Build vertical-specific solutions for higher margins',
        'Develop strategic partnerships to accelerate growth',
        'Focus on customer retention and expansion revenue',
        'Prepare for potential economic downturn',
      ],
    },
  };
}

/**
 * 3. TAM (Total Addressable Market) Calculator
 */
export interface TAMInput {
  industry: string;
  currentRevenue: number;
  marketGrowth: number; // percentage
  customerSegments: string[];
  averagePrice: number;
}

export interface TAMOutput {
  industry: string;
  total: {
    tam: number;
    sam: number;
    som: number;
  };
  breakdown: {
    bySegment: Record<string, number>;
    byGeography: Record<string, number>;
  };
  analysis: {
    marketSize: string;
    growthPotential: string;
    addressability: string;
  };
  recommendations: string[];
}

export function calculateTAM(input: TAMInput): TAMOutput {
  // Simplified TAM calculation
  const addressableSegments = input.customerSegments.length;
  const baseMarketSize = 5000000000; // Start with $5B base market

  // TAM: Total addressable market (entire potential market)
  const tam = baseMarketSize * (1 + input.marketGrowth / 100);

  // SAM: Serviceable addressable market (market we can realistically serve)
  const sam = tam * (addressableSegments / 10) * 0.3; // 30% of TAM we can serve

  // SOM: Serviceable obtainable market (realistic target)
  const som = sam * 0.05; // Target 5% of SAM

  return {
    industry: input.industry,

    total: {
      tam: tam,
      sam: sam,
      som: som,
    },

    breakdown: {
      bySegment: {
        'Segment 1': tam * 0.4,
        'Segment 2': tam * 0.35,
        'Segment 3': tam * 0.25,
      },
      byGeography: {
        'North America': tam * 0.4,
        'Europe': tam * 0.3,
        'Asia Pacific': tam * 0.2,
        'Other': tam * 0.1,
      },
    },

    analysis: {
      marketSize: `TAM: $${(tam / 1000000000).toFixed(1)}B | SAM: $${(sam / 1000000000).toFixed(1)}B | SOM: $${(som / 1000000).toFixed(0)}M`,
      growthPotential: `Market growing at ${input.marketGrowth}% annually, presenting significant opportunity.`,
      addressability: `Realistic obtainable market (SOM) of $${(som / 1000000).toFixed(0)}M is achievable with focused strategy.`,
    },

    recommendations: [
      'Focus on highest-value customer segments first',
      'Build distribution channels optimized for top markets',
      'Monitor market growth and adjust strategy accordingly',
      'Consider geographic expansion as domestic market saturates',
      'Develop vertical-specific solutions to penetrate niches',
    ],
  };
}

/**
 * 4. Investor Readiness Checker
 */
export interface InvestorReadinessInput {
  companyAge: number;
  revenue: number;
  growthRate: number;
  fundingNeeded: number;
  teamSize: number;
  hasIP: boolean;
  hasTraction: boolean;
  hasAdvisors: boolean;
}

export interface InvestorReadinessOutput {
  score: number;
  rating: 'Not Ready' | 'Somewhat Ready' | 'Ready' | 'Highly Ready';
  readiness: Record<string, number>;
  gaps: string[];
  timeline: string;
  recommendations: string[];
}

export function checkInvestorReadiness(input: InvestorReadinessInput): InvestorReadinessOutput {
  const scores: Record<string, number> = {
    'Revenue Traction': input.revenue > 0 ? Math.min((input.revenue / 1000000) * 20, 20) : 0,
    'Growth Rate': Math.min(input.growthRate / 10, 20),
    'Team': Math.min(input.teamSize / 5, 20),
    'IP/Moat': input.hasIP ? 20 : 5,
    'Market Fit': input.hasTraction ? 20 : 10,
    'Governance': input.hasAdvisors ? 20 : 10,
  };

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);

  let rating: 'Not Ready' | 'Somewhat Ready' | 'Ready' | 'Highly Ready';
  if (totalScore < 40) rating = 'Not Ready';
  else if (totalScore < 70) rating = 'Somewhat Ready';
  else if (totalScore < 100) rating = 'Ready';
  else rating = 'Highly Ready';

  const gaps = [];
  if (input.revenue < 100000) gaps.push('Need to demonstrate revenue traction');
  if (input.growthRate < 10) gaps.push('Growth rate needs to be >10% monthly');
  if (input.teamSize < 3) gaps.push('Need to expand core team');
  if (!input.hasIP) gaps.push('Develop differentiated technology or IP');
  if (!input.hasAdvisors) gaps.push('Recruit experienced advisors');

  return {
    score: totalScore,
    rating,
    readiness: scores,
    gaps,
    timeline: gaps.length > 3 ? '12+ months before fundraising' : gaps.length > 0 ? '3-6 months' : 'Ready now',
    recommendations: [
      'Focus on revenue growth and unit economics',
      'Build a world-class founding team',
      'Develop clear IP and defensibility',
      'Get product/market fit validation',
      'Create clear vision for $100M+ market opportunity',
      'Prepare pitch deck and financial models',
      'Build relationships with investors early',
      'Get warm introductions through advisors',
    ],
  };
}

/**
 * 5. Viability Score Calculator
 */
export interface ViabilityInput {
  marketSize: number;
  competition: number; // 1-10 scale
  productMaturity: number; // 1-10 scale
  teamQuality: number; // 1-10 scale
  fundingAvailable: number;
  growthRate: number; // percentage
}

export interface ViabilityOutput {
  viabilityScore: number;
  assessment: 'Not Viable' | 'Low Viability' | 'Moderate' | 'High' | 'Very High';
  factors: Record<string, { score: number; status: string }>;
  recommendations: string[];
  riskFactors: string[];
}

export function calculateViability(input: ViabilityInput): ViabilityOutput {
  const factors: Record<string, { score: number; status: string }> = {
    'Market Size': {
      score: Math.min((input.marketSize / 1000000000) * 20, 20),
      status: input.marketSize > 1000000000 ? 'Large market' : 'Market too small',
    },
    'Competition': {
      score: (10 - input.competition) * 2,
      status: input.competition < 5 ? 'Low competition' : 'High competition',
    },
    'Product Maturity': {
      score: input.productMaturity * 2,
      status: input.productMaturity > 7 ? 'Mature product' : 'Early stage',
    },
    'Team Quality': {
      score: input.teamQuality * 2,
      status: input.teamQuality > 7 ? 'Strong team' : 'Team development needed',
    },
    'Funding Available': {
      score: Math.min((input.fundingAvailable / 1000000) * 4, 20),
      status: input.fundingAvailable > 5000000 ? 'Well funded' : 'Funding constraints',
    },
    'Growth Trajectory': {
      score: Math.min(input.growthRate / 5, 20),
      status: input.growthRate > 10 ? 'Strong growth' : 'Growth concerns',
    },
  };

  const totalScore = Object.values(factors).reduce((sum, f) => sum + f.score, 0);

  let assessment: 'Not Viable' | 'Low Viability' | 'Moderate' | 'High' | 'Very High';
  if (totalScore < 30) assessment = 'Not Viable';
  else if (totalScore < 60) assessment = 'Low Viability';
  else if (totalScore < 80) assessment = 'Moderate';
  else if (totalScore < 100) assessment = 'High';
  else assessment = 'Very High';

  const riskFactors = [];
  if (input.marketSize < 1000000000) riskFactors.push('Market may be too small for venture scale');
  if (input.competition > 7) riskFactors.push('Highly competitive market may limit margins');
  if (input.productMaturity < 5) riskFactors.push('Product needs more development');
  if (input.teamQuality < 6) riskFactors.push('Team gaps may impede execution');
  if (input.fundingAvailable < 1000000) riskFactors.push('Insufficient funding for 18-month runway');

  return {
    viabilityScore: totalScore,
    assessment,
    factors,
    recommendations: [
      'Focus on largest market opportunity',
      'Build product leadership over competition',
      'Invest in team quality and retention',
      'Achieve product/market fit before scaling',
      'Maintain disciplined unit economics',
      'Plan for 24-month runway minimum',
    ],
    riskFactors,
  };
}
