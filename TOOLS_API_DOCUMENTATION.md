# MIZHAR Tools & Intelligence Engines - API Documentation

**Current Version**: 1.0  
**Last Updated**: May 23, 2026  
**Status**: Production Ready

---

## Overview

MIZHAR provides 14 integrated business tools and intelligence engines through a unified API. All endpoints are available to Pro tier subscribers.

### Tool Categories

1. **Free Acquisition Tools (9)** - Available to all users
2. **Intelligence Engines (5)** - Pro tier only
3. **Export Templates (9 formats)** - Pro tier only

---

## API Endpoints

### 1. Business Plan Generator

**Endpoint**: `POST /api/tools/business-plan`

**Description**: Generate a comprehensive business plan with market analysis, strategy, and financial projections.

**Request Body**:
```json
{
  "companyName": "Your Company Name",
  "industry": "SaaS | Fintech | Healthcare | E-commerce | Marketplace | Other",
  "problemStatement": "The problem you're solving",
  "solution": "How you solve it",
  "targetMarket": "Who you sell to",
  "businessModel": "How you make money",
  "revenue": 1000000,
  "teamSize": 5
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "title": "Company Name - Business Plan",
    "executiveSummary": "...",
    "company": {
      "mission": "...",
      "vision": "...",
      "values": ["Innovation", "Customer Focus", "..."]
    },
    "market": {
      "totalAddressableMarket": "...",
      "targetAudience": "...",
      "problemValidation": "..."
    },
    "product": {
      "description": "...",
      "features": ["Feature 1", "Feature 2", "..."],
      "uniqueValue": "..."
    },
    "business": {
      "model": "...",
      "revenue": {
        "streams": ["...", "..."],
        "projections": "Year 1: $100K MRR | ..."
      },
      "costStructure": "..."
    },
    "marketing": {
      "strategies": ["...", "..."],
      "channels": ["...", "..."],
      "customerAcquisition": "..."
    },
    "financials": {
      "startup": 250000,
      "projectedRevenue": 1000000,
      "breakeven": "18-24 months"
    },
    "team": {
      "size": 5,
      "roles": ["Product", "Engineering", "Sales & Marketing", "..."],
      "hiring": "..."
    },
    "implementation": {
      "timeline": "6 months to launch...",
      "milestones": ["Month 1-2: ...", "Month 3: ..."],
      "resources": "..."
    }
  }
}
```

---

### 2. SWOT Analysis

**Endpoint**: `POST /api/tools/swot`

**Description**: Generate comprehensive SWOT analysis with strategic recommendations.

**Request Body**:
```json
{
  "companyName": "Your Company",
  "industry": "Your Industry",
  "yearFounded": 2020,
  "keyProducts": ["Product 1", "Product 2", "Product 3"],
  "teamSize": 10
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "company": "Your Company",
    "strengths": {
      "internal": ["...", "..."],
      "defensibility": ["...", "..."]
    },
    "weaknesses": {
      "internal": ["...", "..."],
      "risks": ["...", "..."]
    },
    "opportunities": {
      "market": ["...", "..."],
      "expansion": ["...", "..."]
    },
    "threats": {
      "competitive": ["...", "..."],
      "external": ["...", "..."]
    },
    "analysis": {
      "position": "Strategic position assessment",
      "recommendations": ["Recommendation 1", "Recommendation 2", "..."]
    }
  }
}
```

---

### 3. TAM Calculator

**Endpoint**: `POST /api/tools/tam`

**Description**: Calculate Total Addressable Market, Serviceable Addressable Market, and Serviceable Obtainable Market.

**Request Body**:
```json
{
  "industry": "Your Industry",
  "currentRevenue": 500000,
  "marketGrowth": 15,
  "customerSegments": ["Segment 1", "Segment 2", "Segment 3"],
  "averagePrice": 5000
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "industry": "Your Industry",
    "total": {
      "tam": 5000000000,
      "sam": 1500000000,
      "som": 75000000
    },
    "breakdown": {
      "bySegment": {
        "Segment 1": 2000000000,
        "Segment 2": 1750000000,
        "Segment 3": 1250000000
      },
      "byGeography": {
        "North America": 2000000000,
        "Europe": 1500000000,
        "Asia Pacific": 1000000000,
        "Other": 500000000
      }
    },
    "analysis": {
      "marketSize": "TAM: $5.0B | SAM: $1.5B | SOM: $75M",
      "growthPotential": "Market growing at 15% annually...",
      "addressability": "Realistic obtainable market (SOM) of $75M..."
    },
    "recommendations": ["Focus on highest-value customer segments...", "..."]
  }
}
```

---

### 4. Investor Readiness Checker

**Endpoint**: `POST /api/tools/investor-readiness`

**Description**: Assess readiness for investor fundraising with specific gaps and timeline.

**Request Body**:
```json
{
  "companyAge": 2,
  "revenue": 500000,
  "growthRate": 25,
  "fundingNeeded": 2000000,
  "teamSize": 8,
  "hasIP": true,
  "hasTraction": true,
  "hasAdvisors": true
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "score": 85,
    "rating": "Ready",
    "readiness": {
      "Revenue Traction": 10,
      "Growth Rate": 20,
      "Team": 16,
      "IP/Moat": 20,
      "Market Fit": 20,
      "Governance": 20
    },
    "gaps": ["Gap 1", "Gap 2"],
    "timeline": "Ready now",
    "recommendations": ["Recommendation 1", "Recommendation 2", "..."]
  }
}
```

---

### 5. Viability Score

**Endpoint**: `POST /api/tools/viability`

**Description**: Calculate business viability score across multiple dimensions.

**Request Body**:
```json
{
  "marketSize": 5000000000,
  "competition": 6,
  "productMaturity": 7,
  "teamQuality": 8,
  "fundingAvailable": 5000000,
  "growthRate": 20
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "viabilityScore": 95,
    "assessment": "Very High",
    "factors": {
      "Market Size": {
        "score": 20,
        "status": "Large market"
      },
      "Competition": {
        "score": 8,
        "status": "Low competition"
      },
      "Product Maturity": {
        "score": 14,
        "status": "Mature product"
      },
      "Team Quality": {
        "score": 16,
        "status": "Strong team"
      },
      "Funding Available": {
        "score": 20,
        "status": "Well funded"
      },
      "Growth Trajectory": {
        "score": 20,
        "status": "Strong growth"
      }
    },
    "recommendations": ["Recommendation 1", "..."],
    "riskFactors": ["Risk 1", "Risk 2"]
  }
}
```

---

### 6. EBITDA Estimator

**Endpoint**: `POST /api/tools/ebitda`

**Description**: Calculate EBITDA, operating income, and financial health metrics.

**Request Body**:
```json
{
  "revenue": 5000000,
  "costOfRevenue": 1500000,
  "operatingExpenses": 2000000,
  "rdExpenses": 800000,
  "salesMarketing": 1000000,
  "adminExpenses": 400000,
  "taxes": 100000,
  "interestExpense": 50000,
  "depreciation": 100000,
  "amortization": 50000
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "ebitda": 550000,
    "ebitdaMargin": 11,
    "operatingIncome": 400000,
    "netIncome": 250000,
    "analysis": {
      "healthStatus": "Fair",
      "benchmarkComparison": "Your EBITDA margin is 11%. Industry benchmark for SaaS is typically 30-40%.",
      "recommendations": ["Focus on improving operational efficiency", "..."]
    }
  }
}
```

---

### 7. Startup Naming Tool

**Endpoint**: `POST /api/tools/naming`

**Description**: Generate AI-powered startup name suggestions with domain availability.

**Request Body**:
```json
{
  "industry": "SaaS",
  "description": "Data pipeline builder",
  "targetAudience": "Data engineers and analysts",
  "tone": "Innovative | Serious | Playful | Classic | Trendy"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "options": [
      {
        "name": "DataFlow",
        "domain": "dataflow.com",
        "score": 8.2,
        "reasoning": "Strong, memorable, and relevant to your industry"
      },
      {
        "name": "PipelineHub",
        "domain": "pipelinehub.io",
        "score": 7.8,
        "reasoning": "Creative combination with good recall"
      },
      {
        "name": "StreamCore",
        "domain": "streamcore.io",
        "score": 7.5,
        "reasoning": "Modern tech naming with .io extension"
      }
    ],
    "analysis": {
      "domainAvailability": "Check .com, .io, and country-specific extensions",
      "memorability": "Choose names with 1-2 syllables for better recall",
      "marketAppeal": "Consider how the name resonates with your target audience"
    },
    "recommendations": ["Verify trademark availability...", "..."]
  }
}
```

---

### 8. Business Model Generator

**Endpoint**: `POST /api/tools/business-model`

**Description**: Generate Business Model Canvas with templates for 5 company types.

**Request Body**:
```json
{
  "companyType": "SaaS | Marketplace | E-commerce | Fintech | Content | Other",
  "targetAudience": "Your target customers",
  "primaryValue": "Your main value prop",
  "scalability": "Low | Medium | High"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "name": "Software as a Service (SaaS)",
    "keyPartners": ["Payment processors", "Cloud infrastructure", "Integration partners", "..."],
    "keyActivities": ["Product development", "Customer support", "Marketing", "..."],
    "keyResources": ["Engineering team", "Cloud infrastructure", "Customer data", "..."],
    "valueProposition": "Your value prop",
    "customerSegments": ["Segment 1", "Segment 2", "..."],
    "channels": ["Website", "Free trial", "Sales team", "..."],
    "customerRelationships": ["Self-serve", "In-app help", "Community", "..."],
    "revenueStreams": ["Monthly subscription", "Annual subscriptions", "Usage-based", "..."],
    "costStructure": {
      "fixed": ["Engineering salaries", "Cloud infrastructure", "..."],
      "variable": ["Support costs", "Marketing", "Payment processing", "..."]
    },
    "metrics": {
      "kpi": ["MRR", "CAC", "LTV", "Churn rate", "NDR"],
      "unitEconomics": ["LTV/CAC ratio > 3", "CAC payback < 12 months", "..."]
    },
    "strengths": ["Recurring revenue", "Scalability", "..."],
    "weaknesses": ["CAC", "Churn risk", "..."]
  }
}
```

---

### 9. Financial Projections

**Endpoint**: `POST /api/tools/projections`

**Description**: Generate 12-36 month financial projections with revenue and profitability modeling.

**Request Body**:
```json
{
  "startingRevenue": 50000,
  "growthRate": 15,
  "months": 24,
  "cogs": 20,
  "opex": 20000,
  "avgCustomerValue": 5000,
  "churnRate": 5
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "assumptions": {
      "startingRevenue": 50000,
      "growthRate": "15% monthly",
      "cogsPercentage": "20% of revenue",
      "monthlyOpex": 20000,
      "avgCustomerValue": 5000,
      "churnRate": "5%"
    },
    "projections": [
      {
        "month": 1,
        "revenue": 50000,
        "cogs": 10000,
        "grossProfit": 40000,
        "opex": 20000,
        "ebitda": 20000,
        "customers": 10
      },
      {
        "month": 2,
        "revenue": 57500,
        "cogs": 11500,
        "grossProfit": 46000,
        "opex": 20000,
        "ebitda": 26000,
        "customers": 11
      }
    ],
    "summary": {
      "totalRevenue": 2500000,
      "avgMonthlyGrowth": 15,
      "breakeven": "Month 6",
      "endingCustomers": 150
    },
    "charts": {
      "revenueGrowth": "Chart: Exponential revenue growth",
      "profitability": "Chart: Path to profitability",
      "unitEconomics": "Chart: Customer growth and CAC"
    }
  }
}
```

---

## Intelligence Engines (Pro Tier Only)

### 10. Challenge Mode (VC Critique)

**Endpoint**: `POST /api/intelligence/challenge-mode`

**Description**: Generate critical business challenges and stress tests for your plan.

**Request Body**:
```json
{
  "businessPlan": "Your full business plan or summary",
  "focusArea": "market | product | team | financials | all"
}
```

---

### 11. Strategic Rewrite Engine

**Endpoint**: `POST /api/intelligence/strategic-rewrite`

**Description**: Rewrite your business plan in different investment persona voices.

**Request Body**:
```json
{
  "businessPlan": "Your business plan",
  "persona": "McKinsey | Sequoia | Paul Graham | YC Narrator | Operator",
  "focusArea": "Optional focus area"
}
```

---

### 12. Simulations & Scenario Planning

**Endpoint**: `POST /api/intelligence/simulations`

**Description**: Model different business scenarios with probability weighting.

**Request Body**:
```json
{
  "baseCase": {
    "year1Revenue": 1000000,
    "year1Churn": 5,
    "year1CAC": 500
  },
  "scenarios": ["optimistic", "realistic", "pessimistic", "downturn", "hyperscale"]
}
```

---

### 13. Founder Intelligence (Market Analysis)

**Endpoint**: `POST /api/intelligence/founder-intel`

**Description**: Market analysis, competitive positioning, and opportunities.

**Request Body**:
```json
{
  "industry": "Your industry",
  "companyFocus": "Your focus area",
  "competitors": ["Competitor 1", "Competitor 2"]
}
```

---

### 14. Financial Intelligence (Valuations)

**Endpoint**: `POST /api/intelligence/financial-intel`

**Description**: Valuation estimates, funding needs, and financial metrics.

**Request Body**:
```json
{
  "currentMRR": 50000,
  "growthRate": 20,
  "burnRate": 100000,
  "fundingRaised": 1000000
}
```

---

## Export Templates

**Endpoint**: `POST /api/export/document`

**Supported Formats**:
- `pdf` - PDF document
- `word` - Microsoft Word (.docx)
- `excel` - Excel spreadsheet (.xlsx)
- `powerpoint` - PowerPoint presentation (.pptx)
- `html` - HTML webpage
- `json` - JSON structured data
- `csv` - CSV spreadsheet
- `markdown` - Markdown document
- `xml` - XML data

**Request Body**:
```json
{
  "content": {
    "title": "Document Title",
    "sections": [
      {
        "heading": "Section 1",
        "content": "Section content..."
      }
    ],
    "metadata": {
      "author": "Author Name",
      "date": "2026-05-23",
      "version": "1.0"
    }
  },
  "format": "pdf | word | excel | powerpoint | html | json | csv | markdown | xml"
}
```

---

## Authentication & Rate Limiting

### Headers Required
```
Authorization: Bearer {token}
Content-Type: application/json
```

### Rate Limits
- Free tier: 5 requests/hour per tool
- Pro tier: Unlimited requests

### Error Handling
```json
{
  "success": false,
  "error": "Error description",
  "code": "ERROR_CODE"
}
```

---

## Integration Examples

### Using in Frontend
```typescript
import { generateBusinessPlan } from '@/lib/business-tools';

const plan = await generateBusinessPlan({
  companyName: 'My Startup',
  industry: 'SaaS',
  problemStatement: 'Data engineers waste time on pipeline work',
  solution: 'Low-code data pipeline builder',
  targetMarket: 'Tech companies with 50-1000 employees',
  businessModel: 'SaaS subscription $99-$999/month',
  revenue: 2000000,
  teamSize: 8,
});
```

### Using RAG with Tools
```typescript
import { ragQuery } from '@/lib/rag-engine';
import { generateChallengeMode } from '@/lib/intelligence-engines';

const context = await ragQuery('How should SaaS companies price their products?');
const challenges = await generateChallengeMode({
  businessPlan: businessPlanContent,
  focusArea: 'market',
});
```

---

## Support & Documentation

- **API Status**: All endpoints production ready
- **Performance**: <2 seconds response time per request
- **Availability**: 99.9% uptime SLA
- **Support**: support@mizhar.com

---

**Last Updated**: May 23, 2026  
**Version**: 1.0  
**Status**: Production Ready
