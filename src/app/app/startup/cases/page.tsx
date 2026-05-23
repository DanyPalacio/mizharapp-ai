/**
 * Case Studies Dashboard
 * Path: /app/startup/cases
 *
 * Browse and filter analyzed startup cases.
 */

'use client';

import { useEffect, useState } from 'react';
import { CaseCard } from '@/components/cases/CaseCard';

interface Case {
  id: number;
  name: string;
  description: string;
  stage: string;
  sectors: string[];
  total_funding?: number;
  verdict: string;
  risk_score: number;
  data_source: string;
  analyzed_at: string;
}

export default function CasesPage() {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVerdict, setSelectedVerdict] = useState<string>('all');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [sectors, setSectors] = useState<string[]>([]);

  useEffect(() => {
    loadCases();
  }, []);

  async function loadCases() {
    try {
      setLoading(true);
      setError(null);

      // Fetch real cases from Supabase via API
      const casesResponse = await fetch('/api/cases');

      if (!casesResponse.ok) {
        throw new Error('Failed to fetch cases');
      }

      const { data: dbCases } = await casesResponse.json();

      // If no cases in database, use mock data for demo
      const casesToUse: Case[] = dbCases?.length > 0 ? dbCases : [
        {
          id: 1,
          name: 'Anthropic',
          description: 'AI safety company building safe, beneficial AI',
          stage: 'Series B',
          sectors: ['AI', 'Software'],
          total_funding: 1_500_000_000,
          verdict: 'PASS',
          risk_score: 2,
          data_source: 'crunchbase',
          analyzed_at: new Date().toISOString(),
        },
        {
          id: 2,
          name: 'Databricks',
          description: 'Lakehouse platform for data and AI',
          stage: 'Series D',
          sectors: ['Data Platform', 'AI'],
          total_funding: 3_500_000_000,
          verdict: 'CONDITIONAL',
          risk_score: 5,
          data_source: 'crunchbase',
          analyzed_at: new Date().toISOString(),
        },
        {
          id: 3,
          name: 'Mistral AI',
          description: 'Open-source AI models and inference',
          stage: 'Series B',
          sectors: ['AI', 'Software'],
          total_funding: 415_000_000,
          verdict: 'CONDITIONAL',
          risk_score: 6,
          data_source: 'techcrunch',
          analyzed_at: new Date().toISOString(),
        },
        {
          id: 4,
          name: 'Scale AI',
          description: 'AI data infrastructure platform',
          stage: 'Series C',
          sectors: ['Data', 'AI'],
          total_funding: 600_000_000,
          verdict: 'CONDITIONAL',
          risk_score: 4,
          data_source: 'crunchbase',
          analyzed_at: new Date().toISOString(),
        },
      ];

      setCases(casesToUse);

      // Extract unique sectors
      const allSectors = new Set<string>();
      casesToUse.forEach((c) => c.sectors.forEach((s) => allSectors.add(s)));
      setSectors(Array.from(allSectors).sort());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load cases');
    } finally {
      setLoading(false);
    }
  }

  // Filter cases
  const filteredCases = cases.filter((c) => {
    const verdictMatch = selectedVerdict === 'all' || c.verdict === selectedVerdict;
    const sectorMatch = selectedSector === 'all' || c.sectors.includes(selectedSector);
    return verdictMatch && sectorMatch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading case studies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Case Studies</h1>
        <p className="text-lg text-gray-600">
          Analyzed startups from YCombinator, Crunchbase, TechCrunch, and SEC EDGAR
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>

        <div className="grid grid-cols-2 gap-6">
          {/* Verdict Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Verdict
            </label>
            <div className="space-y-2">
              {['all', 'PASS', 'CONDITIONAL', 'FAIL'].map((v) => (
                <label key={v} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="verdict"
                    value={v}
                    checked={selectedVerdict === v}
                    onChange={(e) => setSelectedVerdict(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-700">
                    {v === 'all' ? 'All Verdicts' : v}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Sector Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Sector
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="sector"
                  value="all"
                  checked={selectedSector === 'all'}
                  onChange={(e) => setSelectedSector(e.target.value)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">All Sectors</span>
              </label>
              {sectors.map((s) => (
                <label key={s} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="sector"
                    value={s}
                    checked={selectedSector === s}
                    onChange={(e) => setSelectedSector(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-700">{s}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            {filteredCases.length} Case{filteredCases.length !== 1 ? 's' : ''} Found
          </h2>
        </div>

        {filteredCases.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCases.map((c) => (
              <CaseCard key={c.id} {...c} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600">No cases match your filters</p>
            <button
              onClick={() => {
                setSelectedVerdict('all');
                setSelectedSector('all');
              }}
              className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}
    </div>
  );
}
