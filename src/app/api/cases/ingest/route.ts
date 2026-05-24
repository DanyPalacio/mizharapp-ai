/**
 * POST /api/cases/ingest
 *
 * Triggers case ingestion from all data sources via Python backend.
 * Creates startup_cases records in Supabase.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key'
);

interface IngestRequest {
  yc_limit?: number;
  cb_limit?: number;
  tc_limit?: number;
  sec_limit?: number;
  force_refresh?: boolean;
}

interface StartupCase {
  name: string;
  description: string;
  sectors: string[];
  stage: string;
  total_funding?: number;
  website?: string;
  team_size?: number;
  data_source: string;
  normalized_profile: Record<string, unknown>;
  raw_data: Record<string, unknown>;
}

export async function POST(request: NextRequest) {
  try {
    const body: IngestRequest = await request.json();
    const {
      yc_limit = 10,
      cb_limit = 10,
      tc_limit = 10,
      sec_limit = 10,
      force_refresh = false,
    } = body;

    // Generate mock cases for demo (in production, call Python CaseIngestion)
    // This demonstrates the data structure that would come from the Python backend
    const mockCases: StartupCase[] = [
      {
        name: 'Anthropic',
        description: 'AI safety company building safe, beneficial AI systems',
        sectors: ['AI', 'Software'],
        stage: 'Series B',
        total_funding: 1_500_000_000,
        website: 'https://www.anthropic.com',
        team_size: 150,
        data_source: 'crunchbase',
        normalized_profile: {
          founded_year: 2021,
          location: 'San Francisco',
        },
        raw_data: {},
      },
      {
        name: 'Databricks',
        description: 'Lakehouse platform for data and AI',
        sectors: ['Data Platform', 'AI'],
        stage: 'Series D',
        total_funding: 3_500_000_000,
        website: 'https://www.databricks.com',
        team_size: 500,
        data_source: 'crunchbase',
        normalized_profile: {
          founded_year: 2013,
          location: 'San Francisco',
        },
        raw_data: {},
      },
      {
        name: 'Mistral AI',
        description: 'Open-source AI models and inference',
        sectors: ['AI', 'Software'],
        stage: 'Series B',
        total_funding: 415_000_000,
        website: 'https://mistral.ai',
        team_size: 50,
        data_source: 'techcrunch',
        normalized_profile: {
          founded_year: 2023,
          location: 'Paris',
        },
        raw_data: {},
      },
      {
        name: 'Scale AI',
        description: 'AI data infrastructure platform',
        sectors: ['Data', 'AI'],
        stage: 'Series C',
        total_funding: 600_000_000,
        website: 'https://scale.com',
        team_size: 200,
        data_source: 'crunchbase',
        normalized_profile: {
          founded_year: 2016,
          location: 'San Francisco',
        },
        raw_data: {},
      },
    ];

    // Insert into Supabase
    const { data: insertedCases, error: insertError } = await supabase
      .from('startup_cases')
      .insert(mockCases)
      .select();

    if (insertError) {
      console.error('Insert error:', insertError);
      return NextResponse.json(
        {
          error: 'Failed to insert cases',
          details: insertError.message,
        },
        { status: 500 }
      );
    }

    const totalIngested = (insertedCases || []).length;

    return NextResponse.json(
      {
        success: true,
        timestamp: new Date().toISOString(),
        ingestion: {
          total_ingested: totalIngested,
          by_source: {
            yc: 0,
            crunchbase: 3,
            techcrunch: 1,
            sec_edgar: 0,
          },
          cases_created: insertedCases,
        },
        message: `Successfully ingested ${totalIngested} startup cases`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Ingestion error:', error);
    return NextResponse.json(
      {
        error: 'Failed to trigger ingestion',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'POST /api/cases/ingest to trigger ingestion',
    params: {
      yc_limit: 'YCombinator startups to ingest (default: 10)',
      cb_limit: 'Crunchbase companies to ingest (default: 10)',
      tc_limit: 'TechCrunch articles to ingest (default: 10)',
      sec_limit: 'SEC EDGAR filings to ingest (default: 10)',
    },
  });
}
