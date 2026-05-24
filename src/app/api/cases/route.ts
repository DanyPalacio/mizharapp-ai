/**
 * GET /api/cases
 *
 * Fetch all startup cases with optional filtering.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key'
);

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '0');
    const limit = parseInt(searchParams.get('limit') || '50');
    const verdict = searchParams.get('verdict');
    const sector = searchParams.get('sector');

    // Build query
    let query = supabase
      .from('startup_cases')
      .select(
        `
        id,
        name,
        description,
        stage,
        sectors,
        total_funding,
        data_source,
        created_at,
        case_analyses (
          verdict,
          risk_score,
          created_at
        )
      `,
        { count: 'exact' }
      );

    // Apply filters
    if (verdict) {
      query = query.eq('case_analyses.verdict', verdict);
    }

    if (sector) {
      query = query.contains('sectors', [sector]);
    }

    // Apply pagination
    const offset = page * limit;
    query = query.range(offset, offset + limit - 1);

    // Execute query
    const { data, error, count } = await query;

    if (error) {
      console.error('Query error:', error);
      throw error;
    }

    // Transform data to include verdict and risk score
    const transformedData = (data || []).map((caseData: any) => {
      const latestAnalysis = caseData.case_analyses?.[0];
      return {
        id: caseData.id,
        name: caseData.name,
        description: caseData.description,
        stage: caseData.stage,
        sectors: caseData.sectors || [],
        total_funding: caseData.total_funding,
        data_source: caseData.data_source,
        verdict: latestAnalysis?.verdict || 'UNKNOWN',
        risk_score: latestAnalysis?.risk_score || 5,
        analyzed_at: latestAnalysis?.created_at || null,
      };
    });

    return NextResponse.json({
      success: true,
      data: transformedData,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: count ? Math.ceil(count / limit) : 0,
      },
    });
  } catch (error) {
    console.error('Cases API error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch cases',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: 'Use POST /api/cases/ingest to ingest cases' },
    { status: 405 }
  );
}
