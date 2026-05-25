/**
 * Market Research Intelligence API
 * GET/POST /api/intelligence/market-research
 * Combines external APIs with knowledge bank for comprehensive market analysis
 */

import { NextRequest, NextResponse } from 'next/server';
import { ExternalDataIntegration } from '@/lib/external-apis';
import { ragQuery } from '@/lib/rag-engine';
import { generateFounderIntelligence } from '@/lib/intelligence-engines';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { company, industry, includeCompetitors = true } = body;

    if (!company && !industry) {
      return NextResponse.json(
        {
          success: false,
          error: 'Must provide either company name or industry',
        },
        { status: 400 }
      );
    }

    const externalData = new ExternalDataIntegration();
    const searchTerm = company || industry;

    // Fetch external data in parallel
    const [crunchbaseResults, pitchbookResults, trends, marketContext] =
      await Promise.all([
        externalData.crunchbase.searchCompanies(searchTerm),
        externalData.pitchbook.searchCompany(searchTerm),
        externalData.googleTrends.searchTrend(searchTerm),
        ragQuery(`Market analysis for ${searchTerm}: competitive landscape, trends, opportunities`),
      ]);

    // Get AI-powered analysis from intelligence engine
    const aiAnalysis = await generateFounderIntelligence({
      industry: industry || 'Technology',
      companyFocus: company || searchTerm,
      competitors: crunchbaseResults.slice(1, 4).map((c) => c.name),
    });

    // Combine all data
    const response = {
      success: true,
      data: {
        overview: {
          searchTerm,
          type: company ? 'company' : 'industry',
          dataFreshness: new Date().toISOString(),
        },
        externalData: {
          crunchbase: crunchbaseResults.slice(0, 5),
          pitchbook: pitchbookResults.slice(0, 5),
          trends: trends,
        },
        knowledgeContext: {
          relevantInsights: marketContext.context?.substring(0, 500),
          sources: marketContext.sources?.slice(0, 3),
        },
        aiAnalysis: {
          market: aiAnalysis.market,
          competition: aiAnalysis.competition,
          opportunities: aiAnalysis.opportunities,
          recommendations: aiAnalysis.recommendations,
        },
        actionItems: [
          'Research top competitors in detail',
          'Analyze market trends and growth drivers',
          'Identify white space opportunities',
          'Monitor market size and TAM',
          'Track funding and investment trends',
        ],
      },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Market research error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch market research data',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const company = searchParams.get('company');
  const industry = searchParams.get('industry');

  if (!company && !industry) {
    return NextResponse.json(
      {
        tool: 'Market Research Intelligence',
        description: 'Get comprehensive market research combining external APIs with knowledge bank',
        endpoint: 'POST /api/intelligence/market-research',
        parameters: {
          company: 'string (optional) - Company name to research',
          industry: 'string (optional) - Industry to analyze',
          includeCompetitors: 'boolean (optional) - Include competitor analysis (default: true)',
        },
        dataSources: [
          'Crunchbase - Startup funding and company data',
          'PitchBook - Market data and comparables',
          'Google Trends - Market demand signals',
          'Knowledge Bank - Strategic frameworks and case studies',
          'Intelligence Engines - AI analysis and recommendations',
        ],
        example: {
          company: 'DataFlow Analytics',
          industry: 'SaaS / Data Pipeline',
          includeCompetitors: true,
        },
      },
      { status: 200 }
    );
  }

  // Handle GET with parameters
  const body = JSON.stringify({
    company,
    industry,
  });

  const postRequest = new Request(request.url, {
    method: 'POST',
    body,
  });

  return POST(postRequest as unknown as NextRequest);
}
