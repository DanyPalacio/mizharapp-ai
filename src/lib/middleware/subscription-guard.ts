import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key'
);

/**
 * Guard middleware to check if user has active Pro subscription
 * Use in API routes that require Pro tier
 */
export async function requireProSubscription(
  request: NextRequest,
  userId: string
) {
  try {
    // Check if user has active Pro subscription
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('id, status, tier')
      .eq('user_id', userId)
      .eq('status', 'ACTIVE')
      .eq('tier', 'pro')
      .limit(1)
      .single();

    if (error || !subscription) {
      return NextResponse.json(
        {
          success: false,
          error: 'This feature requires a Pro subscription',
          upgrade_url: '/pricing',
        },
        { status: 403 }
      );
    }

    return null; // Access granted
  } catch (error) {
    console.error('Error checking subscription:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to verify subscription',
      },
      { status: 500 }
    );
  }
}

/**
 * Guard middleware to check feature access based on tier
 */
export async function checkFeatureAccess(
  request: NextRequest,
  userId: string,
  requiredFeature: string
) {
  try {
    // Get user's subscription
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('tier')
      .eq('user_id', userId)
      .eq('status', 'ACTIVE')
      .limit(1)
      .single();

    const tier = subscription?.tier || 'free';

    // Define feature access matrix
    const proFeatures = [
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
    ];

    const hasAccess = tier === 'pro' || !proFeatures.includes(requiredFeature);

    if (!hasAccess) {
      return NextResponse.json(
        {
          success: false,
          error: `Feature "${requiredFeature}" is only available for Pro subscribers`,
          upgrade_url: '/pricing',
        },
        { status: 403 }
      );
    }

    return null; // Access granted
  } catch (error) {
    console.error('Error checking feature access:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to verify access',
      },
      { status: 500 }
    );
  }
}

/**
 * Guard middleware to check usage limits
 */
export async function checkUsageLimit(
  request: NextRequest,
  userId: string,
  feature: string
) {
  try {
    // Get user's subscription tier
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('tier')
      .eq('user_id', userId)
      .eq('status', 'ACTIVE')
      .limit(1)
      .single();

    const tier = subscription?.tier || 'free';

    // Pro users have unlimited usage
    if (tier === 'pro') {
      return null;
    }

    // Get usage limits
    const { data: usage, error } = await supabase
      .from('usage_limits')
      .select(`max_${feature}, ${feature}`)
      .eq('user_id', userId)
      .single();

    if (error || !usage) {
      // If no usage record, allow (it will be created on next usage)
      return null;
    }

    const featureKey = feature;
    const maxKey = `max_${feature}`;

    const used = usage[featureKey] || 0;
    const limit = usage[maxKey] || 0;

    if (used >= limit) {
      return NextResponse.json(
        {
          success: false,
          error: `Monthly usage limit reached for ${feature}`,
          used,
          limit,
          upgrade_url: '/pricing',
        },
        { status: 429 }
      );
    }

    return null; // Usage within limits
  } catch (error) {
    console.error('Error checking usage limit:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to verify usage limits',
      },
      { status: 500 }
    );
  }
}
