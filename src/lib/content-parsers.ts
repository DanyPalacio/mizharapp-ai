/**
 * Content Parsers for Different Knowledge Sources
 * Handles extraction and chunking of content from various formats
 */

interface ParsedContent {
  title: string;
  content: string;
  source: string;
  sourceUrl?: string;
  sourceDate?: Date;
  metadata: {
    author?: string;
    type: 'article' | 'case-study' | 'research' | 'guide' | 'framework';
    tags: string[];
    keyTakeaways?: string[];
  };
}

/**
 * Parse Harvard Business School case study format
 */
export function parseHBSCase(
  caseTitle: string,
  background: string,
  businessModel: string,
  challenges: string,
  lessons: string,
  outcomes: string
): ParsedContent {
  const content = `
# ${caseTitle}

## Background
${background}

## Business Model & Strategy
${businessModel}

## Challenges Faced
${challenges}

## Key Lessons
${lessons}

## Outcomes & Impact
${outcomes}
`;

  return {
    title: caseTitle,
    content: content.trim(),
    source: 'Harvard Business School',
    sourceUrl: 'https://www.hbs.edu',
    sourceDate: new Date(),
    metadata: {
      type: 'case-study',
      tags: ['case-study', 'startup', 'strategy', 'business-model', 'hbs'],
      author: 'HBS Faculty',
    },
  };
}

/**
 * Parse startup resources and frameworks (YC, Sequoia, a16z, etc.)
 */
export function parseStartupFramework(
  title: string,
  principlesText: string,
  practicalApplication: string,
  source: 'yc' | 'sequoia' | 'a16z' | 'first-round' | 'greylock',
  tags: string[]
): ParsedContent {
  const sourceMap = {
    yc: { name: 'Y Combinator', url: 'https://www.ycombinator.com' },
    sequoia: { name: 'Sequoia Capital', url: 'https://www.sequoiacap.com' },
    a16z: { name: 'Andreessen Horowitz', url: 'https://a16z.com' },
    'first-round': { name: 'First Round Capital', url: 'https://firstround.com' },
    greylock: { name: 'Greylock Partners', url: 'https://greylock.com' },
  };

  const sourceInfo = sourceMap[source];

  const content = `
# ${title}

## Core Principles
${principlesText}

## Practical Application
${practicalApplication}

## Source
${sourceInfo.name} - Essential reading for founders
`;

  return {
    title,
    content: content.trim(),
    source: sourceInfo.name,
    sourceUrl: sourceInfo.url,
    sourceDate: new Date(),
    metadata: {
      type: 'framework',
      tags: [source, 'startup', 'founder', 'advice', ...tags],
    },
  };
}

/**
 * Parse research papers and academic content
 */
export function parseResearchPaper(
  title: string,
  abstract: string,
  methodology: string,
  findings: string,
  implications: string,
  sourceUrl: string
): ParsedContent {
  const content = `
# ${title}

## Abstract
${abstract}

## Methodology
${methodology}

## Key Findings
${findings}

## Implications for Business
${implications}
`;

  return {
    title,
    content: content.trim(),
    source: 'Academic Research',
    sourceUrl,
    sourceDate: new Date(),
    metadata: {
      type: 'research',
      tags: ['research', 'academic', 'insights', 'data-driven'],
    },
  };
}

/**
 * Parse market data and trend reports
 */
export function parseMarketTrend(
  title: string,
  trendDescription: string,
  marketSize: string,
  growthProjection: string,
  opportunitiesAndThreats: string,
  sourceUrl: string
): ParsedContent {
  const content = `
# ${title}

## Trend Overview
${trendDescription}

## Market Size & Growth
${marketSize}

## Growth Projections
${growthProjection}

## Opportunities & Threats
${opportunitiesAndThreats}
`;

  return {
    title,
    content: content.trim(),
    source: 'Market Intelligence',
    sourceUrl,
    sourceDate: new Date(),
    metadata: {
      type: 'guide',
      tags: ['market-data', 'trends', 'opportunity', 'competitive-analysis'],
    },
  };
}

/**
 * Parse industry-specific playbooks and guides
 */
export function parsePlaybook(
  title: string,
  overview: string,
  stepsAndStrategies: string,
  commonMistakes: string,
  keyMetrics: string,
  industryContext: string
): ParsedContent {
  const content = `
# ${title}

## Overview
${overview}

## Steps & Strategies
${stepsAndStrategies}

## Common Mistakes to Avoid
${commonMistakes}

## Key Metrics to Track
${keyMetrics}

## Industry Context
${industryContext}
`;

  return {
    title,
    content: content.trim(),
    source: 'Industry Playbook',
    sourceDate: new Date(),
    metadata: {
      type: 'guide',
      tags: ['playbook', 'industry', 'best-practices', 'strategy'],
    },
  };
}

/**
 * Parse financial and valuation frameworks
 */
export function parseFinancialFramework(
  title: string,
  conceptExplanation: string,
  calculations: string,
  applications: string,
  exampleScenarios: string
): ParsedContent {
  const content = `
# ${title}

## Concept Explanation
${conceptExplanation}

## How to Calculate
${calculations}

## Real-World Applications
${applications}

## Example Scenarios
${exampleScenarios}
`;

  return {
    title,
    content: content.trim(),
    source: 'Financial Intelligence',
    sourceDate: new Date(),
    metadata: {
      type: 'framework',
      tags: ['finance', 'valuation', 'metrics', 'modeling'],
    },
  };
}

/**
 * Parse competitive analysis and market positioning
 */
export function parseCompetitiveAnalysis(
  title: string,
  marketOverview: string,
  keyCompetitors: string,
  differentiation: string,
  strategicRecommendations: string
): ParsedContent {
  const content = `
# ${title}

## Market Overview
${marketOverview}

## Key Competitors & Positioning
${keyCompetitors}

## Differentiation Strategies
${differentiation}

## Strategic Recommendations
${strategicRecommendations}
`;

  return {
    title,
    content: content.trim(),
    source: 'Competitive Intelligence',
    sourceDate: new Date(),
    metadata: {
      type: 'guide',
      tags: ['competitive-analysis', 'positioning', 'strategy', 'market-dynamics'],
    },
  };
}

/**
 * Extract key takeaways from content
 */
export function extractKeyTakeaways(content: string, count: number = 5): string[] {
  // In production, this would use NLP/ML to extract actual key points
  // For now, extract from headers and key sentences
  const sentences = content
    .split(/[.!?]+/)
    .filter((s) => s.trim().length > 20)
    .slice(0, count);

  return sentences.map((s) => s.trim());
}

/**
 * Generate tags from content analysis
 */
export function generateContentTags(content: string, baseTag: string = ''): string[] {
  const tags = [baseTag];

  // Keyword matching for common topics
  const keywordMap: Record<string, string[]> = {
    'fundraising|investment|funding': ['fundraising', 'investment', 'growth-capital'],
    'product|feature|development': ['product', 'development', 'engineering'],
    'market|customer|user': ['market', 'customer', 'user-research'],
    'team|hiring|culture': ['team', 'hiring', 'company-culture'],
    'metrics|growth|scaling': ['metrics', 'growth', 'scaling'],
    'strategy|planning|execution': ['strategy', 'planning', 'execution'],
    'revenue|profitability|unit-economics': ['revenue', 'profitability', 'unit-economics'],
    'retention|churn|engagement': ['retention', 'engagement', 'user-experience'],
  };

  Object.entries(keywordMap).forEach(([keywords, newTags]) => {
    const regex = new RegExp(keywords, 'i');
    if (regex.test(content)) {
      tags.push(...newTags);
    }
  });

  return [...new Set(tags)]; // Remove duplicates
}
