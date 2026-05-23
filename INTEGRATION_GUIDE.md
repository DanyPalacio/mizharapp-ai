# MIZHAR Integration Guide
**Complete Implementation Guide for Phases 6-7**

---

## Quick Start

### 1. Apply Database Migrations

```bash
# Create conversations table
npx supabase migration add create_conversations_table

# Migration content:
CREATE TABLE IF NOT EXISTS conversations (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_context JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_conversations_created_at ON conversations(created_at DESC);
```

### 2. Enable Security Middleware

Update all API routes to use security middleware:

```typescript
// Before
export async function POST(request: NextRequest) {
  // Route logic
}

// After
import { withSecurity } from '@/middleware/security-middleware';

async function handler(request: NextRequest) {
  // Route logic
  return NextResponse.json({ success: true });
}

export const POST = withSecurity(handler, 'pro');
```

### 3. Add SEO to Layout

```typescript
// app/layout.tsx
import SEOHead from '@/components/SEOHead';
import { SEO_CONFIG } from '@/lib/seo-keywords';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <SEOHead
          title={SEO_CONFIG.pageMetadata.home.title}
          description={SEO_CONFIG.pageMetadata.home.description}
          keywords={SEO_CONFIG.pageMetadata.home.keywords}
        />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### 4. Enable PWA

```typescript
// next.config.js
import withPWA from 'next-pwa';

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
});
```

---

## Security Implementation

### Rate Limiting Usage

```typescript
import { 
  checkRateLimit, 
  getRemainingRequests 
} from '@/middleware/security-middleware';

// In API route
const clientId = request.headers.get('x-client-id') || 'anonymous';
const tier = 'pro';

if (!checkRateLimit(clientId, tier)) {
  return NextResponse.json(
    { error: 'Rate limit exceeded' },
    { status: 429 }
  );
}

const remaining = getRemainingRequests(clientId, tier);
response.headers.set('X-RateLimit-Remaining', remaining.toString());
```

### API Key Generation

```typescript
import { APIKeyManager } from '@/lib/security';

const keyManager = new APIKeyManager();

// Generate key for user
const apiKey = keyManager.generateKey(userId, 'pro');

// Validate key
const validation = keyManager.validateKey(apiKey);
if (validation.valid) {
  console.log(validation.userId, validation.tier);
}

// Rotate key
const newKey = keyManager.rotateKey(oldKey);

// Revoke key
keyManager.revokeKey(apiKey);
```

### Request Signing

```typescript
import { RequestSigner } from '@/lib/security';

const signer = new RequestSigner();

// Sign outgoing request
const { signature, timestamp } = signer.signRequest({
  userId: '123',
  action: 'create_plan'
});

// Verify incoming request
const isValid = signer.verifySignature(
  request.body,
  request.headers.get('x-signature'),
  parseInt(request.headers.get('x-timestamp'))
);
```

### Access Control

```typescript
import { AccessControl } from '@/lib/security';

const acl = new AccessControl();

// Grant permission
acl.grantPermission(userId, 'tools:business_plan');
acl.grantPermission(userId, 'intelligence:challenge_mode');

// Check permission
if (acl.hasPermission(userId, 'tools:business_plan')) {
  // Allow access
}

// Check multiple permissions
if (acl.hasAllPermissions(userId, [
  'tools:business_plan',
  'intelligence:challenge_mode'
])) {
  // Allow access to both
}
```

### IP Management

```typescript
import { IPManager } from '@/lib/security';

const ipManager = new IPManager();

// Whitelist IPs
ipManager.addToWhitelist('192.168.1.1');
ipManager.addToWhitelist('10.0.0.1');

// Blacklist IPs
ipManager.addToBlacklist('203.0.113.42');

// Check if IP allowed
const userIP = request.ip;
if (!ipManager.isAllowed(userIP)) {
  return NextResponse.json(
    { error: 'IP address blocked' },
    { status: 403 }
  );
}
```

---

## Chat & Strategic Memory

### Starting a Conversation

```typescript
// Frontend
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${userToken}`
  },
  body: JSON.stringify({
    action: 'start',
    userId: currentUserId,
    conversationId: `conv_${Date.now()}`,
    businessContext: {
      companyName: 'Acme Corp',
      industry: 'SaaS',
      stage: 'Seed',
      focus: 'Enterprise sales'
    }
  })
});

const { conversationId } = await response.json();
```

### Sending Messages

```typescript
const messageResponse = await fetch('/api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${userToken}`
  },
  body: JSON.stringify({
    action: 'message',
    conversationId,
    userId: currentUserId,
    userMessage: 'What should my CAC payback period be for a B2B SaaS?'
  })
});

const { response } = await messageResponse.json();
console.log(response.message);
console.log(response.followUpQuestions);
console.log(response.actionItems);
```

### Retrieving Conversation History

```typescript
const historyResponse = await fetch(
  `/api/chat?conversationId=${conversationId}`,
  {
    headers: {
      'Authorization': `Bearer ${userToken}`
    }
  }
);

const { conversation } = await historyResponse.json();
console.log(conversation.messages);
console.log(conversation.strategicMemory);
```

### Managing Portfolio

```typescript
// Add project to portfolio
await fetch('/api/chat/portfolio', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${userToken}`
  },
  body: JSON.stringify({
    action: 'add',
    conversationId,
    project: {
      name: 'Product A',
      description: 'B2B SaaS product',
      metrics: {
        'MRR': 5000,
        'CAC': 150,
        'LTV': 15000,
        'churn': 0.05
      },
      status: 'growth'
    }
  })
});

// Get portfolio recommendations
const recommendResponse = await fetch('/api/chat/portfolio', {
  method: 'POST',
  body: JSON.stringify({
    action: 'recommendations',
    conversationId
  })
});

const { recommendations } = await recommendResponse.json();
```

### Accessing Strategic Memory

```typescript
// Get strategic summary
const memoryResponse = await fetch(
  `/api/chat/memory?conversationId=${conversationId}`,
  {
    headers: {
      'Authorization': `Bearer ${userToken}`
    }
  }
);

const { memory } = await memoryResponse.json();
console.log(memory.decisions);   // Key decisions made
console.log(memory.assumptions); // Business assumptions
console.log(memory.metrics);     // Tracked metrics
console.log(memory.portfolio);   // Portfolio items
```

---

## Mobile Optimization

### Responsive Components

```typescript
// Use responsive font sizes
import { RESPONSIVE_FONT_SIZES } from '@/lib/responsive-design';

const Heading = styled.h1`
  font-size: ${RESPONSIVE_FONT_SIZES.h1.mobile};
  
  @media (min-width: 768px) {
    font-size: ${RESPONSIVE_FONT_SIZES.h1.tablet};
  }
  
  @media (min-width: 1024px) {
    font-size: ${RESPONSIVE_FONT_SIZES.h1.desktop};
  }
`;
```

### Touch-Optimized Buttons

```typescript
import { TOUCH_TARGETS } from '@/lib/responsive-design';

const Button = styled.button`
  min-height: ${TOUCH_TARGETS.button};
  min-width: ${TOUCH_TARGETS.button};
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px; /* Prevents zoom on iOS */
  cursor: pointer;
  
  &:active {
    transform: scale(0.98);
  }
`;
```

### Responsive Grid Layouts

```typescript
import { RESPONSIVE_GRID } from '@/lib/responsive-design';

const GridContainer = styled.div`
  width: ${RESPONSIVE_GRID.container.mobile};
  display: grid;
  grid-template-columns: repeat(${RESPONSIVE_GRID.columns.mobile}, 1fr);
  gap: ${RESPONSIVE_GRID.gap.mobile};
  
  @media (min-width: 768px) {
    width: ${RESPONSIVE_GRID.container.tablet};
    grid-template-columns: repeat(${RESPONSIVE_GRID.columns.tablet}, 1fr);
    gap: ${RESPONSIVE_GRID.gap.tablet};
  }
  
  @media (min-width: 1024px) {
    width: ${RESPONSIVE_GRID.container.desktop};
    grid-template-columns: repeat(${RESPONSIVE_GRID.columns.desktop}, 1fr);
    gap: ${RESPONSIVE_GRID.gap.desktop};
  }
`;
```

### PWA Setup

```typescript
// Add to HTML head
<link rel="manifest" href="/manifest.json" />
<meta name="theme-color" content="#000000" />
<meta name="mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<meta name="apple-mobile-web-app-title" content="MIZHAR" />
<link rel="apple-touch-icon" href="/icons/icon-192x192.png" />

// Register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
```

---

## SEO Implementation

### Page-Specific SEO

```typescript
// app/tools/business-plan/page.tsx
import SEOHead from '@/components/SEOHead';
import { SEO_CONFIG, STRUCTURED_DATA } from '@/lib/seo-keywords';

export default function BusinessPlanPage() {
  const metadata = SEO_CONFIG.pageMetadata.tools;
  
  return (
    <>
      <SEOHead
        title={metadata.title}
        description={metadata.description}
        keywords={metadata.keywords}
        canonical="https://mizhar.com/tools/business-plan"
        type="product"
        structuredData={STRUCTURED_DATA.tool(
          'Business Plan Generator',
          'Create comprehensive business plans with AI assistance'
        )}
      />
      {/* Page content */}
    </>
  );
}
```

### Adding Schema Markup

```typescript
import { STRUCTURED_DATA } from '@/lib/seo-keywords';

// Add to any page
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(STRUCTURED_DATA.organization)
  }}
/>

// Or use SEOHead component
<SEOHead
  title="Page Title"
  description="Description"
  structuredData={STRUCTURED_DATA.softwareApplication}
/>
```

### Dynamic Sitemap Generation

```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://mizhar.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://mizhar.com/tools',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    // ... more URLs
  ];
}
```

---

## API Rate Limiting Response Headers

All responses include rate limiting headers:

```
X-RateLimit-Remaining: 45 (remaining requests this hour)
X-RateLimit-Tier: pro (user's tier)
X-RateLimit-Limit: 100 (total limit for tier)
X-RateLimit-Reset: 1685905200 (Unix timestamp for reset)
```

---

## Error Handling

### Security Errors

```typescript
// 401 Unauthorized
{
  "success": false,
  "error": "Unauthorized - Admin access required"
}

// 403 Forbidden (Rate Limited)
{
  "success": false,
  "error": "Rate limit exceeded"
}

// 429 Too Many Requests
{
  "success": false,
  "error": "Rate limit exceeded",
  "retryAfter": 3600
}
```

### Chat Errors

```typescript
// 400 Bad Request
{
  "success": false,
  "error": "conversationId and userMessage required"
}

// 404 Not Found
{
  "success": false,
  "error": "Conversation not found"
}
```

---

## Testing

### Security Test Suite

```typescript
import { SecurityManager } from '@/lib/security';

describe('Security System', () => {
  let security: SecurityManager;

  beforeEach(() => {
    security = new SecurityManager();
  });

  test('Rate limiting works correctly', () => {
    const clientId = 'test-client';
    
    // First 5 requests should succeed
    for (let i = 0; i < 5; i++) {
      expect(security.rateLimiter.checkLimit(clientId, 'free')).toBe(true);
    }
    
    // 6th request should fail
    expect(security.rateLimiter.checkLimit(clientId, 'free')).toBe(false);
  });

  test('API key generation and validation', () => {
    const key = security.apiKeyManager.generateKey('user123', 'pro');
    
    expect(key).toMatch(/^mizhar_/);
    
    const validation = security.apiKeyManager.validateKey(key);
    expect(validation.valid).toBe(true);
    expect(validation.userId).toBe('user123');
    expect(validation.tier).toBe('pro');
  });

  test('Request signing and verification', () => {
    const data = { action: 'create', userId: 'user123' };
    const { signature, timestamp } = security.requestSigner.signRequest(data);
    
    const isValid = security.requestSigner.verifySignature(
      data,
      signature,
      timestamp
    );
    
    expect(isValid).toBe(true);
  });
});
```

---

## Monitoring & Analytics

### Track SEO Performance

```typescript
// Monitor keyword rankings
// Use tools like SEMrush, Ahrefs, or Google Search Console
// Expected metrics:
// - 260+ keywords tracked
// - Target: Top 3 results for 50+ keywords in 6 months
// - Target: Top 10 results for 150+ keywords in 12 months
```

### Monitor Security Events

```typescript
// Log security events to analytics
const logSecurityEvent = (eventType: string, details: any) => {
  // Send to analytics service
  analytics.track('security_event', {
    event_type: eventType,
    timestamp: new Date(),
    ...details
  });
};

// Track rate limit hits
logSecurityEvent('rate_limit_exceeded', {
  clientId,
  tier,
  endpoint: request.nextUrl.pathname
});

// Track failed API key validation
logSecurityEvent('invalid_api_key', {
  timestamp: new Date()
});
```

---

## Performance Optimization

### Critical CSS

```typescript
// Extract critical CSS for above-the-fold content
// Focus on:
// - Navigation bar (56px on mobile)
// - Hero section
// - Primary CTA button
// - Typography

// Use Critters plugin in Next.js for automatic extraction
```

### Code Splitting

```typescript
// next.config.js
module.exports = {
  swcMinify: true,
  experimental: {
    optimizePackageImports: [
      '@/components',
      '@/lib'
    ],
  },
  webpack: (config) => {
    config.optimization.splitChunks.cacheGroups = {
      default: false,
      vendors: false,
      // Split API security into separate chunk
      security: {
        test: /[\\/]node_modules[\\/]|security/,
        name: 'security',
        priority: 10,
        reuseExistingChunk: true,
      },
    };
    return config;
  }
};
```

---

## Production Checklist

- [ ] All environment variables configured
- [ ] Database migrations applied
- [ ] Security middleware enabled on all API routes
- [ ] SEO files deployed (sitemap, robots.txt, manifest)
- [ ] PWA service worker registered
- [ ] SSL/TLS certificate configured
- [ ] Rate limiting tested with 10K+ requests
- [ ] API key generation and rotation tested
- [ ] Chat endpoints tested end-to-end
- [ ] Mobile responsiveness tested on 5+ devices
- [ ] Lighthouse audit score 90+
- [ ] Security headers verified
- [ ] CDN configured for image optimization
- [ ] Analytics tracking implemented
- [ ] Error logging configured
- [ ] Monitoring and alerts set up

---

## Support & Documentation

For implementation questions, refer to:
- Phases 6-7: `PHASE_6_7_COMPLETION.md`
- Security Details: `src/lib/security.ts`
- Chat Engine: `src/lib/chat-engine.ts`
- SEO Config: `src/lib/seo-keywords.ts`
- Mobile Design: `src/lib/responsive-design.ts`

---

**Last Updated**: May 23, 2026  
**Status**: Production Ready ✅
