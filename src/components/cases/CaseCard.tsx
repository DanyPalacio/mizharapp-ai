/**
 * CaseCard Component
 *
 * Displays a startup case with verdict, risk score, and metadata.
 * Used in case study lists and dashboards.
 */

import Link from 'next/link';
import { VerdictBadge } from './VerdictBadge';
import { RiskScore } from './RiskScore';

interface CaseCardProps {
  id: number;
  name: string;
  description: string;
  stage: string;
  sectors: string[];
  total_funding?: number;
  verdict: 'PASS' | 'CONDITIONAL' | 'FAIL' | 'UNKNOWN';
  risk_score: number;
  data_source: string;
  analyzed_at?: string;
}

export function CaseCard({
  id,
  name,
  description,
  stage,
  sectors,
  total_funding,
  verdict,
  risk_score,
  data_source,
  analyzed_at,
}: CaseCardProps) {
  const fundingDisplay = total_funding
    ? `$${(total_funding / 1_000_000).toFixed(1)}M`
    : 'N/A';

  return (
    <Link href={`/app/startup/cases/${id}`}>
      <div className="bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-shadow p-6 cursor-pointer">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-1">{name}</h3>
            <div className="flex items-center gap-2 flex-wrap">
              {sectors.map((sector) => (
                <span
                  key={sector}
                  className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded"
                >
                  {sector}
                </span>
              ))}
            </div>
          </div>
          <VerdictBadge verdict={verdict} size="md" />
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {description}
        </p>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-gray-200">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
              Stage
            </p>
            <p className="font-semibold text-gray-900">{stage}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
              Funding
            </p>
            <p className="font-semibold text-gray-900">{fundingDisplay}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
              Source
            </p>
            <p className="font-semibold text-gray-900 capitalize">{data_source}</p>
          </div>
        </div>

        {/* Risk Score */}
        <RiskScore score={risk_score} size="sm" showLabel={false} />

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
          <span>{analyzed_at ? new Date(analyzed_at).toLocaleDateString() : 'Not analyzed'}</span>
          <span className="text-blue-600 font-semibold">View Analysis →</span>
        </div>
      </div>
    </Link>
  );
}
