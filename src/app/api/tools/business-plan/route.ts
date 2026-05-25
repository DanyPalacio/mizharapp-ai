/**
 * Business Plan Generator API
 * POST /api/tools/business-plan
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateBusinessPlan } from '@/lib/business-tools';
import { requireProSubscription } from '@/lib/middleware/subscription-guard';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Parse request
    const body = await request.json();

    // Validate required fields
    const { companyName, industry, problemStatement, solution, targetMarket, businessModel, revenue, teamSize } =
      body;

    if (!companyName || !industry || !problemStatement || !solution) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: companyName, industry, problemStatement, solution',
        },
        { status: 400 }
      );
    }

    // Generate business plan
    const businessPlan = generateBusinessPlan({
      companyName,
      industry,
      problemStatement,
      solution,
      targetMarket,
      businessModel,
      revenue: revenue || 1000000,
      teamSize: teamSize || 3,
    });

    return NextResponse.json(
      {
        success: true,
        data: businessPlan,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Business Plan Generation Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate business plan',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/tools/business-plan
 * Returns example/documentation
 */
export async function GET(request: NextRequest) {
  return NextResponse.json(
    {
      tool: 'Business Plan Generator',
      description: 'Generate a professional business plan with market analysis, strategy, and financials',
      endpoint: 'POST /api/tools/business-plan',
      requiredFields: {
        companyName: 'string - Name of your company',
        industry: 'string - Industry (e.g., "SaaS", "Fintech", "Healthcare")',
        problemStatement: 'string - The problem you solve',
        solution: 'string - Your solution approach',
        targetMarket: 'string - Who you sell to',
        businessModel: 'string - How you make money',
      },
      optionalFields: {
        revenue: 'number - Projected annual revenue',
        teamSize: 'number - Number of team members',
      },
      example: {
        companyName: 'DataFlow Analytics',
        industry: 'SaaS',
        problemStatement: 'Companies waste 30% of revenue on inefficient data processes',
        solution: 'Low-code data pipeline builder for non-technical teams',
        targetMarket: 'Mid-market companies (100-1000 employees)',
        businessModel: 'Subscription SaaS, $99-$999/month',
        revenue: 2000000,
        teamSize: 12,
      },
    },
    { status: 200 }
  );
}
