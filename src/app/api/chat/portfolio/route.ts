/**
 * Portfolio Management API
 * POST /api/chat/portfolio - Manage projects in portfolio
 */

import { NextRequest, NextResponse } from 'next/server';
import { PortfolioManager } from '@/lib/chat-engine';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

const portfolioManager = new PortfolioManager();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, conversationId, project } = body;

    // Verify authorization
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (action === 'add') {
      // Add project to portfolio
      if (!project || !project.name || !project.description) {
        return NextResponse.json(
          { success: false, error: 'Project name and description required' },
          { status: 400 }
        );
      }

      await portfolioManager.addProjectToPortfolio(conversationId, {
        name: project.name,
        description: project.description,
        metrics: project.metrics || {},
        status: project.status || 'planning',
      });

      // Save to database
      await supabase.from('portfolio_projects').insert({
        conversation_id: conversationId,
        name: project.name,
        description: project.description,
        metrics: project.metrics || {},
        status: project.status || 'planning',
        created_at: new Date(),
      });

      return NextResponse.json(
        {
          success: true,
          message: `Project "${project.name}" added to portfolio`,
        },
        { status: 201 }
      );
    } else if (action === 'compare') {
      // Compare projects in portfolio
      const comparison = await portfolioManager.compareProjects(conversationId);

      return NextResponse.json(
        {
          success: true,
          comparison: comparison,
        },
        { status: 200 }
      );
    } else if (action === 'recommendations') {
      // Get portfolio recommendations
      const recommendations = await portfolioManager.getPortfolioRecommendations(
        conversationId
      );

      return NextResponse.json(
        {
          success: true,
          recommendations: recommendations,
        },
        { status: 200 }
      );
    } else if (action === 'list') {
      // List all projects
      const { data: projects } = await supabase
        .from('portfolio_projects')
        .select('*')
        .eq('conversation_id', conversationId);

      return NextResponse.json(
        {
          success: true,
          projects: projects || [],
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid action' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Portfolio error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process portfolio request' },
      { status: 500 }
    );
  }
}
