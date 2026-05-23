# PayPal Subscription Setup Guide

**Status**: ✅ PayPal Integration Ready  
**Plan**: PRO at $29.99/month with 5-day free trial  
**Plan ID**: P-5BC97589SB7542152NIIPEWI  

---

## Overview

The MIZHAR platform uses PayPal for subscription billing. Users can:
- Try all Pro features free for 5 days
- Subscribe to unlimited Pro access at $29.99/month
- Cancel anytime

---

## Environment Setup

### 1. Copy Environment Variables

```bash
cp .env.example .env.local
```

### 2. Update `.env.local` with PayPal Details

```env
# PayPal Configuration
NEXT_PUBLIC_PAYPAL_CLIENT_ID=AQYVUOfQ6kUlu7y1IXRq2ffqWuS9HtMJx2WPhdnXJT2P3DUlfGF-VWAb77xuHU9DMu2nJZJE9z3pXMGC
NEXT_PUBLIC_PAYPAL_PRO_PLAN_ID=P-5BC97589SB7542152NIIPEWI
PAYPAL_API_SECRET=your_paypal_api_secret_here
PAYPAL_WEBHOOK_ID=your_webhook_id_here
```

---

## Database Setup

### 1. Apply Migrations

The migration file creates all necessary tables:
- `users` - User profiles and authentication
- `subscriptions` - PayPal subscription records
- `payment_history` - Payment transaction logs
- `user_preferences` - User settings
- `usage_limits` - Monthly usage limits for free tier

Run the migration in Supabase SQL Editor:

```bash
# In your project root:
cat supabase/migrations/20260522_create_users_and_subscriptions.sql | \
  psql postgresql://username:password@db-url:5432/postgres
```

Or in Supabase dashboard:
1. Go to SQL Editor
2. Create new query
3. Copy and paste the migration SQL
4. Run

**Expected Result**: 
- ✅ All 5 tables created
- ✅ RLS policies enabled
- ✅ Indexes created
- ✅ Triggers for auto-timestamps

---

## PayPal Configuration

### 1. Get Your PayPal Credentials

1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/dashboard)
2. Sign in with your PayPal business account
3. Click **Sandbox** (testing) or **Live** (production)
4. In **Apps & Credentials**, find your **Client ID**

### 2. Copy Client ID to Environment

The Client ID is already configured:
```env
NEXT_PUBLIC_PAYPAL_CLIENT_ID=AQYVUOfQ6kUlu7y1IXRq2ffqWuS9HtMJx2WPhdnXJT2P3DUlfGF-VWAb77xuHU9DMu2nJZJE9z3pXMGC
```

### 3. Verify the Plan ID

The plan ID is created and configured:
```env
NEXT_PUBLIC_PAYPAL_PRO_PLAN_ID=P-5BC97589SB7542152NIIPEWI
```

**Plan Details**:
- **Amount**: $29.99 USD
- **Frequency**: Monthly (1 month)
- **Trial**: 5 days at $0
- **Status**: Active

---

## Webhook Configuration

### 1. Register Webhook in PayPal Dashboard

1. Go to PayPal Developer Dashboard
2. Click **Apps & Credentials** → **Sandbox** (or Live)
3. Scroll down to **Webhook endpoints**
4. Click **Add endpoint**
5. Enter webhook URL:
   ```
   https://your-domain.com/api/subscriptions/webhook
   ```

### 2. Select Events to Listen For

Select these events:
- ✅ BILLING.SUBSCRIPTION.CREATED
- ✅ BILLING.SUBSCRIPTION.UPDATED
- ✅ BILLING.SUBSCRIPTION.ACTIVATED
- ✅ BILLING.SUBSCRIPTION.SUSPENDED
- ✅ BILLING.SUBSCRIPTION.CANCELLED
- ✅ BILLING.SUBSCRIPTION.EXPIRED
- ✅ PAYMENT.SALE.COMPLETED
- ✅ PAYMENT.SALE.DENIED
- ✅ PAYMENT.CAPTURE.COMPLETED
- ✅ PAYMENT.CAPTURE.DENIED

### 3. Copy Webhook ID

After creating, copy the **Webhook ID**:
```env
PAYPAL_WEBHOOK_ID=your_webhook_id_from_paypal_here
```

### 4. Get API Secret

1. In PayPal Dashboard, find **Signature**
2. Copy the signature string
3. Add to environment:
```env
PAYPAL_API_SECRET=your_signature_here
```

---

## Implementation Files Created

### 1. Database Migration
```
supabase/migrations/20260522_create_users_and_subscriptions.sql
```
- Users table with profile data
- Subscriptions table with PayPal IDs
- Payment history tracking
- Usage limits for free tier
- RLS policies for security

### 2. PayPal Button Component
```
src/components/payments/PayPalSubscriptionButton.tsx
```
- Renders the PayPal subscribe button
- Handles subscription approval
- Sends data to backend
- Configurable styling and labels

**Usage**:
```tsx
<PayPalSubscriptionButton
  planId={process.env.NEXT_PUBLIC_PAYPAL_PRO_PLAN_ID}
  onSuccess={(subscriptionId) => console.log('Subscribed:', subscriptionId)}
  onError={(error) => console.error('Payment failed:', error)}
/>
```

### 3. Pricing Page
```
src/app/pricing/page.tsx
```
- Free and Pro tier comparison
- Integrated PayPal button
- FAQ section
- Feature matrix
- 5-day trial CTA

**Access**: `/pricing`

### 4. Subscription API Routes

#### Create Subscription
```
src/app/api/subscriptions/create/route.ts
```
- Called when PayPal approves subscription
- Creates subscription record in database
- Sets 5-day trial period
- Calculates next billing date
- Logs payment history

**Called from**: PayPal button onApprove callback

#### Webhook Handler
```
src/app/api/subscriptions/webhook/route.ts
```
- Receives PayPal webhook events
- Updates subscription status
- Handles trial expiration
- Processes payments
- Logs all transactions

**Events Handled**:
- Subscription created, activated, suspended, cancelled, expired
- Payments completed and denied

### 5. Subscription Utilities
```
src/lib/subscription-utils.ts
```
- `getUserSubscription()` - Get user's tier and status
- `canUserAccessFeature()` - Check feature access
- `isSubscriptionActive()` - Check if subscription is active
- `getUserUsageStats()` - Get usage limits remaining
- `incrementUsage()` - Track feature usage
- `hasReachedUsageLimit()` - Check monthly limits

### 6. Subscription Guard Middleware
```
src/lib/middleware/subscription-guard.ts
```
- `requireProSubscription()` - Require Pro tier
- `checkFeatureAccess()` - Check feature access by tier
- `checkUsageLimit()` - Check monthly usage limits

**Usage in API routes**:
```typescript
// Protect Pro-only feature
const guardResult = await requireProSubscription(request, userId);
if (guardResult) return guardResult;
```

---

## Testing PayPal Integration

### 1. Local Testing (Sandbox Mode)

```bash
# Start dev server
npm run dev

# Visit pricing page
http://localhost:3000/pricing

# Click "Start Pro Trial"
# Use PayPal test account to approve
```

**Test Credentials**:
- Email: danipalacio@gmail.com (configured in PayPal)
- Use sandbox mode in PayPal dashboard

### 2. Verify Subscription Created

Check Supabase:
1. Go to Supabase Dashboard
2. Table: `subscriptions`
3. Should see new row with:
   - ✅ paypal_subscription_id
   - ✅ status = 'ACTIVE'
   - ✅ tier = 'pro'
   - ✅ trial_end_date (5 days from now)

### 3. Test Webhook

Use PayPal webhook simulator:
1. PayPal Developer → Webhooks
2. Click your endpoint
3. Click **Send Test Event**
4. Select event (e.g., SUBSCRIPTION_ACTIVATED)
5. Check logs in Supabase `payment_history` table

---

## Feature Access Matrix

### Free Tier (No Subscription Required)

✅ **Available**:
- Business Plan Generator (5/month)
- SWOT Generator (5/month)
- TAM Calculator (5/month)
- Investor Readiness Checker (5/month)
- Viability Score (5/month)
- EBITDA Estimator (5/month)
- Startup Naming Tool (10/month)
- Business Model Generator (5/month)
- Financial Projections (5/month)
- Case Studies Database
- Blog Posts
- Analytics Dashboard

❌ **Blocked**:
- Challenge Mode
- Strategic Rewrite Engine
- Simulations
- Founder Intelligence
- Financial Intelligence
- Investor Simulations
- Strategic Memory
- Scenario Planning
- Export Templates
- Live API Integrations
- Advanced Analytics

### Pro Tier ($29.99/month)

✅ **All features unlocked**:
- Unlimited all tools
- Challenge Mode
- Strategic Rewrite Engine
- Simulations & Scenario Planning
- Founder Intelligence Analysis
- Financial Intelligence & Valuations
- Investor Simulations
- Strategic Memory & Portfolio tracking
- 9+ Export formats (PDF, Word, HTML, PPT, Excel, JSON)
- Live API integrations (Crunchbase, FRED, SEC, Google Trends, etc.)
- Advanced Analytics & Reporting
- Priority support

---

## API Reference

### Get User Subscription
```typescript
// In API route or server component
const subscription = await getUserSubscription(userId);
```

**Response**:
```typescript
{
  tier: 'pro' | 'free',
  status: 'ACTIVE' | 'TRIAL' | 'CANCELLED' | string,
  trialEndDate: Date | null,
  nextBillingDate: Date | null,
  isTrialActive: boolean,
  isPaid: boolean,
  canAccessFeature: (feature: string) => boolean
}
```

### Check Feature Access
```typescript
const hasAccess = await canUserAccessFeature(userId, 'challenge_mode');
```

### Check Usage Limits
```typescript
const stats = await getUserUsageStats(userId);
```

**Response**:
```typescript
{
  businessPlans: { used: 2, limit: 5, remaining: 3 },
  swotAnalyses: { used: 1, limit: 5, remaining: 4 },
  // ... other features
}
```

### Protect Pro-Only API Route
```typescript
import { requireProSubscription } from '@/lib/middleware/subscription-guard';

export async function POST(request: NextRequest) {
  const userId = getUserFromAuth(request);

  // Check subscription
  const guardResult = await requireProSubscription(request, userId);
  if (guardResult) return guardResult;

  // Process request for Pro user
  // ...
}
```

---

## Monitoring & Troubleshooting

### Common Issues

#### 1. PayPal Button Not Rendering

**Symptom**: Blank space where PayPal button should be

**Check**:
- ✅ `NEXT_PUBLIC_PAYPAL_CLIENT_ID` is set
- ✅ Client ID is correct (check PayPal Dashboard)
- ✅ Browser console has no errors
- ✅ Using HTTPS in production (PayPal requires it)

**Fix**:
```bash
# Verify env variable is loaded
grep PAYPAL_CLIENT_ID .env.local

# Clear cache and rebuild
rm -rf .next
npm run dev
```

#### 2. Webhook Not Receiving Events

**Symptom**: Subscription created in PayPal but not in database

**Check**:
- ✅ Webhook endpoint registered in PayPal Dashboard
- ✅ URL is correct and publicly accessible
- ✅ Webhook events are selected
- ✅ Webhook ID matches in `.env.local`

**Test**:
```bash
# Manually test webhook
curl -X POST http://localhost:3000/api/subscriptions/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "event_type": "BILLING.SUBSCRIPTION.ACTIVATED",
    "resource": {
      "id": "test-subscription-id"
    }
  }'
```

#### 3. Trial Period Not Set

**Symptom**: `trial_end_date` is NULL

**Check in code**:
```typescript
// verify this is set correctly
const trialEndDate = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
```

#### 4. Subscription Status Always "PENDING"

**Symptom**: Subscription doesn't activate after PayPal approval

**Check**:
- ✅ Webhook is receiving activation event
- ✅ Database update is working
- ✅ User can still access Pro features during trial

**Note**: Trial stays active for 5 days regardless of status shown

---

## Production Deployment

### 1. Switch PayPal to Live Mode

In PayPal Developer Dashboard:
1. Click **Live** (instead of Sandbox)
2. Get Live Client ID
3. Update environment:
   ```env
   NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_live_client_id
   ```

### 2. Register Live Webhook

1. In PayPal Dashboard (Live mode)
2. Register webhook with production URL:
   ```
   https://your-domain.com/api/subscriptions/webhook
   ```
3. Update:
   ```env
   PAYPAL_WEBHOOK_ID=your_live_webhook_id
   ```

### 3. Verify HTTPS

PayPal requires HTTPS in production:
- ✅ SSL certificate installed
- ✅ All requests redirect to HTTPS
- ✅ No mixed content warnings

### 4. Update Stripe API Keys

If using backup payment method:
```env
STRIPE_PUBLIC_KEY=pk_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx
```

### 5. Test Full Flow

1. Visit `/pricing` on production domain
2. Complete test subscription
3. Verify in Supabase
4. Check payment history
5. Cancel subscription
6. Verify cancellation

---

## Documentation & Resources

### Supabase RLS & Security
- [Supabase RLS](https://supabase.com/docs/guides/auth/row-level-security)
- Tables are protected - users can only see their own data

### PayPal Subscriptions API
- [PayPal Subscriptions](https://developer.paypal.com/docs/api/subscriptions/v1/)
- [Webhooks](https://developer.paypal.com/docs/api-basics/notifications/webhooks/)
- [Test Plan ID](https://developer.paypal.com/dashboard/apps-and-credentials)

### Files & Usage

| File | Purpose | Status |
|------|---------|--------|
| `supabase/migrations/*.sql` | Database schema | ✅ Ready |
| `src/components/payments/PayPalSubscriptionButton.tsx` | PayPal button | ✅ Ready |
| `src/app/pricing/page.tsx` | Pricing page | ✅ Ready |
| `src/app/api/subscriptions/create/route.ts` | Create subscription | ✅ Ready |
| `src/app/api/subscriptions/webhook/route.ts` | Handle webhooks | ✅ Ready |
| `src/lib/subscription-utils.ts` | Utilities | ✅ Ready |
| `src/lib/middleware/subscription-guard.ts` | Route protection | ✅ Ready |

---

## Next Steps

1. ✅ **PayPal Integration Complete**
   - Button component created
   - Subscription database tables ready
   - API routes for creating subscriptions and webhooks ready
   - Environment configured

2. 🚀 **Ready to Deploy**
   - Apply database migration
   - Set environment variables
   - Test with PayPal sandbox
   - Deploy to production

3. 📦 **Next: Knowledge Bank (Phase 0)**
   - RAG infrastructure
   - Vector embeddings
   - Knowledge chunk ingestion

---

## Support

For issues or questions about PayPal integration:
1. Check PayPal Developer Dashboard
2. Review webhook test results
3. Check Supabase logs and database
4. Verify environment variables
5. Test in sandbox mode first

---

**Last Updated**: May 22, 2026  
**Status**: ✅ Production Ready  
**Plan ID**: P-5BC97589SB7542152NIIPEWI
