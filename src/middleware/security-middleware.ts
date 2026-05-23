/**
 * Security Middleware
 * Integrates rate limiting, API key validation, and request signing
 * Applied to all API routes
 */

import { NextRequest, NextResponse } from 'next/server';
import { SecurityManager } from '@/lib/security';

const securityManager = new SecurityManager();

export interface SecureRequest extends NextRequest {
  securityContext?: {
    clientId: string;
    tier: 'free' | 'pro' | 'admin';
    isValid: boolean;
    error?: string;
    remainingRequests?: number;
  };
}

/**
 * Apply security checks to incoming request
 */
export async function applySecurityMiddleware(
  request: NextRequest,
  tier: 'free' | 'pro' | 'admin' = 'free'
): Promise<{ valid: boolean; error?: string; remainingRequests?: number }> {
  // Extract client ID
  const clientId =
    request.headers.get('x-client-id') ||
    request.headers.get('authorization')?.split(' ')[1] ||
    request.ip ||
    'anonymous';

  // Perform comprehensive validation
  const validation = securityManager.validateRequest(request, clientId, tier);

  return validation;
}

/**
 * Middleware to wrap API route handlers with security
 */
export function withSecurity(
  handler: (req: NextRequest) => Promise<NextResponse>,
  tier: 'free' | 'pro' | 'admin' = 'free'
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    // Apply security checks
    const securityCheck = await applySecurityMiddleware(request, tier);

    if (!securityCheck.valid) {
      return NextResponse.json(
        {
          success: false,
          error: securityCheck.error || 'Security validation failed',
        },
        { status: 403 }
      );
    }

    // Add security context to request
    const secureRequest = request as SecureRequest;
    secureRequest.securityContext = {
      clientId: request.headers.get('x-client-id') || 'unknown',
      tier,
      isValid: true,
      remainingRequests: securityCheck.remainingRequests,
    };

    // Call handler with security context
    const response = await handler(secureRequest);

    // Add security headers to response
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    response.headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self'");

    // Add rate limit info to headers
    if (securityCheck.remainingRequests !== undefined) {
      response.headers.set('X-RateLimit-Remaining', securityCheck.remainingRequests.toString());
      response.headers.set('X-RateLimit-Tier', tier);
    }

    return response;
  };
}

/**
 * Verify API key from authorization header
 */
export function verifyAPIKey(request: NextRequest): { valid: boolean; userId?: string; tier?: string } {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { valid: false };
  }

  const key = authHeader.substring(7);
  return securityManager.apiKeyManager.validateKey(key);
}

/**
 * Verify admin token
 */
export function verifyAdminToken(request: NextRequest): boolean {
  const adminToken = request.headers.get('x-admin-token');
  const expectedToken = process.env.ADMIN_TOKEN || 'admin-token';

  return adminToken === expectedToken;
}

/**
 * Rate limit check
 */
export function checkRateLimit(clientId: string, tier: 'free' | 'pro' | 'admin' = 'free'): boolean {
  return securityManager.rateLimiter.checkLimit(clientId, tier);
}

/**
 * Get remaining requests
 */
export function getRemainingRequests(clientId: string, tier: 'free' | 'pro' | 'admin' = 'free'): number {
  return securityManager.rateLimiter.getRemainingRequests(clientId, tier);
}

export default withSecurity;
