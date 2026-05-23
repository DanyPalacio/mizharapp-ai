/**
 * MIZHAR Advanced Business Tools
 * Phase 2: Tools 6-9 (EBITDA, Naming, Models, Projections)
 */

/**
 * 6. EBITDA Estimator
 */
export interface EBITDAInput {
  revenue: number;
  costOfRevenue: number;
  operatingExpenses: number;
  rdExpenses: number;
  salesMarketing: number;
  adminExpenses: number;
  taxes: number;
  interestExpense: number;
  depreciation: number;
  amortization: number;
}

export interface EBITDAOutput {
  ebitda: number;
  ebitdaMargin: number;
  operatingIncome: number;
  netIncome: number;
  analysis: {
    healthStatus: 'Unhealthy' | 'Concerning' | 'Fair' | 'Good' | 'Excellent';
    benchmarkComparison: string;
    recommendations: string[];
  };
}

export function calculateEBITDA(input: EBITDAInput): EBITDAOutput {
  // EBITDA = Revenue - COGS - OpEx (before D&A, interest, taxes)
  const grossProfit = input.revenue - input.costOfRevenue;
  const ebitda = grossProfit - input.operatingExpenses;
  const ebitdaMargin = (ebitda / input.revenue) * 100;

  // Operating Income = EBITDA - D&A
  const operatingIncome = ebitda - input.depreciation - input.amortization;

  // Net Income = Operating Income - Interest - Taxes
  const netIncome = operatingIncome - input.interestExpense - input.taxes;

  let healthStatus: 'Unhealthy' | 'Concerning' | 'Fair' | 'Good' | 'Excellent';
  if (ebitdaMargin < -10) healthStatus = 'Unhealthy';
  else if (ebitdaMargin < 0) healthStatus = 'Concerning';
  else if (ebitdaMargin < 20) healthStatus = 'Fair';
  else if (ebitdaMargin < 40) healthStatus = 'Good';
  else healthStatus = 'Excellent';

  const benchmarkComparison = {
    'SaaS': 30,
    'E-commerce': 10,
    'Fintech': 35,
    'Marketplace': 25,
    'Enterprise': 20,
  };

  return {
    ebitda,
    ebitdaMargin,
    operatingIncome,
    netIncome,
    analysis: {
      healthStatus,
      benchmarkComparison: `Your EBITDA margin is ${ebitdaMargin.toFixed(1)}%. Industry benchmark for SaaS is typically 30-40%.`,
      recommendations: [
        ebitdaMargin < 20 ? 'Focus on improving operational efficiency' : 'Maintain current efficiency',
        ebitdaMargin < 10 ? 'Consider cost reduction or pricing increase' : 'Monitor burn rate',
        'Invest in high-ROI initiatives',
        'Monitor COGS and optimize for scale',
        'Track customer acquisition cost vs lifetime value',
      ],
    },
  };
}

/**
 * 7. Startup Naming Tool
 */
export interface NamingInput {
  industry: string;
  description: string;
  targetAudience: string;
  tone: 'Serious' | 'Playful' | 'Innovative' | 'Classic' | 'Trendy';
}

export interface NameOption {
  name: string;
  domain: string;
  score: number;
  reasoning: string;
}

export interface NamingOutput {
  options: NameOption[];
  analysis: {
    domainAvailability: string;
    memorability: string;
    marketAppeal: string;
  };
  recommendations: string[];
}

export function generateStartupNames(input: NamingInput): NamingOutput {
  const toneWords = {
    Serious: ['Pro', 'Enterprise', 'Advanced', 'Prime', 'Elite'],
    Playful: ['Zap', 'Flip', 'Spark', 'Boost', 'Dash'],
    Innovative: ['Nova', 'Quantum', 'Nexus', 'Catalyst', 'Pulse'],
    Classic: ['Summit', 'Compass', 'Bridge', 'Foundation', 'Horizon'],
    Trendy: ['Hive', 'Orbit', 'Flow', 'Shift', 'Echo'],
  };

  const industryWords = {
    'SaaS': ['Hub', 'Cloud', 'Stream', 'Core'],
    'Fintech': ['Vault', 'Ledger', 'Capital', 'Credit'],
    'Healthcare': ['Heal', 'Care', 'Life', 'Plus'],
    'Education': ['Learn', 'Spark', 'Mind', 'Growth'],
    'E-commerce': ['Shop', 'Cart', 'Store', 'Deal'],
  };

  const selectedTone = toneWords[input.tone] || toneWords['Serious'];
  const selectedIndustry = industryWords[input.industry] || ['Tech', 'IO'];

  const options: NameOption[] = [
    {
      name: `${selectedTone[0]}${selectedIndustry[0]}`,
      domain: `${selectedTone[0].toLowerCase()}${selectedIndustry[0].toLowerCase()}.com`,
      score: 8.2,
      reasoning: 'Strong, memorable, and relevant to your industry',
    },
    {
      name: `${selectedIndustry[1]}${selectedTone[1]}`,
      domain: `${selectedIndustry[1].toLowerCase()}${selectedTone[1].toLowerCase()}.com`,
      score: 7.8,
      reasoning: 'Creative combination with good recall',
    },
    {
      name: `${selectedTone[2]}.io`,
      domain: `${selectedTone[2].toLowerCase()}.io`,
      score: 7.5,
      reasoning: 'Modern tech naming with .io extension',
    },
    {
      name: `${selectedIndustry[2]}${selectedTone[0]}`,
      domain: `${selectedIndustry[2].toLowerCase()}${selectedTone[0].toLowerCase()}.com`,
      score: 7.3,
      reasoning: 'Clear connection to industry and positioning',
    },
    {
      name: `${selectedTone[3]}${selectedIndustry[3]}`,
      domain: `${selectedTone[3].toLowerCase()}${selectedIndustry[3].toLowerCase()}.com`,
      score: 7.1,
      reasoning: 'Balanced and professional naming',
    },
  ];

  return {
    options,
    analysis: {
      domainAvailability: 'Check .com, .io, and country-specific extensions for availability',
      memorability: 'Choose names with 1-2 syllables for better recall',
      marketAppeal: `Consider how the name resonates with your target audience: ${input.targetAudience}`,
    },
    recommendations: [
      'Verify trademark availability before committing',
      'Test name with target audience feedback',
      'Consider long-term scalability as company grows',
      'Ensure name is easy to spell and pronounce',
      'Check social media handle availability',
      'Avoid names that date quickly or limit expansion',
    ],
  };
}

/**
 * 8. Business Model Generator
 */
export interface BusinessModelInput {
  companyType: 'SaaS' | 'Marketplace' | 'E-commerce' | 'Fintech' | 'Content' | 'Other';
  targetAudience: string;
  primaryValue: string;
  scalability: 'Low' | 'Medium' | 'High';
}

export interface BusinessModelOutput {
  name: string;
  keyPartners: string[];
  keyActivities: string[];
  keyResources: string[];
  valueProposition: string;
  customerSegments: string[];
  channels: string[];
  customerRelationships: string[];
  revenueStreams: string[];
  costStructure: {
    fixed: string[];
    variable: string[];
  };
  metrics: {
    kpi: string[];
    unitEconomics: string[];
  };
  strengths: string[];
  weaknesses: string[];
}

export function generateBusinessModel(input: BusinessModelInput): BusinessModelOutput {
  const models: Record<string, BusinessModelOutput> = {
    SaaS: {
      name: 'Software as a Service (SaaS)',
      keyPartners: [
        'Payment processors (Stripe, PayPal)',
        'Cloud infrastructure (AWS, GCP)',
        'Integrations partners',
        'Sales and marketing partners',
      ],
      keyActivities: [
        'Product development and feature releases',
        'Customer support and success',
        'Marketing and customer acquisition',
        'Billing and subscription management',
      ],
      keyResources: [
        'Engineering team and codebase',
        'Cloud infrastructure and data centers',
        'Customer data and analytics',
        'Brand and customer relationships',
      ],
      valueProposition: `Provide ${input.primaryValue} through an easy-to-use, scalable software solution`,
      customerSegments: [
        input.targetAudience,
        'SMB market segment',
        'Enterprise customers',
        'Industry-specific verticals',
      ],
      channels: [
        'Website and landing pages',
        'Free trial and freemium model',
        'Sales team for enterprise',
        'App stores and integrations',
      ],
      customerRelationships: [
        'Self-serve with automated onboarding',
        'In-app help and documentation',
        'Community support and forums',
        'Dedicated success managers for enterprise',
      ],
      revenueStreams: [
        'Monthly subscription (recurring)',
        'Annual subscriptions (discount)',
        'Usage-based pricing',
        'Premium tiers and add-ons',
        'Professional services and training',
      ],
      costStructure: {
        fixed: ['Engineering team salaries', 'Cloud infrastructure', 'Office and operations'],
        variable: [
          'Customer support costs',
          'Marketing and customer acquisition',
          'Payment processing fees',
          'Infrastructure scaling costs',
        ],
      },
      metrics: {
        kpi: [
          'Monthly Recurring Revenue (MRR)',
          'Customer Acquisition Cost (CAC)',
          'Customer Lifetime Value (LTV)',
          'Churn rate and retention',
          'Net Dollar Retention (NDR)',
        ],
        unitEconomics: [
          'LTV/CAC ratio > 3',
          'CAC payback < 12 months',
          'Gross margin > 70%',
          'Rule of 40 (growth% + margin%)',
        ],
      },
      strengths: ['Recurring revenue', 'Scalability', 'Low churn potential', 'Network effects'],
      weaknesses: ['Customer acquisition cost', 'Churn risk', 'Competitive pressure', 'Sales cycle'],
    },

    Marketplace: {
      name: 'Two-Sided Marketplace',
      keyPartners: [
        'Buyers (demand side)',
        'Sellers (supply side)',
        'Payment processors',
        'Logistics partners',
      ],
      keyActivities: [
        'Matching buyers with sellers',
        'Transaction facilitation',
        'Quality control and vetting',
        'Dispute resolution',
      ],
      keyResources: [
        'Network of buyers and sellers',
        'Platform technology',
        'Trust and reputation system',
        'Payment infrastructure',
      ],
      valueProposition: `Connect ${input.targetAudience} with quality ${input.primaryValue} through a trusted marketplace`,
      customerSegments: ['Buyers', 'Sellers', 'Logistics partners'],
      channels: ['Mobile app', 'Website', 'Social media', 'Partner channels'],
      customerRelationships: [
        'Community building',
        'Reputation and rating system',
        'Seller support and tools',
        'Buyer protection programs',
      ],
      revenueStreams: [
        'Commission on transactions (15-30%)',
        'Seller premium listings',
        'Buyer subscription for benefits',
        'Advertising and promotions',
      ],
      costStructure: {
        fixed: ['Engineering team', 'Customer support', 'Operations'],
        variable: [
          'Payment processing fees',
          'Marketing and user acquisition',
          'Fraud and chargeback costs',
          'Logistics and operations',
        ],
      },
      metrics: {
        kpi: ['Gross Merchandise Value (GMV)', 'Take rate %', 'Buyer/Seller ratio', 'Transaction fee per item'],
        unitEconomics: [
          'Take rate > 15%',
          'CAC payback < 6 months',
          'Buyer retention > 40%',
          'Repeat purchase rate > 2x',
        ],
      },
      strengths: ['Network effects', 'Two-sided value', 'High transaction volume', 'Data advantages'],
      weaknesses: ['Cold start problem', 'Quality control', 'Fraud risk', 'Regulatory complexity'],
    },

    'E-commerce': {
      name: 'Direct-to-Consumer E-commerce',
      keyPartners: [
        'Suppliers or manufacturers',
        'Logistics partners',
        'Payment processors',
        'Marketing agencies',
      ],
      keyActivities: [
        'Product sourcing and selection',
        'Inventory management',
        'Order fulfillment',
        'Marketing and customer acquisition',
      ],
      keyResources: [
        'Inventory and warehouse',
        'Customer database',
        'Brand and marketing assets',
        'Supplier relationships',
      ],
      valueProposition: `Deliver ${input.primaryValue} to ${input.targetAudience} through convenient online shopping`,
      customerSegments: ['Direct consumers', 'Bulk buyers', 'Seasonal shoppers'],
      channels: ['Website and mobile app', 'Social commerce', 'Marketplace listings'],
      customerRelationships: [
        'Personalization and recommendations',
        'Email marketing and loyalty',
        'Community and social engagement',
        'Easy returns and guarantees',
      ],
      revenueStreams: [
        'Product sales',
        'Shipping and handling fees',
        'Subscription boxes',
        'Affiliate and sponsorships',
      ],
      costStructure: {
        fixed: ['Inventory and warehousing', 'Staff', 'Rent and operations'],
        variable: [
          'Cost of goods sold',
          'Shipping and logistics',
          'Marketing and customer acquisition',
          'Returns and refunds',
        ],
      },
      metrics: {
        kpi: ['Average Order Value (AOV)', 'Customer Lifetime Value', 'Repeat purchase rate', 'Conversion rate'],
        unitEconomics: [
          'Gross margin > 50%',
          'CAC payback < 6 months',
          'Inventory turnover > 2x',
          'Return rate < 5%',
        ],
      },
      strengths: ['Direct customer relationships', 'Data insights', 'Brand control', 'Margin potential'],
      weaknesses: ['Inventory risk', 'High CAC', 'Logistics complexity', 'Return costs'],
    },

    Fintech: {
      name: 'Financial Services Platform',
      keyPartners: [
        'Banks and financial institutions',
        'Payment networks',
        'Regulatory bodies',
        'Technology providers',
      ],
      keyActivities: [
        'Risk management and compliance',
        'Transaction processing',
        'Customer support',
        'Product development',
      ],
      keyResources: [
        'Regulatory licenses',
        'Technology platform',
        'Customer trust',
        'Financial partnerships',
      ],
      valueProposition: `Provide ${input.primaryValue} to ${input.targetAudience} with better rates, lower fees, or more convenience`,
      customerSegments: [
        'Individual consumers',
        'Small businesses',
        'SME market',
        'Institutional investors',
      ],
      channels: ['Mobile app', 'Website', 'Social media', 'Partnerships'],
      customerRelationships: [
        'Security and trust emphasis',
        'Educational content',
        'Community building',
        'Premium customer support',
      ],
      revenueStreams: [
        'Transaction fees',
        'Interest spreads',
        'Subscription fees',
        'Premium features',
        'Data monetization',
      ],
      costStructure: {
        fixed: ['Regulatory compliance', 'Security infrastructure', 'Support team'],
        variable: [
          'Payment processing fees',
          'Marketing and customer acquisition',
          'Banking partnerships',
          'Risk and fraud costs',
        ],
      },
      metrics: {
        kpi: [
          'Assets Under Management (AUM)',
          'Customer deposits',
          'Transaction volume',
          'Revenue per customer',
        ],
        unitEconomics: [
          'Cost-to-income ratio < 60%',
          'CAC payback < 12 months',
          'Customer retention > 90%',
          'Average revenue per user > $50',
        ],
      },
      strengths: ['Regulatory moat', 'High margins', 'Customer loyalty', 'Data advantages'],
      weaknesses: ['Regulatory burden', 'Trust requirements', 'Competition from banks', 'Complex compliance'],
    },

    Content: {
      name: 'Content and Creator Platform',
      keyPartners: [
        'Content creators',
        'Advertisers and sponsors',
        'Payment processors',
        'Distribution networks',
      ],
      keyActivities: [
        'Content curation and recommendation',
        'Creator support and tools',
        'Monetization and payments',
        'Community moderation',
      ],
      keyResources: [
        'Creator network',
        'Technology platform',
        'Content library',
        'Audience and traffic',
      ],
      valueProposition: `Enable ${input.targetAudience} to ${input.primaryValue} through a community-driven platform`,
      customerSegments: ['Creators', 'Audiences/fans', 'Advertisers', 'Brands'],
      channels: ['Web and mobile app', 'Social sharing', 'Email', 'Push notifications'],
      customerRelationships: [
        'Creator enablement and tools',
        'Fan engagement and rewards',
        'Community building',
        'Direct creator support',
      ],
      revenueStreams: [
        'Advertising (share with creators)',
        'Creator subscriptions and tips',
        'Premium memberships',
        'Sponsored content',
        'Merchandise and physical goods',
      ],
      costStructure: {
        fixed: ['Platform development', 'Support team', 'Moderation'],
        variable: [
          'Creator payouts',
          'Hosting and bandwidth',
          'Marketing and growth',
          'Payment processing',
        ],
      },
      metrics: {
        kpi: ['Monthly Active Users', 'Creator count', 'Engagement rate', 'Creator earnings'],
        unitEconomics: [
          'Take rate 30%+',
          'Lifetime engagement > 100 hours',
          'Creator retention > 60%',
          'ARPU growth > 20%',
        ],
      },
      strengths: ['Network effects', 'User generated content', 'Low COGS', 'Community loyalty'],
      weaknesses: ['Content moderation', 'Creator dependence', 'Copyright issues', 'Platform risk'],
    },

    Other: {
      name: 'Custom Business Model',
      keyPartners: ['TBD based on model'],
      keyActivities: ['Define key activities'],
      keyResources: ['Define key resources'],
      valueProposition: `Design a business model that delivers ${input.primaryValue} to ${input.targetAudience}`,
      customerSegments: ['Define customer segments'],
      channels: ['Define channels to reach customers'],
      customerRelationships: ['Define customer relationships'],
      revenueStreams: ['Define revenue sources'],
      costStructure: {
        fixed: ['Define fixed costs'],
        variable: ['Define variable costs'],
      },
      metrics: {
        kpi: ['Define KPIs for your model'],
        unitEconomics: ['Define unit economics targets'],
      },
      strengths: ['Customizable to your needs'],
      weaknesses: ['Requires more definition'],
    },
  };

  return models[input.companyType] || models.Other;
}

/**
 * 9. Financial Projections Generator
 */
export interface ProjectionsInput {
  startingRevenue: number;
  growthRate: number; // percentage
  months: number;
  cogs: number; // percentage of revenue
  opex: number; // monthly fixed cost
  avgCustomerValue: number;
  churnRate: number; // percentage
}

export interface ProjectionMonth {
  month: number;
  revenue: number;
  cogs: number;
  grossProfit: number;
  opex: number;
  ebitda: number;
  customers: number;
}

export interface ProjectionsOutput {
  assumptions: Record<string, any>;
  projections: ProjectionMonth[];
  summary: {
    totalRevenue: number;
    avgMonthlyGrowth: number;
    breakeven: string;
    endingCustomers: number;
  };
  charts: {
    revenueGrowth: string;
    profitability: string;
    unitEconomics: string;
  };
}

export function generateProjections(input: ProjectionsInput): ProjectionsOutput {
  const projections: ProjectionMonth[] = [];
  let currentRevenue = input.startingRevenue;
  let monthlyCustomers = input.startingRevenue / input.avgCustomerValue;

  for (let month = 1; month <= input.months; month++) {
    const cogs = currentRevenue * (input.cogs / 100);
    const grossProfit = currentRevenue - cogs;
    const ebitda = grossProfit - input.opex;

    // Apply churn and growth
    monthlyCustomers = monthlyCustomers * (1 - input.churnRate / 100) * (1 + input.growthRate / 100);

    projections.push({
      month,
      revenue: currentRevenue,
      cogs,
      grossProfit,
      opex: input.opex,
      ebitda,
      customers: Math.round(monthlyCustomers),
    });

    // Update revenue for next month
    currentRevenue = currentRevenue * (1 + input.growthRate / 100);
  }

  const totalRevenue = projections.reduce((sum, p) => sum + p.revenue, 0);
  const breakeven = projections.find((p) => p.ebitda > 0)
    ? `Month ${projections.find((p) => p.ebitda > 0)?.month}`
    : 'Beyond projection period';

  return {
    assumptions: {
      startingRevenue: input.startingRevenue,
      growthRate: `${input.growthRate}% monthly`,
      cogsPercentage: `${input.cogs}% of revenue`,
      monthlyOpex: input.opex,
      avgCustomerValue: input.avgCustomerValue,
      churnRate: `${input.churnRate}%`,
    },
    projections,
    summary: {
      totalRevenue,
      avgMonthlyGrowth: input.growthRate,
      breakeven,
      endingCustomers: projections[projections.length - 1]?.customers || 0,
    },
    charts: {
      revenueGrowth: 'Chart: Exponential revenue growth over time',
      profitability: 'Chart: Path to EBITDA positive (profitability)',
      unitEconomics: 'Chart: Customer growth and CAC payback',
    },
  };
}
