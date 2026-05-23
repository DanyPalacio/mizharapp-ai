/**
 * Case Analytics Dashboard
 * Path: /app/startup/analytics
 *
 * Compare and analyze case study verdicts across sectors and stages.
 */

'use client';

import { useEffect, useState } from 'react';

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

interface Analytics {
  sectors: Record<string, VerdictDistribution>;
  stages: Record<string, VerdictDistribution>;
  risk_clusters: {
    low_risk: string[];
    medium_risk: string[];
    high_risk: string[];
  };
  verdict_totals: {
    PASS: number;
    CONDITIONAL: number;
    FAIL: number;
    UNKNOWN: number;
  };
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    try {
      setLoading(true);

      // Fetch real analytics from API
      const response = await fetch('/api/cases/analytics');

      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }

      const data = await response.json();

      // Use real data if available, otherwise use mock data for demo
      const analyticsData = data.total_cases > 0 ? data : {
        sectors: {
          'AI/ML': {
            total: 12,
            verdicts: { PASS: 6, CONDITIONAL: 4, FAIL: 2, UNKNOWN: 0 },
            percentages: { PASS: '50.0', CONDITIONAL: '33.3', FAIL: '16.7' },
          },
          'Data Platform': {
            total: 8,
            verdicts: { PASS: 2, CONDITIONAL: 5, FAIL: 1, UNKNOWN: 0 },
            percentages: { PASS: '25.0', CONDITIONAL: '62.5', FAIL: '12.5' },
          },
          Software: {
            total: 15,
            verdicts: { PASS: 4, CONDITIONAL: 8, FAIL: 3, UNKNOWN: 0 },
            percentages: { PASS: '26.7', CONDITIONAL: '53.3', FAIL: '20.0' },
          },
        },
        stages: {
          Seed: {
            total: 8,
            verdicts: { PASS: 1, CONDITIONAL: 5, FAIL: 2, UNKNOWN: 0 },
            percentages: { PASS: '12.5', CONDITIONAL: '62.5', FAIL: '25.0' },
          },
          'Series A': {
            total: 10,
            verdicts: { PASS: 3, CONDITIONAL: 5, FAIL: 2, UNKNOWN: 0 },
            percentages: { PASS: '30.0', CONDITIONAL: '50.0', FAIL: '20.0' },
          },
          'Series B': {
            total: 12,
            verdicts: { PASS: 6, CONDITIONAL: 4, FAIL: 2, UNKNOWN: 0 },
            percentages: { PASS: '50.0', CONDITIONAL: '33.3', FAIL: '16.7' },
          },
          'Series C+': {
            total: 5,
            verdicts: { PASS: 2, CONDITIONAL: 3, FAIL: 0, UNKNOWN: 0 },
            percentages: { PASS: '40.0', CONDITIONAL: '60.0', FAIL: '0.0' },
          },
        },
        risk_clusters: {
          low_risk: ['Anthropic', 'Stripe', 'Figure AI'],
          medium_risk: ['Databricks', 'Scale AI', 'Modal Labs', 'Hugging Face'],
          high_risk: ['EarlyStage AI Co', 'Unproven Model LLC'],
        },
        verdict_totals: {
          PASS: 12,
          CONDITIONAL: 17,
          FAIL: 6,
          UNKNOWN: 0,
        },
      };

      setAnalytics(analyticsData);
    } catch (err) {
      console.error('Analytics error:', err);
      // Fall back to mock data on error
      setAnalytics({
        sectors: {},
        stages: {},
        risk_clusters: { low_risk: [], medium_risk: [], high_risk: [] },
        verdict_totals: { PASS: 0, CONDITIONAL: 0, FAIL: 0, UNKNOWN: 0 },
      });
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No analytics data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Analytics</h1>
        <p className="text-lg text-gray-600">
          Comparative analysis across all analyzed startup cases
        </p>
      </div>

      {/* Verdict Summary */}
      <div className="grid grid-cols-4 gap-6">
        {[
          { label: 'Ready to Fund', key: 'PASS', color: 'bg-green-50 border-green-200' },
          { label: 'Needs Work', key: 'CONDITIONAL', color: 'bg-yellow-50 border-yellow-200' },
          { label: 'Major Issues', key: 'FAIL', color: 'bg-red-50 border-red-200' },
          { label: 'Not Analyzed', key: 'UNKNOWN', color: 'bg-gray-50 border-gray-200' },
        ].map((item) => (
          <div
            key={item.key}
            className={`${item.color} border rounded-lg p-6`}
          >
            <p className="text-sm text-gray-600 uppercase tracking-wide mb-2">
              {item.label}
            </p>
            <p className="text-4xl font-bold text-gray-900">
              {analytics.verdict_totals[item.key as keyof typeof analytics.verdict_totals]}
            </p>
          </div>
        ))}
      </div>

      {/* By Sector */}
      <div className="bg-white border border-gray-200 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">By Sector</h2>

        <div className="space-y-6">
          {Object.entries(analytics.sectors).map(([sector, data]) => (
            <div key={sector} className="border-b border-gray-200 pb-6 last:border-b-0">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{sector}</h3>
                <span className="text-sm text-gray-600">{data.total} cases</span>
              </div>

              {/* Verdict bars */}
              <div className="space-y-3">
                {[
                  { verdict: 'PASS', color: 'bg-green-500' },
                  { verdict: 'CONDITIONAL', color: 'bg-yellow-500' },
                  { verdict: 'FAIL', color: 'bg-red-500' },
                ].map((item) => {
                  const count = data.verdicts[item.verdict as keyof typeof data.verdicts];
                  const percentage = (count / data.total) * 100;

                  return (
                    <div key={item.verdict} className="flex items-center gap-4">
                      <span className="w-24 text-sm font-medium text-gray-700">
                        {item.verdict}
                      </span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`${item.color} h-2 rounded-full transition-all duration-300`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="w-16 text-right text-sm font-medium text-gray-700">
                        {count} ({percentage.toFixed(0)}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* By Stage */}
      <div className="bg-white border border-gray-200 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">By Funding Stage</h2>

        <div className="grid grid-cols-2 gap-8">
          {Object.entries(analytics.stages).map(([stage, data]) => (
            <div key={stage} className="border border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900">{stage}</h3>
                <span className="text-sm text-gray-600">{data.total}</span>
              </div>

              {/* Mini bars */}
              <div className="flex gap-2 h-8">
                {[
                  { verdict: 'PASS', color: 'bg-green-500' },
                  { verdict: 'CONDITIONAL', color: 'bg-yellow-500' },
                  { verdict: 'FAIL', color: 'bg-red-500' },
                ].map((item) => {
                  const count = data.verdicts[item.verdict as keyof typeof data.verdicts];
                  const percentage = (count / data.total) * 100;

                  return (
                    <div
                      key={item.verdict}
                      className={`${item.color} rounded flex-1 flex items-center justify-center text-xs font-bold text-white`}
                      style={{ flex: `${percentage || 0}` }}
                      title={`${item.verdict}: ${count}`}
                    >
                      {percentage > 15 && `${percentage.toFixed(0)}%`}
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="mt-4 space-y-1 text-xs text-gray-600">
                <p>
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2" />
                  Pass: {data.verdicts.PASS}
                </p>
                <p>
                  <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full mr-2" />
                  Conditional: {data.verdicts.CONDITIONAL}
                </p>
                <p>
                  <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2" />
                  Fail: {data.verdicts.FAIL}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Clustering */}
      <div className="bg-white border border-gray-200 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Risk Clustering</h2>

        <div className="grid grid-cols-3 gap-6">
          {[
            { label: 'Low Risk', key: 'low_risk', color: 'bg-green-50' },
            { label: 'Medium Risk', key: 'medium_risk', color: 'bg-yellow-50' },
            { label: 'High Risk', key: 'high_risk', color: 'bg-red-50' },
          ].map((cluster) => (
            <div key={cluster.key} className={`${cluster.color} rounded-lg p-6`}>
              <h3 className="font-semibold text-gray-900 mb-4">{cluster.label}</h3>
              <ul className="space-y-2">
                {analytics.risk_clusters[cluster.key as keyof typeof analytics.risk_clusters]
                  .map((name) => (
                    <li key={name} className="text-sm text-gray-700 truncate">
                      • {name}
                    </li>
                  ))}
              </ul>
              <p className="text-xs text-gray-500 mt-4">
                {
                  analytics.risk_clusters[
                    cluster.key as keyof typeof analytics.risk_clusters
                  ].length
                }{' '}
                companies
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
