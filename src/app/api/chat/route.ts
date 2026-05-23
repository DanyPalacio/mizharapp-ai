/**
 * Chat & Conversation API
 * POST /api/chat - Start conversation or send message
 * GET /api/chat/[conversationId] - Get conversation history
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
 * POST /api/chat
 * Start new conversation or send message
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, conversationId, userId, userMessage, businessContext } = body;

    // Verify user authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (action === 'start') {
      // Start new conversation
      const newConversationId = await chatEngine.startConversation(
        userId,
        conversationId || `conv_${Date.now()}`,
        businessContext
      );

      // Save to database
      await supabase.from('conversations').insert({
        id: newConversationId,
        user_id: userId,
        business_context: businessContext,
        created_at: new Date(),
      });

      return NextResponse.json(
        {
          success: true,
          conversationId: newConversationId,
          message: 'Conversation started successfully',
        },
        { status: 201 }
      );
    } else if (action === 'message') {
      // Send message to conversation
      if (!conversationId || !userMessage) {
        return NextResponse.json(
          { success: false, error: 'conversationId and userMessage required' },
          { status: 400 }
        );
      }

      const response = await chatEngine.chat(conversationId, userMessage);

      // Save message to database
      await supabase.from('chat_messages').insert({
        conversation_id: conversationId,
        user_id: userId,
        role: 'user',
        content: userMessage,
        created_at: new Date(),
      });

      // Save assistant response
      await supabase.from('chat_messages').insert({
        conversation_id: conversationId,
        user_id: userId,
        role: 'assistant',
        content: response.message,
        metadata: {
          sources: response.sources,
          confidence: response.confidence,
          followUpQuestions: response.followUpQuestions,
        },
        created_at: new Date(),
      });

      return NextResponse.json(
        {
          success: true,
          response: response,
          conversationId: conversationId,
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
    console.error('Chat API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/chat?conversationId=xxx
 * Get conversation history
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

    const conversation = await chatEngine.getConversation(conversationId);

    if (!conversation) {
      return NextResponse.json(
        { success: false, error: 'Conversation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        conversation: conversation,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Chat retrieval error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve conversation' },
      { status: 500 }
    );
  }
}
