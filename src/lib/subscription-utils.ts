import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

/**
 * Subscription types and tier definitions
 */
export type SubscriptionTier = 'free' | 'pro';

export interface SubscriptionDetails {
  tier: SubscriptionTier;
  status: string;
  trialEndDate: Date | null;
  nextBillingDate: Date | null;
  isTrialActive: boolean;
  isPaid: boolean;
  canAccessFeature: (feature: string) => boolean;
}

/**
 * Feature access matrix by tier
 */
const FEATURE_ACCESS: Record<SubscriptionTier, Set<string>> = {
  free: new Set([
    'business_plan_generator',
    'swot_generator',
    'tam_calculator',
    'investor_readiness_checker',
    'viability_score',
    'ebitda_estimator',
    'naming_tool',
    'business_model_generator',
    'financial_projections',
    'case_database',
    'blog_posts',
  ]),
  pro: new Set([
    // All free features
    'business_plan_generator',
    'swot_generator',
    'tam_calculator',
    'investor_readiness_checker',
    'viability_score',
    'ebitda_estimator',
    'naming_tool',
    'business_model_generator',
    'financial_projections',
    'case_database',
    'blog_posts',
    // Pro-only features
    'challenge_mode',
    'strategic_rewrite',
    'simulations',
    'founder_intelligence',
    'financial_intelligence',
    'investor_simulations',
    'strategic_memory',
    'scenario_planning',
    'export_templates',
    'live_api_integrations',
    'advanced_analytics',
    'team_collaboration',
    'api_access',
  ]),
};

/**
 * Get current user's subscription details
 */
export async function getUserSubscription(userId: string): Promise<SubscriptionDetails | null> {
  try {
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'ACTIVE')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !subscription) {
      // User has no active subscription, return free tier
      return {
        tier: 'free',
        status: 'free_tier',
        trialEndDate: null,
        nextBillingDate: null,
        isTrialActive: false,
        isPaid: false,
        canAccessFeature: (feature: string) =>
          FEATURE_ACCESS['free'].has(feature),
      };
    }

    const now = new Date();
    const trialEndDate = subscription.trial_end_date
      ? new Date(subscription.trial_end_date)
      : null;
    const isTrialActive = trialEndDate ? now < trialEndDate : false;
    const nextBillingDate = subscription.next_billing_date
      ? new Date(subscription.next_billing_date)
      : null;

    return {
      tier: subscription.tier || 'pro',
      status: subscription.status,
      trialEndDate,
      nextBillingDate,
      isTrialActive,
      isPaid: subscription.status === 'ACTIVE' && !isTrialActive,
      canAccessFeature: (feature: string) =>
        FEATURE_ACCESS[subscription.tier || 'pro']?.has(feature) || false,
    };
  } catch (error) {
    console.error('Error getting subscription:', error);
    return null;
  }
}

/**
 * Check if user has access to a specific feature
 */
export async function canUserAccessFeature(
  userId: string,
  feature: string
): Promise<boolean> {
  const subscription = await getUserSubscription(userId);
  return subscription?.canAccessFeature(feature) || false;
}

/**
 * Check subscription status
 */
export async function isSubscriptionActive(userId: string): Promise<boolean> {
  try {
    const { data } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('user_id', userId)
      .eq('status', 'ACTIVE')
      .limit(1)
      .single();

    return !!data;
  } catch (error) {
    return false;
  }
}

/**
 * Get usage stats for a user
 */
export async function getUserUsageStats(userId: string) {
  try {
    const { data, error } = await supabase
      .from('usage_limits')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      businessPlans: {
        used: data.business_plans_generated,
        limit: data.max_business_plans,
        remaining: data.max_business_plans - data.business_plans_generated,
      },
      swotAnalyses: {
        used: data.swot_analyses,
        limit: data.max_swot,
        remaining: data.max_swot - data.swot_analyses,
      },
      tamCalculations: {
        used: data.tam_calculations,
        limit: data.max_tam,
        remaining: data.max_tam - data.tam_calculations,
      },
      investorChecks: {
        used: data.investor_readiness_checks,
        limit: data.max_investor_checks,
        remaining:
          data.max_investor_checks - data.investor_readiness_checks,
      },
      viabilityScores: {
        used: data.viability_scores,
        limit: data.max_viability,
        remaining: data.max_viability - data.viability_scores,
      },
      ebitdaEstimates: {
        used: data.ebitda_estimates,
        limit: data.max_ebitda,
        remaining: data.max_ebitda - data.ebitda_estimates,
      },
      names: {
        used: data.naming_suggestions,
        limit: data.max_names,
        remaining: data.max_names - data.naming_suggestions,
      },
      models: {
        used: data.business_models,
        limit: data.max_models,
        remaining: data.max_models - data.business_models,
      },
      financialProjections: {
        used: data.financial_projections,
        limit: data.max_financials,
        remaining: data.max_financials - data.financial_projections,
      },
    };
  } catch (error) {
    console.error('Error getting usage stats:', error);
    return null;
  }
}

/**
 * Increment usage counter for a feature
 */
export async function incrementUsage(userId: string, feature: string): Promise<boolean> {
  try {
    const featureMap: Record<string, string> = {
      business_plan_generator: 'business_plans_generated',
      swot_generator: 'swot_analyses',
      tam_calculator: 'tam_calculations',
      investor_readiness_checker: 'investor_readiness_checks',
      viability_score: 'viability_scores',
      ebitda_estimator: 'ebitda_estimates',
      naming_tool: 'naming_suggestions',
      business_model_generator: 'business_models',
      financial_projections: 'financial_projections',
    };

    const column = featureMap[feature];
    if (!column) {
      console.warn(`Unknown feature for usage tracking: ${feature}`);
      return false;
    }

    const { error } = await supabase.rpc('increment_usage', {
      p_user_id: userId,
      p_column: column,
    });

    if (error) {
      console.error('Error incrementing usage:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error incrementing usage:', error);
    return false;
  }
}

/**
 * Check if user has reached usage limit for a feature
 */
export async function hasReachedUsageLimit(
  userId: string,
  feature: string
): Promise<boolean> {
  const subscription = await getUserSubscription(userId);
  if (subscription?.tier === 'pro') {
    return false; // Pro users have unlimited usage
  }

  const stats = await getUserUsageStats(userId);
  if (!stats) return false;

  const featureStats: any = {
    business_plan_generator: stats.businessPlans,
    swot_generator: stats.swotAnalyses,
    tam_calculator: stats.tamCalculations,
    investor_readiness_checker: stats.investorChecks,
    viability_score: stats.viabilityScores,
    ebitda_estimator: stats.ebitdaEstimates,
    naming_tool: stats.names,
    business_model_generator: stats.models,
    financial_projections: stats.financialProjections,
  }[feature];

  return featureStats ? featureStats.remaining <= 0 : false;
}

/**
 * Get subscription status summary for dashboard
 */
export async function getSubscriptionSummary(userId: string) {
  try {
    const subscription = await getUserSubscription(userId);
    const stats = await getUserUsageStats(userId);

    return {
      subscription: {
        tier: subscription?.tier || 'free',
        status: subscription?.status || 'free_tier',
        isTrialActive: subscription?.isTrialActive || false,
        trialEndDate: subscription?.trialEndDate,
        nextBillingDate: subscription?.nextBillingDate,
      },
      usage: stats,
    };
  } catch (error) {
    console.error('Error getting subscription summary:', error);
    return null;
  }
}
