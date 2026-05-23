/**
 * POST /api/cases/analyze
 *
 * Analyzes startup cases using Challenge Mode.
 * Accepts a list of case IDs or startup data.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

interface AnalysisRequest {
  case_ids?: number[];
  startups?: any[];
  include_rewrite?: boolean;
  batch_size?: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: AnalysisRequest = await request.json();
    const { case_ids, startups, include_rewrite = true, batch_size = 5 } = body;

    if (!case_ids && !startups) {
      return NextResponse.json(
        { error: 'Must provide either case_ids or startups' },
        { status: 400 }
      );
    }

    // Fetch startup data if only IDs provided
    let casesToAnalyze = startups || [];

    if (case_ids && case_ids.length > 0) {
      const { data, error } = await supabase
        .from('startup_cases')
        .select('*')
        .in('id', case_ids);

      if (error) throw error;
      casesToAnalyze = data || [];
    }

    // In production, this calls the Python CaseAnalyzer via subprocess or HTTP
    // For now, generate mock analyses
    const analyses = casesToAnalyze.map((caseData) => {
      const verdict = getMockVerdict();
      const riskScore = Math.floor(Math.random() * 10) + 1;

      return {
        case_id: caseData.id,
        verdict,
        risk_score: riskScore,
        challenge_analysis: {
          analysis: generateMockAnalysis(caseData.name, verdict, riskScore),
          sources: [],
          market_data: {},
          knowledge_context: [],
        },
        critical_issues: generateMockIssues(verdict),
        strategic_alternatives: generateMockAlternatives(caseData.name),
      };
    });

    // Save analyses to database
    const { data: savedAnalyses, error: saveError } = await supabase
      .from('case_analyses')
      .insert(
        analyses.map((a) => ({
          case_id: a.case_id,
          verdict: a.verdict,
          risk_score: a.risk_score,
          challenge_analysis: a.challenge_analysis,
          critical_issues: a.critical_issues,
          strategic_alternatives: a.strategic_alternatives,
        }))
      )
      .select();

    if (saveError) throw saveError;

    return NextResponse.json({
      success: true,
      analyzed: analyses.length,
      analyses: savedAnalyses,
      verdict_summary: getVerdictSummary(analyses),
      message: `Analyzed ${analyses.length} cases successfully`,
    });
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      {
        error: 'Failed to analyze cases',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

function getMockVerdict(): string {
  const verdicts = ['PASS', 'CONDITIONAL', 'FAIL'];
  return verdicts[Math.floor(Math.random() * verdicts.length)];
}

function getVerdictSummary(analyses: any[]) {
  const counts = { PASS: 0, CONDITIONAL: 0, FAIL: 0 };
  analyses.forEach((a) => {
    counts[a.verdict as keyof typeof counts]++;
  });
  return counts;
}

function generateMockAnalysis(name: string, verdict: string, riskScore: number): string {
  const verdictText = {
    PASS: `Strong fundamentals across all evaluation criteria.`,
    CONDITIONAL: `Mixed signals - some strengths offset by concerns.`,
    FAIL: `Significant blockers that require addressing before funding.`,
  };

  return `## Challenge Mode Analysis

### Overall Verdict: ${verdict}

${verdictText[verdict as keyof typeof verdictText]}

### Risk Score
**Risk Score: ${riskScore}/10**

### Market Analysis
- TAM: Expanding market opportunity
- Timing: Aligned with industry trends
- Competition: Moderate competitive landscape

### Unit Economics
- CAC: ${riskScore > 7 ? 'Concerns about customer acquisition cost' : 'Reasonable CAC expectations'}
- LTV: ${riskScore < 4 ? 'Strong lifetime value proposition' : 'LTV needs improvement'}
- Burn Rate: ${riskScore > 5 ? 'High burn relative to runway' : 'Efficient capital usage'}

### Team Quality
- Founder pedigree: ${riskScore < 5 ? 'Excellent' : 'Developing'}
- Domain expertise: ${riskScore < 6 ? 'Strong' : 'Adequate'}
- Execution track record: ${riskScore < 5 ? 'Proven' : 'To be demonstrated'}`;
}

function generateMockIssues(verdict: string): string[] {
  if (verdict === 'FAIL') {
    return [
      'Insufficient market validation',
      'Unit economics not sustainable',
      'Competitive moat unclear',
    ];
  } else if (verdict === 'CONDITIONAL') {
    return [
      'Customer concentration risk',
      'Burn rate acceleration',
      'Need to expand team depth',
    ];
  }
  return [];
}

function generateMockAlternatives(name: string): string {
  return `## Strategic Alternatives

### Alternative 1: B2B Focus
Shift from current GTM to enterprise-focused sales with higher ACV.

### Alternative 2: API-First Model
Build developer-centric platform with usage-based pricing.

### Alternative 3: Partnership Strategy
License technology to larger platforms rather than competing directly.`;
}

export async function GET() {
  return NextResponse.json({
    message: 'POST /api/cases/analyze to analyze startup cases',
    payload: {
      case_ids: 'Array of case IDs from startup_cases table',
      startups: 'Array of startup objects to analyze',
      include_rewrite: 'Generate strategic alternatives (default: true)',
      batch_size: 'Cases per batch (default: 5)',
    },
  });
}
