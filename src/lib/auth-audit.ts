/**
 * Authentication Audit System
 * Login tracking, password policy, suspicious activity detection
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key'
);

/**
 * Password security policy
 */
export const PASSWORD_POLICY = {
  minLength: 12,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  specialChars: '!@#$%^&*()_+-=[]{}|;:,.<>?',
  maxAge: 90, // days
  preventReuse: 5, // prevent last 5 passwords
  errorMessages: {
    tooShort: 'Password must be at least 12 characters long',
    noUppercase: 'Password must contain at least one uppercase letter',
    noLowercase: 'Password must contain at least one lowercase letter',
    noNumbers: 'Password must contain at least one number',
    noSpecialChars: 'Password must contain at least one special character',
    expired: 'Password has expired. Please reset your password',
    reused: 'Cannot reuse a recent password. Use a new password',
  },
};

/**
 * Auth audit log interface
 */
export interface AuthAuditLog {
  id?: string;
  user_id: string;
  event_type: 'login_attempt' | 'login_success' | 'login_failure' | 'password_change' | 'password_reset' | 'account_locked' | 'account_unlocked' | 'suspicious_activity';
  ip_address: string;
  user_agent: string;
  success: boolean;
  failure_reason?: string;
  timestamp: Date;
  country?: string;
  city?: string;
  device_type?: 'mobile' | 'tablet' | 'desktop' | 'unknown';
  browser?: string;
  os?: string;
}

/**
 * User registration data
 */
export interface UserRegistrationData {
  user_id: string;
  email: string;
  country: string;
  city: string;
  device_type: 'mobile' | 'tablet' | 'desktop' | 'unknown';
  signup_ip: string;
  signup_user_agent: string;
  signup_timestamp: Date;
  first_login_timestamp?: Date;
  subscription_tier: 'free' | 'pro';
  has_paid: boolean;
  payment_date?: Date;
  total_spent: number;
}

/**
 * Password validation
 */
export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (password.length < PASSWORD_POLICY.minLength) {
    errors.push(PASSWORD_POLICY.errorMessages.tooShort);
  }

  if (PASSWORD_POLICY.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push(PASSWORD_POLICY.errorMessages.noUppercase);
  }

  if (PASSWORD_POLICY.requireLowercase && !/[a-z]/.test(password)) {
    errors.push(PASSWORD_POLICY.errorMessages.noLowercase);
  }

  if (PASSWORD_POLICY.requireNumbers && !/\d/.test(password)) {
    errors.push(PASSWORD_POLICY.errorMessages.noNumbers);
  }

  if (PASSWORD_POLICY.requireSpecialChars && !new RegExp(`[${PASSWORD_POLICY.specialChars}]`).test(password)) {
    errors.push(PASSWORD_POLICY.errorMessages.noSpecialChars);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Device type detection from user agent
 */
export function detectDeviceType(userAgent: string): 'mobile' | 'tablet' | 'desktop' | 'unknown' {
  const ua = userAgent.toLowerCase();

  if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/.test(ua)) {
    return 'mobile';
  }

  if (/tablet|ipad|playbook|silk|android/.test(ua)) {
    return 'tablet';
  }

  if (/windows|macintosh|linux/.test(ua)) {
    return 'desktop';
  }

  return 'unknown';
}

/**
 * Extract browser and OS from user agent
 */
export function parseUserAgent(userAgent: string): { browser: string; os: string } {
  const ua = userAgent.toLowerCase();
  let browser = 'Unknown';
  let os = 'Unknown';

  // Browser detection
  if (/chrome/.test(ua)) browser = 'Chrome';
  else if (/safari/.test(ua)) browser = 'Safari';
  else if (/firefox/.test(ua)) browser = 'Firefox';
  else if (/edge|edg/.test(ua)) browser = 'Edge';
  else if (/opera/.test(ua)) browser = 'Opera';

  // OS detection
  if (/windows/.test(ua)) os = 'Windows';
  else if (/macintosh/.test(ua)) os = 'macOS';
  else if (/linux/.test(ua)) os = 'Linux';
  else if (/iphone|ipad|ipod/.test(ua)) os = 'iOS';
  else if (/android/.test(ua)) os = 'Android';

  return { browser, os };
}

/**
 * Login attempt tracking
 */
export class LoginAttemptTracker {
  private maxAttempts = 5;
  private lockoutDuration = 15 * 60 * 1000; // 15 minutes

  /**
   * Record failed login attempt
   */
  async recordFailedAttempt(userId: string, ipAddress: string, userAgent: string, country?: string, city?: string): Promise<void> {
    const { browser, os } = parseUserAgent(userAgent);
    const deviceType = detectDeviceType(userAgent);

    const auditLog: AuthAuditLog = {
      user_id: userId,
      event_type: 'login_failure',
      ip_address: ipAddress,
      user_agent: userAgent,
      success: false,
      timestamp: new Date(),
      country,
      city,
      device_type: deviceType,
      browser,
      os,
    };

    // Save to database
    await supabase.from('auth_audit_logs').insert([auditLog]);

    // Check if account should be locked
    const recentFailures = await this.getRecentFailedAttempts(userId);
    if (recentFailures.length >= this.maxAttempts) {
      await this.lockAccount(userId, 'Too many failed login attempts');
    }
  }

  /**
   * Record successful login
   */
  async recordSuccessfulAttempt(userId: string, ipAddress: string, userAgent: string, country?: string, city?: string): Promise<void> {
    const { browser, os } = parseUserAgent(userAgent);
    const deviceType = detectDeviceType(userAgent);

    const auditLog: AuthAuditLog = {
      user_id: userId,
      event_type: 'login_success',
      ip_address: ipAddress,
      user_agent: userAgent,
      success: true,
      timestamp: new Date(),
      country,
      city,
      device_type: deviceType,
      browser,
      os,
    };

    await supabase.from('auth_audit_logs').insert([auditLog]);

    // Clear failed attempts
    await supabase.from('auth_audit_logs').update({ failure_reason: 'cleared' }).eq('user_id', userId).eq('event_type', 'login_failure');
  }

  /**
   * Get recent failed attempts
   */
  private async getRecentFailedAttempts(userId: string): Promise<AuthAuditLog[]> {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    const { data, error } = await supabase
      .from('auth_audit_logs')
      .select('*')
      .eq('user_id', userId)
      .eq('event_type', 'login_failure')
      .gte('timestamp', fiveMinutesAgo.toISOString());

    if (error) throw error;
    return data || [];
  }

  /**
   * Check if account is locked
   */
  async isLockedOut(userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('auth_audit_logs')
      .select('*')
      .eq('user_id', userId)
      .eq('event_type', 'account_locked')
      .order('timestamp', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) return false;

    const lockTime = new Date(data.timestamp).getTime();
    const now = Date.now();
    const isStillLocked = now - lockTime < this.lockoutDuration;

    if (!isStillLocked) {
      await this.unlockAccount(userId);
    }

    return isStillLocked;
  }

  /**
   * Get remaining lockout time
   */
  async getRemainingLockoutTime(userId: string): Promise<number> {
    const { data } = await supabase
      .from('auth_audit_logs')
      .select('timestamp')
      .eq('user_id', userId)
      .eq('event_type', 'account_locked')
      .order('timestamp', { ascending: false })
      .limit(1)
      .single();

    if (!data) return 0;

    const lockTime = new Date(data.timestamp).getTime();
    const now = Date.now();
    const remaining = this.lockoutDuration - (now - lockTime);

    return Math.max(0, remaining);
  }

  /**
   * Lock account
   */
  private async lockAccount(userId: string, reason: string): Promise<void> {
    const auditLog: AuthAuditLog = {
      user_id: userId,
      event_type: 'account_locked',
      ip_address: '0.0.0.0',
      user_agent: 'system',
      success: false,
      failure_reason: reason,
      timestamp: new Date(),
    };

    await supabase.from('auth_audit_logs').insert([auditLog]);
  }

  /**
   * Unlock account
   */
  private async unlockAccount(userId: string): Promise<void> {
    const auditLog: AuthAuditLog = {
      user_id: userId,
      event_type: 'account_unlocked',
      ip_address: '0.0.0.0',
      user_agent: 'system',
      success: true,
      timestamp: new Date(),
    };

    await supabase.from('auth_audit_logs').insert([auditLog]);
  }
}

/**
 * Security audit and anomaly detection
 */
export class SecurityAuditLogger {
  /**
   * Log authentication event
   */
  async logAuthEvent(log: AuthAuditLog): Promise<void> {
    await supabase.from('auth_audit_logs').insert([log]);
  }

  /**
   * Detect suspicious activity patterns
   */
  async detectSuspiciousActivity(userId: string): Promise<string[]> {
    const flags: string[] = [];

    // Check for rapid multi-IP logins
    const recentLogins = await supabase
      .from('auth_audit_logs')
      .select('ip_address, timestamp')
      .eq('user_id', userId)
      .eq('event_type', 'login_success')
      .gte('timestamp', new Date(Date.now() - 60 * 60 * 1000).toISOString()) // Last hour
      .order('timestamp', { ascending: false })
      .limit(10);

    if (recentLogins.data) {
      const uniqueIPs = new Set(recentLogins.data.map((log: any) => log.ip_address));
      if (uniqueIPs.size > 3) {
        flags.push('Multiple IP addresses in last hour');
      }

      // Check for rapid successive logins
      if (recentLogins.data.length > 5) {
        const times = recentLogins.data.map((log: any) => new Date(log.timestamp).getTime());
        const gaps = [];
        for (let i = 0; i < times.length - 1; i++) {
          gaps.push(times[i] - times[i + 1]);
        }
        const avgGap = gaps.reduce((a, b) => a + b, 0) / gaps.length;
        if (avgGap < 60000) {
          // Less than 1 minute average
          flags.push('Suspicious login frequency');
        }
      }
    }

    // Check for failed attempts followed by success
    const recentFailures = await supabase
      .from('auth_audit_logs')
      .select('timestamp')
      .eq('user_id', userId)
      .eq('event_type', 'login_failure')
      .gte('timestamp', new Date(Date.now() - 15 * 60 * 1000).toISOString())
      .limit(1);

    if (recentFailures.data && recentFailures.data.length > 0) {
      flags.push('Successful login after failed attempts');
    }

    // Check for unusual activity times
    const lastLogin = await supabase
      .from('auth_audit_logs')
      .select('timestamp')
      .eq('user_id', userId)
      .eq('event_type', 'login_success')
      .order('timestamp', { ascending: false })
      .limit(1);

    if (lastLogin.data && lastLogin.data.length > 0) {
      const loginHour = new Date(lastLogin.data[0].timestamp).getHours();
      if (loginHour >= 22 || loginHour <= 4) {
        flags.push('Login at unusual hour');
      }
    }

    return flags;
  }

  /**
   * Generate security report
   */
  async generateSecurityReport(userId: string, days: number = 30): Promise<any> {
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const { data: logs } = await supabase
      .from('auth_audit_logs')
      .select('*')
      .eq('user_id', userId)
      .gte('timestamp', startDate.toISOString())
      .order('timestamp', { ascending: false });

    const successLogins = logs?.filter((log: any) => log.event_type === 'login_success').length || 0;
    const failedLogins = logs?.filter((log: any) => log.event_type === 'login_failure').length || 0;
    const passwordChanges = logs?.filter((log: any) => log.event_type === 'password_change').length || 0;
    const accountLocks = logs?.filter((log: any) => log.event_type === 'account_locked').length || 0;

    const uniqueIPs = new Set((logs || []).map((log: any) => log.ip_address));
    const uniqueDevices = new Set((logs || []).map((log: any) => log.device_type));
    const suspiciousFlags = await this.detectSuspiciousActivity(userId);

    return {
      period: `Last ${days} days`,
      totalEvents: logs?.length || 0,
      successfulLogins: successLogins,
      failedLogins: failedLogins,
      failureRate: successLogins > 0 ? ((failedLogins / (successLogins + failedLogins)) * 100).toFixed(2) + '%' : '0%',
      passwordChanges,
      accountLocks,
      uniqueIPAddresses: uniqueIPs.size,
      uniqueDevices: uniqueDevices.size,
      suspiciousActivities: suspiciousFlags,
      lastLogin: logs?.[0]?.timestamp || null,
      riskLevel: suspiciousFlags.length > 0 ? 'HIGH' : failedLogins > 3 ? 'MEDIUM' : 'LOW',
    };
  }
}
