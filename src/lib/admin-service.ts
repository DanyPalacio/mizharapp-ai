/**
 * Admin Service
 * Phase 5: Admin Panel - User & Knowledge Management
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key'
);

/**
 * User Management
 */
export class AdminUserService {
  /**
   * Get all users with subscription data
   */
  async getAllUsers(limit = 50, offset = 0) {
    try {
      const { data, error, count } = await supabase
        .from('users')
        .select(
          `
          id,
          email,
          created_at,
          updated_at,
          subscriptions (
            id,
            tier,
            status,
            trial_end_date,
            next_billing_date,
            paypal_subscription_id
          ),
          usage_limits (
            business_plans,
            swot_analyses,
            tam_calculator,
            investor_readiness,
            viability_score,
            ebitda_estimator,
            startup_naming,
            business_models,
            financial_projections
          )
        `,
          { count: 'exact' }
        )
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      return {
        users: data || [],
        total: count || 0,
        page: Math.floor(offset / limit) + 1,
        pageSize: limit,
      };
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  /**
   * Get user details with all related data
   */
  async getUserDetails(userId: string) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select(
          `
          *,
          subscriptions (*),
          payment_history (*),
          usage_limits (*),
          user_preferences (*)
        `
        )
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user details:', error);
      throw error;
    }
  }

  /**
   * Update user subscription manually
   */
  async updateUserSubscription(
    userId: string,
    tier: 'free' | 'pro',
    status: string,
    trialEndDate?: Date
  ) {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .upsert(
          {
            user_id: userId,
            tier,
            status,
            trial_end_date: trialEndDate,
            updated_at: new Date(),
          },
          { onConflict: 'user_id' }
        )
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }
  }

  /**
   * Deactivate user account
   */
  async deactivateUser(userId: string) {
    try {
      // Deactivate subscriptions
      await supabase
        .from('subscriptions')
        .update({ status: 'CANCELLED' })
        .eq('user_id', userId);

      // Delete user
      // Note: In production, soft delete is safer
      const { error } = await supabase.auth.admin.deleteUser(userId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deactivating user:', error);
      throw error;
    }
  }

  /**
   * Get subscription analytics
   */
  async getSubscriptionAnalytics() {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('tier, status, created_at');

      if (error) throw error;

      // Calculate metrics
      const total = data?.length || 0;
      const proCount = data?.filter((s) => s.tier === 'pro').length || 0;
      const freeCount = total - proCount;
      const activeCount = data?.filter((s) => s.status === 'ACTIVE').length || 0;

      const mrr = proCount * 29.99; // $29.99/month per Pro subscriber

      return {
        totalUsers: total,
        freeUsers: freeCount,
        proUsers: proCount,
        conversionRate: ((proCount / total) * 100).toFixed(2) + '%',
        activeSubscriptions: activeCount,
        monthlyRecurringRevenue: mrr.toFixed(2),
        averageRevenuePerUser: (mrr / total).toFixed(2),
      };
    } catch (error) {
      console.error('Error fetching subscription analytics:', error);
      throw error;
    }
  }
}

/**
 * Knowledge Bank Management
 */
export class AdminKnowledgeService {
  /**
   * Get all knowledge sources
   */
  async getAllSources(limit = 50, offset = 0) {
    try {
      const { data, error, count } = await supabase
        .from('knowledge_sources')
        .select(
          `
          id,
          name,
          url,
          category,
          chunk_count,
          quality_score,
          created_at,
          updated_at
        `,
          { count: 'exact' }
        )
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      return {
        sources: data || [],
        total: count || 0,
        page: Math.floor(offset / limit) + 1,
        pageSize: limit,
      };
    } catch (error) {
      console.error('Error fetching sources:', error);
      throw error;
    }
  }

  /**
   * Create new knowledge source
   */
  async createSource(source: {
    name: string;
    url: string;
    category: string;
    description: string;
  }) {
    try {
      const { data, error } = await supabase
        .from('knowledge_sources')
        .insert([
          {
            name: source.name,
            url: source.url,
            category: source.category,
            description: source.description,
            chunk_count: 0,
            quality_score: 0.5,
            created_at: new Date(),
            updated_at: new Date(),
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating source:', error);
      throw error;
    }
  }

  /**
   * Update source quality score
   */
  async updateSourceQuality(sourceId: string, qualityScore: number) {
    try {
      const { data, error } = await supabase
        .from('knowledge_sources')
        .update({
          quality_score: Math.max(0, Math.min(1, qualityScore)),
          updated_at: new Date(),
        })
        .eq('id', sourceId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating source quality:', error);
      throw error;
    }
  }

  /**
   * Delete source and its chunks
   */
  async deleteSource(sourceId: string) {
    try {
      // Delete chunks first
      await supabase.from('knowledge_chunks').delete().eq('source_id', sourceId);

      // Delete source
      await supabase.from('knowledge_sources').delete().eq('id', sourceId);

      return { success: true };
    } catch (error) {
      console.error('Error deleting source:', error);
      throw error;
    }
  }

  /**
   * Get knowledge bank statistics
   */
  async getKnowledgeStats() {
    try {
      const { data: sources } = await supabase
        .from('knowledge_sources')
        .select('id, name, chunk_count, quality_score');

      const { data: chunks } = await supabase
        .from('knowledge_chunks')
        .select('id, usage_count');

      const totalChunks = chunks?.length || 0;
      const totalSources = sources?.length || 0;
      const avgChunksPerSource = totalSources > 0 ? (totalChunks / totalSources).toFixed(1) : '0';
      const avgQualityScore = sources
        ? (
            sources.reduce((sum, s) => sum + (s.quality_score || 0), 0) / sources.length
          ).toFixed(2)
        : '0';
      const totalUsage = chunks?.reduce((sum, c) => sum + (c.usage_count || 0), 0) || 0;

      return {
        totalChunks,
        totalSources,
        avgChunksPerSource,
        avgQualityScore,
        totalUsage,
        lastUpdated: new Date(),
      };
    } catch (error) {
      console.error('Error fetching knowledge stats:', error);
      throw error;
    }
  }

  /**
   * Get most-used knowledge chunks
   */
  async getPopularChunks(limit = 10) {
    try {
      const { data, error } = await supabase
        .from('knowledge_chunks')
        .select('id, title, usage_count, quality_score')
        .order('usage_count', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching popular chunks:', error);
      return [];
    }
  }
}

/**
 * Analytics & Reporting
 */
export class AdminAnalyticsService {
  /**
   * Get usage analytics by tool
   */
  async getToolUsageAnalytics() {
    try {
      const { data, error } = await supabase
        .from('usage_limits')
        .select(
          'business_plans, swot_analyses, tam_calculator, investor_readiness, viability_score, ebitda_estimator, startup_naming, business_models, financial_projections'
        );

      if (error) throw error;

      // Aggregate usage
      const usage: Record<string, number> = {
        'Business Plans': 0,
        'SWOT Analysis': 0,
        'TAM Calculator': 0,
        'Investor Readiness': 0,
        'Viability Score': 0,
        'EBITDA Estimator': 0,
        'Startup Naming': 0,
        'Business Models': 0,
        'Financial Projections': 0,
      };

      if (data) {
        data.forEach((row: any) => {
          usage['Business Plans'] += row.business_plans || 0;
          usage['SWOT Analysis'] += row.swot_analyses || 0;
          usage['TAM Calculator'] += row.tam_calculator || 0;
          usage['Investor Readiness'] += row.investor_readiness || 0;
          usage['Viability Score'] += row.viability_score || 0;
          usage['EBITDA Estimator'] += row.ebitda_estimator || 0;
          usage['Startup Naming'] += row.startup_naming || 0;
          usage['Business Models'] += row.business_models || 0;
          usage['Financial Projections'] += row.financial_projections || 0;
        });
      }

      return usage;
    } catch (error) {
      console.error('Error fetching tool usage:', error);
      return {};
    }
  }

  /**
   * Get revenue analytics
   */
  async getRevenueAnalytics() {
    try {
      const { data, error } = await supabase
        .from('payment_history')
        .select('status, amount, created_at');

      if (error) throw error;

      // Calculate metrics
      const total = data || [];
      const completed = total.filter((p) => p.status === 'completed');
      const totalRevenue = completed.reduce((sum, p) => sum + (p.amount || 0), 0);
      const avgTransactionValue = completed.length > 0 ? (totalRevenue / completed.length).toFixed(2) : '0';

      return {
        totalPayments: total.length,
        completedPayments: completed.length,
        totalRevenue: totalRevenue.toFixed(2),
        avgTransactionValue,
        failureRate: (((total.length - completed.length) / total.length) * 100).toFixed(1) + '%',
      };
    } catch (error) {
      console.error('Error fetching revenue analytics:', error);
      throw error;
    }
  }

  /**
   * Get daily active users
   */
  async getDailyActiveUsers(days = 7) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // This would require tracking user sessions/activity
      // Placeholder for actual implementation
      return {
        period: `Last ${days} days`,
        dau: Math.floor(Math.random() * 1000) + 100, // Placeholder
        trend: 'increasing',
      };
    } catch (error) {
      console.error('Error fetching DAU:', error);
      throw error;
    }
  }
}

/**
 * Unified Admin Service
 */
export class AdminService {
  users = new AdminUserService();
  knowledge = new AdminKnowledgeService();
  analytics = new AdminAnalyticsService();

  /**
   * Get comprehensive admin dashboard data
   */
  async getDashboardData() {
    try {
      const [userStats, knowledgeStats, toolUsage, revenueStats] = await Promise.all([
        this.users.getSubscriptionAnalytics(),
        this.knowledge.getKnowledgeStats(),
        this.analytics.getToolUsageAnalytics(),
        this.analytics.getRevenueAnalytics(),
      ]);

      return {
        users: userStats,
        knowledge: knowledgeStats,
        toolUsage,
        revenue: revenueStats,
        lastUpdated: new Date(),
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  }
}
