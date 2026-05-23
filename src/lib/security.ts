/**
 * Security & Code Protection System
 * Prevents unauthorized access, copying, and reverse engineering
 */

import crypto from 'crypto';

/**
 * Request Rate Limiting
 */
export class RateLimiter {
  private requests: Map<string, { count: number; resetTime: number }> = new Map();
  private limits = {
    free: 5, // 5 requests per hour
    pro: 100, // 100 requests per hour
    admin: 1000, // 1000 requests per hour
  };

  checkLimit(clientId: string, tier: 'free' | 'pro' | 'admin' = 'free'): boolean {
    const now = Date.now();
    const limit = this.limits[tier];
    const hourInMs = 3600000;

    const request = this.requests.get(clientId);

    if (!request || now > request.resetTime) {
      // Reset or new
      this.requests.set(clientId, {
        count: 1,
        resetTime: now + hourInMs,
      });
      return true;
    }

    if (request.count < limit) {
      request.count++;
      return true;
    }

    return false; // Rate limit exceeded
  }

  getRemainingRequests(clientId: string, tier: 'free' | 'pro' | 'admin' = 'free'): number {
    const request = this.requests.get(clientId);
    if (!request) return this.limits[tier];

    const now = Date.now();
    if (now > request.resetTime) {
      return this.limits[tier];
    }

    return Math.max(0, this.limits[tier] - request.count);
  }
}

/**
 * API Key Management & Validation
 */
export class APIKeyManager {
  private keys: Map<string, { userId: string; tier: string; created: Date; active: boolean }> =
    new Map();

  /**
   * Generate secure API key
   */
  generateKey(userId: string, tier: 'free' | 'pro' = 'free'): string {
    const key = `mizhar_${crypto.randomBytes(32).toString('hex')}`;
    this.keys.set(key, {
      userId,
      tier,
      created: new Date(),
      active: true,
    });
    return key;
  }

  /**
   * Validate API key
   */
  validateKey(key: string): { valid: boolean; userId?: string; tier?: string } {
    const keyData = this.keys.get(key);

    if (!keyData || !keyData.active) {
      return { valid: false };
    }

    return {
      valid: true,
      userId: keyData.userId,
      tier: keyData.tier,
    };
  }

  /**
   * Revoke API key
   */
  revokeKey(key: string): boolean {
    const keyData = this.keys.get(key);
    if (!keyData) return false;

    keyData.active = false;
    return true;
  }

  /**
   * Rotate API key
   */
  rotateKey(oldKey: string): string | null {
    const keyData = this.keys.get(oldKey);
    if (!keyData) return null;

    this.revokeKey(oldKey);
    return this.generateKey(keyData.userId, keyData.tier as 'free' | 'pro');
  }
}

/**
 * Request Signing & Verification
 */
export class RequestSigner {
  private secret = process.env.REQUEST_SIGNING_SECRET || 'mizhar-secret-key';

  /**
   * Sign request
   */
  signRequest(data: any): { signature: string; timestamp: number } {
    const timestamp = Date.now();
    const payload = JSON.stringify({ ...data, timestamp });
    const signature = crypto.createHmac('sha256', this.secret).update(payload).digest('hex');

    return { signature, timestamp };
  }

  /**
   * Verify request signature
   */
  verifySignature(data: any, signature: string, timestamp: number): boolean {
    // Check timestamp (request must be < 5 minutes old)
    const now = Date.now();
    if (now - timestamp > 300000) {
      return false;
    }

    const payload = JSON.stringify({ ...data, timestamp });
    const expectedSignature = crypto.createHmac('sha256', this.secret).update(payload).digest('hex');

    return signature === expectedSignature;
  }
}

/**
 * Code Obfuscation & Protection
 */
export class CodeProtection {
  /**
   * Obfuscate sensitive strings
   */
  static obfuscateString(str: string): string {
    // Convert to base64 and XOR with key
    const buffer = Buffer.from(str);
    const xorKey = Buffer.from('mizhar-protection-key');

    const obfuscated = Buffer.alloc(buffer.length);
    for (let i = 0; i < buffer.length; i++) {
      obfuscated[i] = buffer[i] ^ xorKey[i % xorKey.length];
    }

    return obfuscated.toString('hex');
  }

  /**
   * De-obfuscate string
   */
  static deobfuscateString(hex: string): string {
    const buffer = Buffer.from(hex, 'hex');
    const xorKey = Buffer.from('mizhar-protection-key');

    const deobfuscated = Buffer.alloc(buffer.length);
    for (let i = 0; i < buffer.length; i++) {
      deobfuscated[i] = buffer[i] ^ xorKey[i % xorKey.length];
    }

    return deobfuscated.toString('utf-8');
  }

  /**
   * Check for code tampering
   */
  static verifyCodeIntegrity(code: string, expectedHash: string): boolean {
    const actualHash = crypto.createHash('sha256').update(code).digest('hex');
    return actualHash === expectedHash;
  }

  /**
   * Generate code integrity hash
   */
  static generateCodeHash(code: string): string {
    return crypto.createHash('sha256').update(code).digest('hex');
  }
}

/**
 * Access Control & Permissions
 */
export class AccessControl {
  private permissions: Map<string, string[]> = new Map();

  /**
   * Grant permission
   */
  grantPermission(userId: string, permission: string): void {
    const userPerms = this.permissions.get(userId) || [];
    if (!userPerms.includes(permission)) {
      userPerms.push(permission);
      this.permissions.set(userId, userPerms);
    }
  }

  /**
   * Revoke permission
   */
  revokePermission(userId: string, permission: string): void {
    const userPerms = this.permissions.get(userId) || [];
    const index = userPerms.indexOf(permission);
    if (index > -1) {
      userPerms.splice(index, 1);
      this.permissions.set(userId, userPerms);
    }
  }

  /**
   * Check permission
   */
  hasPermission(userId: string, permission: string): boolean {
    const userPerms = this.permissions.get(userId) || [];
    return userPerms.includes(permission) || userPerms.includes('admin');
  }

  /**
   * Check multiple permissions
   */
  hasAllPermissions(userId: string, permissions: string[]): boolean {
    return permissions.every((p) => this.hasPermission(userId, p));
  }

  /**
   * Check any permission
   */
  hasAnyPermission(userId: string, permissions: string[]): boolean {
    return permissions.some((p) => this.hasPermission(userId, p));
  }
}

/**
 * IP Whitelisting & Blocking
 */
export class IPManager {
  private whitelist: Set<string> = new Set();
  private blacklist: Set<string> = new Set();

  /**
   * Add IP to whitelist
   */
  addToWhitelist(ip: string): void {
    this.whitelist.add(ip);
  }

  /**
   * Add IP to blacklist
   */
  addToBlacklist(ip: string): void {
    this.blacklist.add(ip);
    this.whitelist.delete(ip);
  }

  /**
   * Check if IP is allowed
   */
  isAllowed(ip: string): boolean {
    if (this.blacklist.has(ip)) return false;
    if (this.whitelist.size > 0) return this.whitelist.has(ip);
    return true;
  }
}

/**
 * Unified Security Manager
 */
export class SecurityManager {
  rateLimiter = new RateLimiter();
  apiKeyManager = new APIKeyManager();
  requestSigner = new RequestSigner();
  accessControl = new AccessControl();
  ipManager = new IPManager();

  /**
   * Comprehensive request validation
   */
  validateRequest(request: any, clientId: string, tier: 'free' | 'pro' = 'free'): {
    valid: boolean;
    error?: string;
  } {
    // Check IP
    const ip = request.headers['x-forwarded-for'] || request.socket.remoteAddress;
    if (!this.ipManager.isAllowed(ip)) {
      return { valid: false, error: 'IP address blocked' };
    }

    // Check rate limit
    if (!this.rateLimiter.checkLimit(clientId, tier)) {
      return { valid: false, error: 'Rate limit exceeded' };
    }

    // Check API key
    const apiKey = request.headers['authorization']?.split(' ')[1];
    if (apiKey) {
      const validation = this.apiKeyManager.validateKey(apiKey);
      if (!validation.valid) {
        return { valid: false, error: 'Invalid API key' };
      }
    }

    // Check signature if provided
    if (request.headers['x-signature']) {
      const isValid = this.requestSigner.verifySignature(
        request.body,
        request.headers['x-signature'],
        parseInt(request.headers['x-timestamp'])
      );
      if (!isValid) {
        return { valid: false, error: 'Invalid signature' };
      }
    }

    return { valid: true };
  }
}
