-- MIZHAR Platform - Users & Subscriptions Schema
-- Created: May 22, 2026
-- Purpose: User authentication, profile management, and PayPal subscription tracking

-- =====================================================================
-- 1. USERS TABLE
-- =====================================================================

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT auth.uid(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    company_name TEXT,
    role TEXT DEFAULT 'founder', -- founder, investor, advisor, researcher
    avatar_url TEXT,
    bio TEXT,

    -- Account status
    account_status TEXT DEFAULT 'active', -- active, suspended, deleted
    email_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMP WITH TIME ZONE,

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Constraints
    CONSTRAINT email_format CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at DESC);
CREATE INDEX idx_users_status ON users(account_status);

-- =====================================================================
-- 2. SUBSCRIPTIONS TABLE (PayPal Integration)
-- =====================================================================

CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- PayPal subscription details
    paypal_subscription_id TEXT UNIQUE NOT NULL,
    paypal_customer_email TEXT,
    paypal_plan_id TEXT NOT NULL, -- P-5BC97589SB7542152NIIPEWI for PRO plan

    -- Subscription tier
    tier TEXT DEFAULT 'pro', -- free, pro

    -- Pricing
    amount_value DECIMAL(10, 2),
    amount_currency_code TEXT DEFAULT 'USD',

    -- Status: APPROVAL_PENDING, APPROVED, ACTIVE, SUSPENDED, CANCELLED, EXPIRED
    status TEXT DEFAULT 'ACTIVE',

    -- Trial period (5 days for PRO)
    trial_start_date TIMESTAMP WITH TIME ZONE,
    trial_end_date TIMESTAMP WITH TIME ZONE,
    trial_used BOOLEAN DEFAULT FALSE,

    -- Subscription dates
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    next_billing_date TIMESTAMP WITH TIME ZONE,
    last_billing_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,

    -- Billing cycle
    billing_frequency TEXT DEFAULT 'MONTH', -- MONTH, YEAR

    -- Cancellation
    cancelled_at TIMESTAMP WITH TIME ZONE,
    cancellation_reason TEXT,

    -- Metadata
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_paypal_id ON subscriptions(paypal_subscription_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_tier ON subscriptions(tier);
CREATE INDEX idx_subscriptions_next_billing ON subscriptions(next_billing_date);

-- =====================================================================
-- 3. PAYMENT HISTORY TABLE
-- =====================================================================

CREATE TABLE IF NOT EXISTS payment_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,

    -- Payment details
    paypal_transaction_id TEXT UNIQUE,
    amount_value DECIMAL(10, 2) NOT NULL,
    amount_currency_code TEXT DEFAULT 'USD',

    -- Payment status
    status TEXT DEFAULT 'PENDING', -- PENDING, COMPLETED, FAILED, REFUNDED
    payment_method TEXT DEFAULT 'paypal',

    -- Billing period
    billing_period_start TIMESTAMP WITH TIME ZONE,
    billing_period_end TIMESTAMP WITH TIME ZONE,

    -- Timestamps
    transaction_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,

    -- Notes
    notes TEXT,
    error_message TEXT,

    -- Metadata
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_payments_user ON payment_history(user_id);
CREATE INDEX idx_payments_subscription ON payment_history(subscription_id);
CREATE INDEX idx_payments_status ON payment_history(status);
CREATE INDEX idx_payments_date ON payment_history(transaction_date DESC);
CREATE INDEX idx_payments_paypal_id ON payment_history(paypal_transaction_id);

-- =====================================================================
-- 4. USER PREFERENCES TABLE
-- =====================================================================

CREATE TABLE IF NOT EXISTS user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Email preferences
    email_notifications BOOLEAN DEFAULT TRUE,
    marketing_emails BOOLEAN DEFAULT TRUE,
    product_updates BOOLEAN DEFAULT TRUE,
    weekly_digest BOOLEAN DEFAULT TRUE,

    -- Feature preferences
    dark_mode BOOLEAN DEFAULT FALSE,
    language TEXT DEFAULT 'en',
    timezone TEXT DEFAULT 'UTC',

    -- Privacy settings
    profile_public BOOLEAN DEFAULT FALSE,
    allow_analytics BOOLEAN DEFAULT TRUE,

    -- API access
    api_key_enabled BOOLEAN DEFAULT FALSE,
    api_key_last_used TIMESTAMP WITH TIME ZONE,

    -- Metadata
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_preferences_user ON user_preferences(user_id);

-- =====================================================================
-- 5. FREE TIER USAGE LIMITS
-- =====================================================================

CREATE TABLE IF NOT EXISTS usage_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Monthly usage (resets on first of month)
    business_plans_generated INT DEFAULT 0,
    swot_analyses INT DEFAULT 0,
    tam_calculations INT DEFAULT 0,
    investor_readiness_checks INT DEFAULT 0,
    viability_scores INT DEFAULT 0,
    ebitda_estimates INT DEFAULT 0,
    naming_suggestions INT DEFAULT 0,
    business_models INT DEFAULT 0,
    financial_projections INT DEFAULT 0,

    -- Monthly limits (FREE tier)
    max_business_plans INT DEFAULT 5,
    max_swot INT DEFAULT 5,
    max_tam INT DEFAULT 5,
    max_investor_checks INT DEFAULT 5,
    max_viability INT DEFAULT 5,
    max_ebitda INT DEFAULT 5,
    max_names INT DEFAULT 10,
    max_models INT DEFAULT 5,
    max_financials INT DEFAULT 5,

    -- Intelligence engine access
    challenge_mode_available BOOLEAN DEFAULT FALSE,
    strategic_rewrite_available BOOLEAN DEFAULT FALSE,
    simulations_available BOOLEAN DEFAULT FALSE,
    founder_intelligence_available BOOLEAN DEFAULT FALSE,

    -- Reset date
    last_reset TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    next_reset TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '1 month'),

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_usage_user ON usage_limits(user_id);

-- =====================================================================
-- 6. RLS POLICIES
-- =====================================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_limits ENABLE ROW LEVEL SECURITY;

-- Users can only see their own profile
CREATE POLICY users_select_own ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY users_update_own ON users
    FOR UPDATE USING (auth.uid() = id);

-- Users can only see their own subscriptions
CREATE POLICY subscriptions_select_own ON subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY subscriptions_insert_own ON subscriptions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY subscriptions_update_own ON subscriptions
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can only see their own payment history
CREATE POLICY payments_select_own ON payment_history
    FOR SELECT USING (auth.uid() = user_id);

-- Users can only see their own preferences
CREATE POLICY preferences_select_own ON user_preferences
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY preferences_update_own ON user_preferences
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can only see their own usage limits
CREATE POLICY usage_select_own ON usage_limits
    FOR SELECT USING (auth.uid() = user_id);

-- =====================================================================
-- 7. FUNCTIONS & TRIGGERS
-- =====================================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_preferences_updated_at BEFORE UPDATE ON user_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-create preferences and usage limits when user is created
CREATE OR REPLACE FUNCTION create_user_defaults()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_preferences (user_id) VALUES (NEW.id);
    INSERT INTO usage_limits (user_id) VALUES (NEW.id);
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER create_defaults_on_user_creation AFTER INSERT ON users
    FOR EACH ROW EXECUTE FUNCTION create_user_defaults();

-- Function to check if user has active subscription
CREATE OR REPLACE FUNCTION has_active_subscription(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM subscriptions
        WHERE subscriptions.user_id = user_id
        AND subscriptions.status = 'ACTIVE'
        AND (subscriptions.end_date IS NULL OR subscriptions.end_date > NOW())
    );
END;
$$ language 'plpgsql';

-- Function to get user's current tier
CREATE OR REPLACE FUNCTION get_user_tier(user_id UUID)
RETURNS TEXT AS $$
DECLARE
    tier TEXT;
BEGIN
    SELECT COALESCE(subscriptions.tier, 'free') INTO tier
    FROM users
    LEFT JOIN subscriptions ON subscriptions.user_id = users.id
    WHERE users.id = user_id
    AND (subscriptions.status = 'ACTIVE' OR subscriptions IS NULL)
    LIMIT 1;

    RETURN COALESCE(tier, 'free');
END;
$$ language 'plpgsql';

-- =====================================================================
-- 8. VERIFICATION
-- =====================================================================

-- Verify all tables exist
SELECT EXISTS (
    SELECT 1 FROM information_schema.tables WHERE table_name = 'users'
) as users_table_exists;

SELECT EXISTS (
    SELECT 1 FROM information_schema.tables WHERE table_name = 'subscriptions'
) as subscriptions_table_exists;

SELECT EXISTS (
    SELECT 1 FROM information_schema.tables WHERE table_name = 'payment_history'
) as payment_history_table_exists;
