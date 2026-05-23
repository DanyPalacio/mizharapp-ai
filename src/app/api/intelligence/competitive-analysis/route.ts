/**
 * Competitive Analysis with Real Market Data
 * POST /api/intelligence/competitive-analysis
 */

import { NextRequest, NextResponse } from 'next/server';
import { ExternalDataIntegration } from '@/lib/external-apis';
import { ragQuery } from '@/lib/rag-engine';

export interface CompetitiveAnalysisRequest {
  yourCompany: string;
  competitors: string[];
  industry: string;
}

export interface CompetitorProfile {
  name: string;
  funding: number;
  investors: string[];
  employees: number;
  founded: number;
  status: string;
  fundingRound: string;
  valuation: number;
  marketCap?: number;
  peRatio?: number;
}

export interface PositioningRecommendation {
  category: string;
  strength: string;
  weakness: string;
  opportunity: string;
  recommendation: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CompetitiveAnalysisRequest = await request.json();
    const { yourCompany, competitors, industry } = body;

    if (!yourCompany || !competitors || competitors.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Must provide yourCompany and at least one competitor',
        },
        { status: 400 }
      );
    }

    const externalData = new ExternalDataIntegration();

    // Fetch competitor data
    const competitorProfiles: Record<string, CompetitorProfile> = {};

    for (const competitor of competitors) {
      const crunchbaseData = await externalData.crunchbase.searchCompanies(competitor);
      const pitchbookData = await externalData.pitchbook.searchCompany(competitor);

      if (crunchbaseData.length > 0) {
        const cb = crunchbaseData[0];
        competitorProfiles[competitor] = {
          name: cb.name,
          funding: cb.fundingTotal,
          investors: cb.investors,
          employees: cb.employees,
          founded: cb.founded,
          status: cb.status,
          fundingRound: cb.fundingRound,
          valuation: pitchbookData[0]?.valuation || 0,
        };
      }
    }

    // Get your company data
    const yourData = await externalData.crunchbase.searchCompanies(yourCompany);
    const yourProfile = yourData.length > 0
      ? {
          name: yourData[0].name,
          funding: yourData[0].fundingTotal,
          investors: yourData[0].investors,
          employees: yourData[0].employees,
          founded: yourData[0].founded,
          status: yourData[0].status,
          fundingRound: yourData[0].fundingRound,
          valuation: 0,
        }
      : null;

    // Get knowledge bank context on competitive positioning
    const competitiveContext = await ragQuery(
      `Competitive positioning strategies in ${industry}: differentiation, market gaps, competitive advantages`
    );

    // Analyze positioning
    const positioningAnalysis: PositioningRecommendation[] = [
      {
        category: 'Funding & Resources',
        strength: yourProfile
          ? `Your company: $${(yourProfile.funding / 1000000).toFixed(1)}M raised`
          : 'Bootstrapped',
        weakness: `Largest competitor: $${Math.max(...Object.values(competitorProfiles).map((c) => c.funding)) / 1000000}M raised`,
        opportunity: 'Consider strategic partnerships or fundraising to match resources',
        recommendation: 'Focus on capital efficiency and ROI rather than total capital raised',
      },
      {
        category: 'Team & Scale',
        strength: `Your team: ${yourProfile?.employees || 'Small'} employees`,
        weakness: `Largest competitor: ${Math.max(...Object.values(competitorProfiles).map((c) => c.employees))} employees`,
        opportunity: 'Build specialized team focused on core competency',
        recommendation: 'Compete on team quality and execution speed, not size',
      },
      {
        category: 'Market Position',
        strength: 'Focus on specific market segment or vertical',
        weakness: 'Competitors cover broader market',
        opportunity: 'Dominate vertical segment before expanding horizontally',
        recommendation: 'Build category leadership in niche before scaling',
      },
      {
        category: 'Product Differentiation',
        strength: 'Faster iteration and customer feedback',
        weakness: 'Competitors have established products',
        opportunity: 'Build product competitors cannot easily replicate',
        recommendation: 'Focus on UX, ease of use, and vertical-specific features',
      },
      {
        category: 'Go-To-Market',
        strength: 'Agile and creative marketing',
        weakness: 'Competitors have larger marketing budgets',
        opportunity: 'Use product-led growth and community building',
        recommendation: 'Compete on word-of-mouth, content, and viral loops',
      },
    ];

    // Calculate positioning scores
    const positioningScores = {
      funding: yourProfile ? (yourProfile.funding / Math.max(...Object.values(competitorProfiles).map((c) => c.funding))) * 100 : 0,
      teamSize:
        (yourProfile?.employees || 1) / Math.max(...Object.values(competitorProfiles).map((c) => c.employees || 1)) * 100,
      marketTiming: 75, // Assuming newer market entrant
      productInnovation: 80, // Assuming focused product
      customerAcquisition: 70, // Depends on go-to-market
    };

    const response = {
      success: true,
      data: {
        yourCompany: yourProfile,
        competitors: competitorProfiles,
        competitivePositioning: {
          analysis: positioningAnalysis,
          scores: positioningScores,
          overallScore:
            (Object.values(positioningScores).reduce((a, b) => a + b, 0) /
              Object.keys(positioningScores).length).toFixed(1) + '%',
        },
        marketInsights: {
          industryTrends: competitiveContext.context?.substring(0, 300),
          keyFrameworks: competitiveContext.sources?.slice(0, 2),
        },
        strategicRecommendations: [
          'Focus on a specific market segment or vertical',
          'Build differentiated product that competitors cannot easily replicate',
          'Use low-cost acquisition channels (product-led growth, content, community)',
          'Move fast and iterate based on customer feedback',
          'Build strong company culture and team retention',
          'Create network effects and switching costs',
          'Consider strategic partnerships with complementary products',
          'Plan fundraising strategy based on competitive landscape',
        ],
        competitiveMoats: [
          'Network effects and community',
          'Proprietary data and algorithms',
          'High switching costs through integrations',
          'Brand and customer loyalty',
          'First-mover advantage in vertical',
          'Technical team and engineering expertise',
          'Distribution partnerships',
          'Regulatory defensibility',
        ],
      },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Competitive analysis error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to perform competitive analysis',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const yourCompany = searchParams.get('yourCompany');
  const competitors = searchParams.getAll('competitors');
  const industry = searchParams.get('industry');

  if (!yourCompany || competitors.length === 0) {
    return NextResponse.json(
      {
        tool: 'Competitive Analysis',
        description: 'Analyze competitive landscape with real market data from Crunchbase, PitchBook, and more',
        endpoint: 'POST /api/intelligence/competitive-analysis',
        parameters: {
          yourCompany: 'string - Your company name',
          competitors: 'string[] - List of competitor names',
          industry: 'string - Industry name',
        },
        dataSources: [
          'Crunchbase - Funding, investors, team size',
          'PitchBook - Valuations and comparables',
          'Knowledge Bank - Competitive strategy frameworks',
        ],
        example: {
          yourCompany: 'DataFlow Analytics',
          competitors: ['Fivetran', 'Stitch Data', 'Rivery'],
          industry: 'Data Pipeline & ETL',
        },
      },
      { status: 200 }
    );
  }

  // Handle GET with parameters
  const body = JSON.stringify({
    yourCompany,
    competitors,
    industry,
  });

  const postRequest = new Request(request.url, {
    method: 'POST',
    body,
  });

  return POST(postRequest);
}
