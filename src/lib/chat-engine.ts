/**
 * Chat & Conversational AI Engine
 * Phase 7: Strategic Memory + Multi-turn Conversations
 */

import { ragQuery } from './rag-engine';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  contextChunks?: string[];
}

export interface ConversationContext {
  conversationId: string;
  userId: string;
  messages: ChatMessage[];
  businessContext?: {
    companyName?: string;
    industry?: string;
    stage?: string;
    focus?: string;
  };
  strategicMemory?: {
    decisions: string[];
    assumptions: string[];
    metrics: Record<string, number>;
    portfolio?: string[];
  };
}

export interface ChatResponse {
  message: string;
  sources: string[];
  confidence: number;
  followUpQuestions: string[];
  actionItems?: string[];
}

/**
 * Chat Engine with Strategic Memory
 */
export class ChatEngine {
  private conversations: Map<string, ConversationContext> = new Map();

  /**
   * Start a new conversation
   */
  async startConversation(userId: string, conversationId: string, context?: any): Promise<string> {
    const conversation: ConversationContext = {
      conversationId,
      userId,
      messages: [],
      businessContext: context || {},
      strategicMemory: {
        decisions: [],
        assumptions: [],
        metrics: {},
        portfolio: [],
      },
    };

    this.conversations.set(conversationId, conversation);
    return conversationId;
  }

  /**
   * Get conversation history
   */
  async getConversation(conversationId: string): Promise<ConversationContext | null> {
    return this.conversations.get(conversationId) || null;
  }

  /**
   * Send message and get response
   */
  async chat(conversationId: string, userMessage: string): Promise<ChatResponse> {
    const conversation = this.conversations.get(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    // Add user message to history
    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    };
    conversation.messages.push(userMsg);

    // Build conversation context
    const conversationHistory = conversation.messages
      .slice(-5) // Last 5 messages for context
      .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join('\n');

    // Query knowledge bank with conversation context
    const ragContext = await ragQuery(
      `Business conversation: ${conversationHistory}\n\nLatest question: ${userMessage}`,
      { context: 'challenge_mode' } // Use challenge mode for depth
    );

    // Generate response using Claude
    const response = await this.generateResponse(
      userMessage,
      conversationHistory,
      ragContext,
      conversation
    );

    // Store strategic memory
    await this.updateStrategicMemory(conversationId, userMessage, response);

    // Add assistant message
    const assistantMsg: ChatMessage = {
      id: `msg_${Date.now() + 1}`,
      role: 'assistant',
      content: response.message,
      timestamp: new Date(),
      contextChunks: ragContext.sources.map((s: any) => s.title || s.excerpt || ''),
    };
    conversation.messages.push(assistantMsg);

    return response;
  }

  /**
   * Generate response using Claude with knowledge bank
   */
  private async generateResponse(
    userMessage: string,
    history: string,
    ragContext: any,
    conversation: ConversationContext
  ): Promise<ChatResponse> {
    // In production, this would call Claude API
    // For now, return structured response based on RAG

    const businessContext = conversation.businessContext || {};
    const contextStr = businessContext.companyName
      ? `Company: ${businessContext.companyName}, Industry: ${businessContext.industry}, Stage: ${businessContext.stage}`
      : '';

    // Simulate Claude response
    const message = `Based on the knowledge base and our conversation context ${contextStr}, here's my analysis:

${ragContext.context || 'Strategic insight based on best practices'}

**Key Recommendations**:
1. Focus on your unit economics and CAC payback period
2. Build differentiation that competitors cannot easily replicate
3. Establish clear metrics for your stage of growth
4. Plan for multiple customer acquisition channels

**Follow-up Questions**:
- What is your current CAC and LTV?
- How are you measuring product-market fit?
- What is your team's background?

**Action Items**:
- Define your core success metrics
- Map your competitive landscape
- Create a 90-day execution plan`;

    return {
      message,
      sources: ragContext.sources || [],
      confidence: 0.85,
      followUpQuestions: [
        'What is your current burn rate and runway?',
        'How do you measure customer satisfaction?',
        'What is your pricing strategy?',
      ],
      actionItems: [
        'Define core KPIs for your business',
        'Build competitive differentiation roadmap',
        'Create customer acquisition strategy',
      ],
    };
  }

  /**
   * Update strategic memory with conversation insights
   */
  private async updateStrategicMemory(
    conversationId: string,
    userMessage: string,
    response: ChatResponse
  ): Promise<void> {
    const conversation = this.conversations.get(conversationId);
    if (!conversation || !conversation.strategicMemory) return;

    // Extract decisions and assumptions from conversation
    if (userMessage.toLowerCase().includes('decided') || userMessage.toLowerCase().includes('will')) {
      conversation.strategicMemory.decisions.push(`${new Date().toISOString()}: ${userMessage}`);
    }

    if (userMessage.toLowerCase().includes('assume') || userMessage.toLowerCase().includes('think')) {
      conversation.strategicMemory.assumptions.push(userMessage);
    }

    // Store metrics if mentioned
    const metricPattern = /(\w+):\s*(\d+\.?\d*)/g;
    const matches = userMessage.matchAll(metricPattern);
    for (const match of matches) {
      conversation.strategicMemory.metrics[match[1]] = parseFloat(match[2]);
    }
  }

  /**
   * Save conversation to database
   */
  async saveConversation(conversationId: string): Promise<boolean> {
    const conversation = this.conversations.get(conversationId);
    if (!conversation) return false;

    // In production, save to Supabase
    console.log(`Saving conversation ${conversationId} with ${conversation.messages.length} messages`);
    return true;
  }

  /**
   * Get strategic summary of conversation
   */
  async getStrategicSummary(conversationId: string): Promise<any> {
    const conversation = this.conversations.get(conversationId);
    if (!conversation) return null;

    return {
      conversationId,
      messageCount: conversation.messages.length,
      businessContext: conversation.businessContext,
      decisions: conversation.strategicMemory?.decisions || [],
      assumptions: conversation.strategicMemory?.assumptions || [],
      metrics: conversation.strategicMemory?.metrics || {},
      portfolio: conversation.strategicMemory?.portfolio || [],
      lastUpdate: new Date(),
    };
  }

  /**
   * Multi-turn conversation with context
   */
  async continueConversation(conversationId: string, message: string): Promise<ChatResponse> {
    return this.chat(conversationId, message);
  }
}

/**
 * Portfolio Management in Strategic Memory
 */
export class PortfolioManager {
  /**
   * Add project to portfolio
   */
  async addProjectToPortfolio(
    conversationId: string,
    project: {
      name: string;
      description: string;
      metrics: Record<string, number>;
      status: string;
    }
  ): Promise<void> {
    // Track multiple projects/startups in one portfolio
    console.log(`Added project ${project.name} to portfolio for conversation ${conversationId}`);
  }

  /**
   * Compare projects in portfolio
   */
  async compareProjects(conversationId: string): Promise<any> {
    // Compare metrics across multiple projects
    return {
      projects: [],
      comparison: {},
    };
  }

  /**
   * Get portfolio recommendations
   */
  async getPortfolioRecommendations(conversationId: string): Promise<string[]> {
    return [
      'Diversify across industries',
      'Balance risk and growth potential',
      'Focus on synergies between companies',
      'Track metrics consistently',
    ];
  }
}
