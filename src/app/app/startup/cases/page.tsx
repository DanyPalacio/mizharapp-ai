/**
 * Cases List Page
 * Path: /app/startup/cases
 *
 * Display all Challenge Mode cases
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CaseCard } from '@/components/cases/CaseCard';

interface CaseListItem {
  id: number;
  name: string;
  description: string;
  stage: string;
  sectors: string[];
  verdict: 'PASS' | 'CONDITIONAL' | 'FAIL' | 'UNKNOWN';
  risk_score: number;
  data_source: string;
}

export default function CasesListPage() {
  const [cases, setCases] = useState<CaseListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCases() {
      try {
        setLoading(true);
        const response = await fetch('/api/cases');

        if (!response.ok) {
          throw new Error('Failed to load cases');
        }

        const { data } = await response.json();
        setCases(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load cases');
      } finally {
        setLoading(false);
      }
    }

    loadCases();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading cases...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Challenge Mode Cases</h1>
        <p className="text-gray-600">
          Analyze real startup cases and practice your strategic judgment
        </p>
      </div>

      {cases.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No cases available yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cases.map((caseItem) => (
            <Link key={caseItem.id} href={`/app/startup/cases/${caseItem.id}`}>
              <CaseCard {...caseItem} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
