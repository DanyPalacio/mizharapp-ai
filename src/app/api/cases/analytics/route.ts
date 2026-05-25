/**
 * GET /api/cases/analytics
 *
 * Returns comparative analytics across all analyzed cases.
 * Includes verdict distribution by sector, stage, risk clustering, etc.
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
    const filter = searchParams.get('filter'); // 'sector', 'stage', 'risk'

    // Fetch all analyses
    const { data: analyses, error } = await supabase
      .from('case_analyses')
      .select(
        `
        *,
        startup_cases:case_id (
          name,
          sectors,
          stage,
          total_funding
        )
      `
      );

    if (error) throw error;

    if (!analyses || analyses.length === 0) {
      return NextResponse.json({
        success: true,
        total_cases: 0,
        message: 'No analyses found',
        sectors: {},
        stages: {},
        risk_clusters: {},
      });
    }

    // Generate analytics
    const analytics = generateAnalytics(analyses, filter);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      total_cases: analyses.length,
      ...analytics,
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate analytics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

function generateAnalytics(analyses: any[], filter?: string | null) {
  const result = {
    sectors: {} as Record<string, VerdictDistribution>,
    stages: {} as Record<string, VerdictDistribution>,
    risk_clusters: {
      low_risk: [] as string[],
      medium_risk: [] as string[],
      high_risk: [] as string[],
    },
    verdict_totals: { PASS: 0, CONDITIONAL: 0, FAIL: 0, UNKNOWN: 0 },
  };

  analyses.forEach((analysis) => {
    const startup = analysis.startup_cases;
    const verdict = analysis.verdict || 'UNKNOWN';
    const riskScore = analysis.risk_score || 5;

    // Verdict totals
    result.verdict_totals[verdict as keyof typeof result.verdict_totals]++;

    // By sector
    if (startup?.sectors && Array.isArray(startup.sectors)) {
      startup.sectors.forEach((sector: string) => {
        if (!result.sectors[sector]) {
          result.sectors[sector] = {
            total: 0,
            verdicts: { PASS: 0, CONDITIONAL: 0, FAIL: 0, UNKNOWN: 0 },
          };
        }
        result.sectors[sector].total++;
        result.sectors[sector].verdicts[verdict]++;
      });
    }

    // By stage
    if (startup?.stage) {
      if (!result.stages[startup.stage]) {
        result.stages[startup.stage] = {
          total: 0,
          verdicts: { PASS: 0, CONDITIONAL: 0, FAIL: 0, UNKNOWN: 0 },
        };
      }
      result.stages[startup.stage].total++;
      result.stages[startup.stage].verdicts[verdict]++;
    }

    // Risk clustering
    if (riskScore <= 3) {
      result.risk_clusters.low_risk.push(startup?.name || 'Unknown');
    } else if (riskScore <= 7) {
      result.risk_clusters.medium_risk.push(startup?.name || 'Unknown');
    } else {
      result.risk_clusters.high_risk.push(startup?.name || 'Unknown');
    }
  });

  // Calculate percentages
  Object.values(result.sectors).forEach((sector) => {
    (sector as any).percentages = {
      PASS: ((sector.verdicts.PASS / sector.total) * 100).toFixed(1),
      CONDITIONAL: ((sector.verdicts.CONDITIONAL / sector.total) * 100).toFixed(1),
      FAIL: ((sector.verdicts.FAIL / sector.total) * 100).toFixed(1),
    };
  });

  Object.values(result.stages).forEach((stage) => {
    (stage as any).percentages = {
      PASS: ((stage.verdicts.PASS / stage.total) * 100).toFixed(1),
      CONDITIONAL: ((stage.verdicts.CONDITIONAL / stage.total) * 100).toFixed(1),
      FAIL: ((stage.verdicts.FAIL / stage.total) * 100).toFixed(1),
    };
  });

  return result;
}

interface VerdictDistribution {
  total: number;
  verdicts: {
    PASS: number;
    CONDITIONAL: number;
    FAIL: number;
    UNKNOWN: number;
  };
  percentages?: {
    PASS: string;
    CONDITIONAL: string;
    FAIL: string;
  };
}

export async function POST() {
  return NextResponse.json(
    { error: 'Use GET to retrieve analytics' },
    { status: 405 }
  );
}
