import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key'
);

interface CreateSubscriptionRequest {
  paypal_subscription_id: string;
  plan_id: string;
  user_id?: string; // Optional, will use auth.uid() if not provided
}

/**
 * POST /api/subscriptions/create
 * Create a subscription record in the database after PayPal approval
 *
 * This endpoint is called from the PayPal button onApprove callback
 * It stores the PayPal subscription ID and creates the necessary database records
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreateSubscriptionRequest = await request.json();

    const {
      paypal_subscription_id,
      plan_id,
      user_id,
    } = body;

    // Validate inputs
    if (!paypal_subscription_id || !plan_id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: paypal_subscription_id, plan_id',
        },
        { status: 400 }
      );
    }

    // Get the current user from the auth header
    const authHeader = request.headers.get('authorization');
    if (!authHeader && !user_id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Authentication required. Please log in to create a subscription.',
        },
        { status: 401 }
      );
    }

    // Determine the user ID
    let currentUserId = user_id;
    if (!currentUserId && authHeader) {
      // Extract user ID from JWT token (simplified - in production, use proper JWT verification)
      const token = authHeader.replace('Bearer ', '');
      const { data: userData, error: userError } = await supabase.auth.getUser(token);

      if (userError || !userData.user) {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid authentication token',
          },
          { status: 401 }
        );
      }
      currentUserId = userData.user.id;
    }

    // Check if subscription already exists for this PayPal subscription ID
    const { data: existingSubscription } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('paypal_subscription_id', paypal_subscription_id)
      .single();

    if (existingSubscription) {
      return NextResponse.json(
        {
          success: false,
          error: 'Subscription already exists',
          subscription_id: existingSubscription.id,
        },
        { status: 409 }
      );
    }

    // Determine subscription tier based on plan_id
    const tier = determineTier(plan_id);

    // Calculate trial dates (5 days for Pro)
    const now = new Date();
    const trialEndDate = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000); // 5 days from now
    const nextBillingDate = new Date(trialEndDate);
    nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

    // Create subscription record
    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .insert([
        {
          user_id: currentUserId,
          paypal_subscription_id,
          paypal_plan_id: plan_id,
          tier,
          status: 'ACTIVE',
          amount_value: tier === 'pro' ? 29.99 : 0,
          amount_currency_code: 'USD',
          trial_start_date: now.toISOString(),
          trial_end_date: trialEndDate.toISOString(),
          trial_used: false,
          start_date: now.toISOString(),
          next_billing_date: nextBillingDate.toISOString(),
          billing_frequency: 'MONTH',
          metadata: {
            source: 'paypal',
            created_from_api: true,
          },
        },
      ])
      .select()
      .single();

    if (subscriptionError) {
      console.error('Error creating subscription:', subscriptionError);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to create subscription record',
          details: subscriptionError.message,
        },
        { status: 500 }
      );
    }

    // Update user's subscription status in the users table
    const { error: userUpdateError } = await supabase
      .from('users')
      .update({
        updated_at: new Date().toISOString(),
      })
      .eq('id', currentUserId);

    if (userUpdateError) {
      console.warn('Warning: Could not update user record:', userUpdateError);
      // Don't fail the entire request if user update fails
    }

    // Log the payment history
    const { error: paymentError } = await supabase
      .from('payment_history')
      .insert([
        {
          user_id: currentUserId,
          subscription_id: subscription.id,
          paypal_transaction_id: `INITIAL_${paypal_subscription_id}`,
          amount_value: 0, // Trial period starts, no charge yet
          amount_currency_code: 'USD',
          status: 'PENDING',
          payment_method: 'paypal',
          transaction_date: now.toISOString(),
          notes: `Subscription created - ${tier} tier with 5-day trial`,
          billing_period_start: now.toISOString(),
          billing_period_end: trialEndDate.toISOString(),
          metadata: {
            trial: true,
            initial_subscription: true,
          },
        },
      ]);

    if (paymentError) {
      console.warn('Warning: Could not create payment history:', paymentError);
      // Don't fail the entire request
    }

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Subscription created successfully',
        subscription: {
          id: subscription.id,
          paypal_subscription_id,
          tier,
          status: subscription.status,
          trial_end_date: subscription.trial_end_date,
          next_billing_date: subscription.next_billing_date,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating subscription:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Determine subscription tier based on PayPal plan ID
 */
function determineTier(plan_id: string): 'free' | 'pro' {
  // This should match your PayPal plan IDs
  const proPlans = [
    'P-5BC97589SB7542152NIIPEWI', // Main Pro plan
  ];

  return proPlans.includes(plan_id) ? 'pro' : 'free';
}
