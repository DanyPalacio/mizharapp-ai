/**
 * Strategic Memory API
 * GET /api/chat/memory - Get strategic memory for conversation
 * POST /api/chat/memory - Update strategic memory
 */

import { NextRequest, NextResponse } from 'next/server';
import { ChatEngine } from '@/lib/chat-engine';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

const chatEngine = new ChatEngine();

/**
 * GET /api/chat/memory?conversationId=xxx
 * Get strategic summary and memory
 */
export async function GET(request: NextRequest) {
  try {
    const conversationId = request.nextUrl.searchParams.get('conversationId');

    if (!conversationId) {
      return NextResponse.json(
        { success: false, error: 'conversationId query parameter required' },
        { status: 400 }
      );
    }

    // Verify authorization
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const strategicSummary = await chatEngine.getStrategicSummary(conversationId);

    if (!strategicSummary) {
      return NextResponse.json(
        { success: false, error: 'Conversation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        memory: strategicSummary,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Strategic memory retrieval error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve strategic memory' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/chat/memory
 * Save/update strategic memory
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { conversationId, decisions, assumptions, metrics, notes } = body;

    // Verify authorization
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!conversationId) {
      return NextResponse.json(
        { success: false, error: 'conversationId required' },
        { status: 400 }
      );
    }

    // Save strategic memory to database
    await supabase.from('strategic_memory').upsert(
      {
        conversation_id: conversationId,
        decisions: decisions || [],
        assumptions: assumptions || [],
        metrics: metrics || {},
        notes: notes || '',
        updated_at: new Date(),
      },
      { onConflict: 'conversation_id' }
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Strategic memory updated successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Strategic memory update error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update strategic memory' },
      { status: 500 }
    );
  }
}
