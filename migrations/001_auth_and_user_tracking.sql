-- Migration: Add Authentication Audit and User Registration Tracking
-- Date: May 2026

-- 1. Create auth_audit_logs table
CREATE TABLE IF NOT EXISTS auth_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'login_attempt', 'login_success', 'login_failure', 
    'password_change', 'password_reset', 'account_locked', 
    'account_unlocked', 'suspicious_activity'
  )),
  ip_address INET NOT NULL,
  user_agent TEXT,
  success BOOLEAN NOT NULL DEFAULT false,
  failure_reason TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  country VARCHAR(100),
  city VARCHAR(100),
  device_type TEXT CHECK (device_type IN ('mobile', 'tablet', 'desktop', 'unknown')),
  browser VARCHAR(50),
  os VARCHAR(50),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  INDEX idx_user_id_timestamp (user_id, timestamp),
  INDEX idx_event_type_timestamp (event_type, timestamp),
  INDEX idx_ip_address (ip_address)
);

-- 2. Add registration data to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS country VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS city VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS signup_ip INET;
ALTER TABLE users ADD COLUMN IF NOT EXISTS signup_user_agent TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS device_type TEXT CHECK (device_type IN ('mobile', 'tablet', 'desktop', 'unknown'));
ALTER TABLE users ADD COLUMN IF NOT EXISTS first_login_timestamp TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- 3. Create newsletters table
CREATE TABLE IF NOT EXISTS newsletters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  html_content TEXT,
  status TEXT NOT NULL CHECK (status IN ('draft', 'scheduled', 'sent', 'failed')),
  target_audience TEXT NOT NULL CHECK (target_audience IN ('all', 'free', 'pro', 'segment')),
  scheduled_time TIMESTAMPTZ,
  sent_time TIMESTAMPTZ,
  recipient_count INTEGER,
  open_count INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
);

-- 4. Create newsletter_sent table for tracking
CREATE TABLE IF NOT EXISTS newsletter_sent (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  newsletter_id UUID NOT NULL REFERENCES newsletters(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  
  INDEX idx_newsletter_id (newsletter_id),
  INDEX idx_user_id (user_id)
);

-- 5. Create login_attempt_tracker table
CREATE TABLE IF NOT EXISTS login_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  attempt_timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  ip_address INET NOT NULL,
  success BOOLEAN NOT NULL,
  
  INDEX idx_user_id_timestamp (user_id, attempt_timestamp),
  INDEX idx_ip_address (ip_address)
);

-- 6. Create session_tracking table
CREATE TABLE IF NOT EXISTS session_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_start TIMESTAMPTZ NOT NULL DEFAULT now(),
  session_end TIMESTAMPTZ,
  ip_address INET,
  device_type TEXT,
  page_views INTEGER DEFAULT 0,
  duration_seconds INTEGER,
  
  INDEX idx_user_id_session (user_id, session_start)
);

-- 7. Create tool_usage_tracking table
CREATE TABLE IF NOT EXISTS tool_usage_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_name VARCHAR(100) NOT NULL,
  usage_timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  input_length INTEGER,
  output_length INTEGER,
  execution_time_ms INTEGER,
  success BOOLEAN DEFAULT true,
  
  INDEX idx_user_id_tool (user_id, tool_name),
  INDEX idx_tool_usage_timestamp (tool_name, usage_timestamp)
);

-- 8. Enable RLS for auth_audit_logs
ALTER TABLE auth_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletters ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_usage_tracking ENABLE ROW LEVEL SECURITY;

-- 9. Create policies for auth_audit_logs
CREATE POLICY "Users can view their own audit logs" ON auth_audit_logs
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all audit logs" ON auth_audit_logs
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

-- 10. Create policies for session_tracking
CREATE POLICY "Users can view their own sessions" ON session_tracking
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all sessions" ON session_tracking
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

-- 11. Create policies for tool_usage_tracking
CREATE POLICY "Users can view their own usage" ON tool_usage_tracking
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all usage" ON tool_usage_tracking
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

-- 12. Create policies for newsletters
CREATE POLICY "Admins can manage newsletters" ON newsletters
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Public can view sent newsletters" ON newsletters
  FOR SELECT USING (status = 'sent');

COMMIT;
