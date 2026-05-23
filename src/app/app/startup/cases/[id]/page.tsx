/**
 * Case Detail Page
 * Path: /app/startup/cases/[id]
 *
 * Displays full Challenge Mode analysis for a single case.
 */

'use client';

import { useState, useEffect } from 'react';
import { VerdictBadge } from '@/components/cases/VerdictBadge';
import { RiskScore } from '@/components/cases/RiskScore';

interface CaseDetail {
  id: number;
  name: string;
  description: string;
  stage: string;
  sectors: string[];
  total_funding?: number;
  verdict: string;
  risk_score: number;
  data_source: string;
  challenge_analysis: string;
  critical_issues: string[];
  strategic_alternatives: string;
  similar_cases?: Array<{ name: string; similarity: number }>;
}

interface PageProps {
  params: {
    id: string;
  };
}

export default function CaseDetailPage({ params }: PageProps) {
  const [caseData, setCaseData] = useState<CaseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCaseData() {
      try {
        setLoading(true);
        const response = await fetch(`/api/cases/${params.id}`);

        if (!response.ok) {
          throw new Error('Failed to load case');
        }

        const { data } = await response.json();
        setCaseData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load case');
      } finally {
        setLoading(false);
      }
    }

    loadCaseData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading case details...</p>
        </div>
      </div>
    );
  }

  if (error || !caseData) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-8">
        <p className="text-red-800">{error || 'Case not found'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {caseData.name}
            </h1>
            <p className="text-lg text-gray-600 mb-4">{caseData.description}</p>

            {/* Tags */}
            <div className="flex items-center gap-2 flex-wrap mb-6">
              {caseData.sectors.map((sector) => (
                <span
                  key={sector}
                  className="inline-block px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full"
                >
                  {sector}
                </span>
              ))}
            </div>
          </div>
          <VerdictBadge verdict={caseData.verdict as any} size="lg" />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-6 p-6 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">
              Stage
            </p>
            <p className="text-xl font-bold text-gray-900">{caseData.stage}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">
              Funding
            </p>
            <p className="text-xl font-bold text-gray-900">
              ${(caseData.total_funding! / 1_000_000_000).toFixed(1)}B
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">
              Risk Score
            </p>
            <p className="text-xl font-bold text-gray-900">
              {caseData.risk_score}/10
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">
              Source
            </p>
            <p className="text-xl font-bold text-gray-900 capitalize">
              {caseData.data_source}
            </p>
          </div>
        </div>
      </div>

      {/* Risk Score */}
      <div className="bg-white border border-gray-200 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Risk Assessment</h2>
        <RiskScore score={caseData.risk_score} showPercentage={true} showLabel={true} />
      </div>

      {/* Challenge Analysis */}
      <div className="bg-white border border-gray-200 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Challenge Mode Analysis
        </h2>
        <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
          {caseData.challenge_analysis}
        </div>
      </div>

      {/* Critical Issues */}
      {caseData.critical_issues && caseData.critical_issues.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-red-900 mb-6">
            ⚠️ Critical Issues
          </h2>
          <ul className="space-y-3">
            {caseData.critical_issues.map((issue, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="text-red-600 font-bold mt-1">•</span>
                <span className="text-red-800">{issue}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Strategic Alternatives */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-blue-900 mb-6">
          Strategic Alternatives
        </h2>
        <div className="prose prose-sm max-w-none text-blue-900 whitespace-pre-wrap">
          {caseData.strategic_alternatives}
        </div>
      </div>

      {/* Similar Cases */}
      {caseData.similar_cases && caseData.similar_cases.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Similar Cases
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {caseData.similar_cases.map((similar, idx) => (
              <div
                key={idx}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
              >
                <p className="font-semibold text-gray-900 mb-2">
                  {similar.name}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${similar.similarity * 100}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {(similar.similarity * 100).toFixed(0)}% similar
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Methodology */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Methodology</h2>
        <p className="text-gray-700 text-sm mb-4">
          This analysis uses Challenge Mode, an aggressive VC-style critique framework
          that evaluates startups across:
        </p>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>
            <strong>Unit Economics:</strong> CAC, LTV, payback period, burn multiple
          </li>
          <li>
            <strong>Competitive Moat:</strong> Defensibility, switching costs, network
            effects
          </li>
          <li>
            <strong>Market Sizing:</strong> TAM/SAM/SOM validation
          </li>
          <li>
            <strong>Founder Quality:</strong> Track record, domain expertise
          </li>
          <li>
            <strong>Growth Model:</strong> Repeatability, scalability, efficiency
          </li>
          <li>
            <strong>Team:</strong> Founder fit, hiring ability, retention
          </li>
        </ul>
      </div>

      {/* Disclaimer */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8">
        <p className="text-sm text-yellow-900">
          <strong>Disclaimer:</strong> This analysis is generated by AI based on public
          information and standard VC frameworks. It is not professional investment advice,
          a formal recommendation, or verified by direct company interaction. Use as
          research input only.
        </p>
      </div>
    </div>
  );
}
