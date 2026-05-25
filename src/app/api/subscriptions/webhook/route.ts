import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key'
);

/**
 * PayPal Webhook Handler
 * This endpoint receives PayPal notifications about subscription events
 *
 * Handled events:
 * - BILLING.SUBSCRIPTION.CREATED
 * - BILLING.SUBSCRIPTION.UPDATED
 * - BILLING.SUBSCRIPTION.ACTIVATED
 * - BILLING.SUBSCRIPTION.SUSPENDED
 * - BILLING.SUBSCRIPTION.CANCELLED
 * - BILLING.SUBSCRIPTION.EXPIRED
 * - PAYMENT.SALE.COMPLETED
 * - PAYMENT.SALE.DENIED
 * - PAYMENT.CAPTURE.COMPLETED
 * - PAYMENT.CAPTURE.DENIED
 */

interface PayPalWebhookEvent {
  id: string;
  event_type: string;
  create_time: string;
  resource: {
    id: string;
    status?: string;
    subscriber?: {
      email_address: string;
    };
    plan_id?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

export async function POST(request: NextRequest) {
  try {
    const event: PayPalWebhookEvent = await request.json();

    // Log the webhook for debugging
    console.log('PayPal Webhook Event:', {
      id: event.id,
      event_type: event.event_type,
      resource_id: event.resource?.id,
    });

    // Verify webhook signature (simplified - implement full verification in production)
    // const isValid = await verifyWebhookSignature(request, event);
    // if (!isValid) {
    //   return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 401 });
    // }

    // Handle different event types
    switch (event.event_type) {
      case 'BILLING.SUBSCRIPTION.CREATED':
        return handleSubscriptionCreated(event);

      case 'BILLING.SUBSCRIPTION.ACTIVATED':
        return handleSubscriptionActivated(event);

      case 'BILLING.SUBSCRIPTION.SUSPENDED':
        return handleSubscriptionSuspended(event);

      case 'BILLING.SUBSCRIPTION.CANCELLED':
        return handleSubscriptionCancelled(event);

      case 'BILLING.SUBSCRIPTION.EXPIRED':
        return handleSubscriptionExpired(event);

      case 'PAYMENT.SALE.COMPLETED':
      case 'PAYMENT.CAPTURE.COMPLETED':
        return handlePaymentCompleted(event);

      case 'PAYMENT.SALE.DENIED':
      case 'PAYMENT.CAPTURE.DENIED':
        return handlePaymentDenied(event);

      default:
        // Acknowledge unknown events
        console.log('Unhandled webhook event type:', event.event_type);
        return NextResponse.json({ success: true, message: 'Event acknowledged' });
    }
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process webhook',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

async function handleSubscriptionCreated(event: PayPalWebhookEvent) {
  const subscriptionId = event.resource?.id;
  const status = event.resource?.status; // APPROVAL_PENDING, APPROVED

  console.log('Subscription created:', subscriptionId, 'Status:', status);

  // Update subscription status if it exists
  const { error } = await supabase
    .from('subscriptions')
    .update({
      status: status === 'APPROVAL_PENDING' ? 'APPROVAL_PENDING' : 'CREATED',
      updated_at: new Date().toISOString(),
    })
    .eq('paypal_subscription_id', subscriptionId);

  if (error) {
    console.error('Error updating subscription:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, message: 'Subscription created acknowledged' });
}

async function handleSubscriptionActivated(event: PayPalWebhookEvent) {
  const subscriptionId = event.resource?.id;
  const status = event.resource?.status; // ACTIVE

  console.log('Subscription activated:', subscriptionId);

  const { error } = await supabase
    .from('subscriptions')
    .update({
      status: 'ACTIVE',
      trial_used: true, // Trial period is over when subscription activates
      updated_at: new Date().toISOString(),
    })
    .eq('paypal_subscription_id', subscriptionId);

  if (error) {
    console.error('Error updating subscription:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: 'Subscription activated acknowledged',
  });
}

async function handleSubscriptionSuspended(event: PayPalWebhookEvent) {
  const subscriptionId = event.resource?.id;

  console.log('Subscription suspended:', subscriptionId);

  const { error } = await supabase
    .from('subscriptions')
    .update({
      status: 'SUSPENDED',
      updated_at: new Date().toISOString(),
    })
    .eq('paypal_subscription_id', subscriptionId);

  if (error) {
    console.error('Error updating subscription:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: 'Subscription suspended acknowledged',
  });
}

async function handleSubscriptionCancelled(event: PayPalWebhookEvent) {
  const subscriptionId = event.resource?.id;

  console.log('Subscription cancelled:', subscriptionId);

  const now = new Date();

  const { error } = await supabase
    .from('subscriptions')
    .update({
      status: 'CANCELLED',
      cancelled_at: now.toISOString(),
      end_date: now.toISOString(),
      cancellation_reason: 'User cancelled via PayPal',
      updated_at: now.toISOString(),
    })
    .eq('paypal_subscription_id', subscriptionId);

  if (error) {
    console.error('Error updating subscription:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: 'Subscription cancelled acknowledged',
  });
}

async function handleSubscriptionExpired(event: PayPalWebhookEvent) {
  const subscriptionId = event.resource?.id;

  console.log('Subscription expired:', subscriptionId);

  const now = new Date();

  const { error } = await supabase
    .from('subscriptions')
    .update({
      status: 'EXPIRED',
      end_date: now.toISOString(),
      updated_at: now.toISOString(),
    })
    .eq('paypal_subscription_id', subscriptionId);

  if (error) {
    console.error('Error updating subscription:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: 'Subscription expired acknowledged',
  });
}

async function handlePaymentCompleted(event: PayPalWebhookEvent) {
  const transactionId = event.resource?.id;
  const amount = event.resource?.amount?.value;
  const currency = event.resource?.amount?.currency_code;

  console.log('Payment completed:', transactionId, amount, currency);

  // Get subscription ID from the resource
  const subscriptionId = event.resource?.links?.find(
    (link: any) => link.rel === 'up'
  )?.href?.split('/')?.pop();

  // Find subscription by PayPal subscription ID if available
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('id, user_id')
    .eq('paypal_subscription_id', subscriptionId)
    .single();

  if (subscription) {
    // Create payment history record
    const { error } = await supabase
      .from('payment_history')
      .insert([
        {
          user_id: subscription.user_id,
          subscription_id: subscription.id,
          paypal_transaction_id: transactionId,
          amount_value: amount,
          amount_currency_code: currency || 'USD',
          status: 'COMPLETED',
          payment_method: 'paypal',
          transaction_date: event.create_time,
          completed_at: new Date().toISOString(),
          metadata: {
            webhook_event_id: event.id,
          },
        },
      ]);

    if (error) {
      console.error('Error recording payment:', error);
    }
  }

  return NextResponse.json({
    success: true,
    message: 'Payment completed acknowledged',
  });
}

async function handlePaymentDenied(event: PayPalWebhookEvent) {
  const transactionId = event.resource?.id;

  console.log('Payment denied:', transactionId);

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('id, user_id')
    .limit(1)
    .single();

  if (subscription) {
    // Create payment history record for failed payment
    const { error } = await supabase
      .from('payment_history')
      .insert([
        {
          user_id: subscription.user_id,
          subscription_id: subscription.id,
          paypal_transaction_id: transactionId,
          amount_value: event.resource?.amount?.value || 0,
          amount_currency_code: event.resource?.amount?.currency_code || 'USD',
          status: 'FAILED',
          payment_method: 'paypal',
          transaction_date: event.create_time,
          error_message: event.resource?.reason_code || 'Payment denied by PayPal',
          metadata: {
            webhook_event_id: event.id,
            failed: true,
          },
        },
      ]);

    if (error) {
      console.error('Error recording failed payment:', error);
    }
  }

  return NextResponse.json({
    success: true,
    message: 'Payment denied acknowledged',
  });
}

/**
 * Verify PayPal webhook signature (simplified version)
 * In production, implement full verification with PayPal's signature verification
 */
async function verifyWebhookSignature(
  request: NextRequest,
  event: PayPalWebhookEvent
): Promise<boolean> {
  // TODO: Implement full signature verification with PayPal
  // https://developer.paypal.com/docs/api-basics/notifications/webhooks/verify-signature/
  return true;
}
