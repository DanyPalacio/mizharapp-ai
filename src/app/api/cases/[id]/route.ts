/**
 * GET /api/cases/[id]
 *
 * Fetch a single case with its full analysis.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const caseId = parseInt(params.id);

    if (!caseId) {
      return NextResponse.json(
        { error: 'Invalid case ID' },
        { status: 400 }
      );
    }

    // Fetch case with its analysis
    const { data: caseData, error: caseError } = await supabase
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
        team_size,
        location,
        website,
        created_at,
        case_analyses (
          id,
          verdict,
          risk_score,
          challenge_analysis,
          critical_issues,
          strategic_alternatives,
          created_at
        )
      `
      )
      .eq('id', caseId)
      .single();

    if (caseError) {
      console.error('Case fetch error:', caseError);
      return NextResponse.json(
        { error: 'Case not found' },
        { status: 404 }
      );
    }

    // Fetch similar cases
    const { data: similarCases } = await supabase
      .from('startup_cases')
      .select('id, name, stage, sectors')
      .neq('id', caseId)
      .limit(5);

    // Transform response
    const latestAnalysis = caseData.case_analyses?.[0];

    const transformedCase = {
      id: caseData.id,
      name: caseData.name,
      description: caseData.description,
      stage: caseData.stage,
      sectors: caseData.sectors || [],
      total_funding: caseData.total_funding,
      data_source: caseData.data_source,
      team_size: caseData.team_size,
      location: caseData.location,
      website: caseData.website,
      verdict: latestAnalysis?.verdict || 'UNKNOWN',
      risk_score: latestAnalysis?.risk_score || 5,
      challenge_analysis: latestAnalysis?.challenge_analysis || {
        analysis: 'Analysis not yet available',
      },
      critical_issues: latestAnalysis?.critical_issues || [],
      strategic_alternatives: latestAnalysis?.strategic_alternatives || '',
      analyzed_at: latestAnalysis?.created_at,
      similar_cases: similarCases?.map((c: any) => ({
        id: c.id,
        name: c.name,
        stage: c.stage,
        sectors: c.sectors,
        similarity: 0.75 + Math.random() * 0.2, // Mock similarity score
      })) || [],
    };

    return NextResponse.json({
      success: true,
      data: transformedCase,
    });
  } catch (error) {
    console.error('Case detail API error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch case',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
