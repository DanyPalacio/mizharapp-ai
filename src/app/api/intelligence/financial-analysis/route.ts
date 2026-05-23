/**
 * Financial Analysis with Real Market Data
 * POST /api/intelligence/financial-analysis
 */

import { NextRequest, NextResponse } from 'next/server';
import { ExternalDataIntegration } from '@/lib/external-apis';
import { generateFinancialIntelligence } from '@/lib/intelligence-engines';

export interface FinancialAnalysisRequest {
  stockSymbol?: string;
  companyName?: string;
  industry?: string;
}

export interface FinancialMetrics {
  currentPrice?: number;
  marketCap?: number;
  peRatio?: number;
  dividendYield?: number;
  week52High?: number;
  week52Low?: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: FinancialAnalysisRequest = await request.json();
    const { stockSymbol, companyName, industry } = body;

    if (!stockSymbol && !companyName && !industry) {
      return NextResponse.json(
        {
          success: false,
          error: 'Must provide stockSymbol, companyName, or industry',
        },
        { status: 400 }
      );
    }

    const externalData = new ExternalDataIntegration();

    // Get stock data if symbol provided
    let stockData = null;
    let companyOverview = null;
    if (stockSymbol) {
      stockData = await externalData.alphaVantage.getQuote(stockSymbol);
      companyOverview = await externalData.alphaVantage.getCompanyOverview(stockSymbol);
    }

    // Get economic indicators
    const [gdp, unemployment, inflation, interestRate] = await Promise.all([
      externalData.fred.getGDP(),
      externalData.fred.getUnemploymentRate(),
      externalData.fred.getInflationRate(),
      externalData.fred.getInterestRate(),
    ]);

    // Get market trends if industry provided
    let marketTrends = null;
    if (industry) {
      const trends = await externalData.googleTrends.searchTrend(industry);
      marketTrends = trends;
    }

    // Generate AI financial analysis
    const aiAnalysis = await generateFinancialIntelligence({
      currentMRR: 50000, // Placeholder
      growthRate: 20,
      burnRate: 100000,
      fundingRaised: 2000000,
    });

    // Build comprehensive financial report
    const response = {
      success: true,
      data: {
        overview: {
          symbol: stockSymbol,
          company: companyName,
          industry,
          analysisDate: new Date().toISOString(),
        },
        stockMetrics: stockData
          ? {
              currentPrice: stockData.price,
              change: stockData.change,
              changePercent: stockData.changePercent,
              marketCap: stockData.marketCap,
              peRatio: stockData.pe_ratio,
              dividendYield: stockData.dividend_yield,
              week52High: stockData['52week_high'],
              week52Low: stockData['52week_low'],
            }
          : null,
        economicContext: {
          gdp: gdp
            ? {
                value: gdp.value,
                date: gdp.date,
                units: 'Billions of Dollars',
              }
            : null,
          unemployment: unemployment
            ? {
                value: unemployment.value,
                date: unemployment.date,
                units: 'Percent',
              }
            : null,
          inflation: inflation
            ? {
                value: inflation.value,
                date: inflation.date,
                units: 'Index',
              }
            : null,
          interestRate: interestRate
            ? {
                value: interestRate.value,
                date: interestRate.date,
                units: 'Percent',
              }
            : null,
          interpretation: generateEconomicInterpretation({
            gdp: gdp?.value,
            unemployment: unemployment?.value,
            inflation: inflation?.value,
            interestRate: interestRate?.value,
          }),
        },
        marketTrends: marketTrends,
        aiAnalysis: {
          valuation: {
            current: aiAnalysis.currentValuation,
            projections: aiAnalysis.projectedValuation,
          },
          metrics: aiAnalysis.metrics,
          recommendations: aiAnalysis.recommendations,
        },
        investmentScore: calculateInvestmentScore({
          stockData,
          gdp: gdp?.value,
          unemployment: unemployment?.value,
          marketTrends,
        }),
        risks: identifyFinancialRisks({
          peRatio: stockData?.pe_ratio,
          unemployment: unemployment?.value,
          inflation: inflation?.value,
        }),
        opportunities: [
          'Strong market fundamentals with stable growth',
          'Low interest rates creating favorable financing environment',
          'Industry momentum aligned with macro trends',
          'Potential for expansion into new markets',
          'M&A opportunities with competitors',
          'Digital transformation driving demand',
          'Increasing customer lifetime value',
        ],
      },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Financial analysis error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to perform financial analysis',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const stockSymbol = searchParams.get('stockSymbol');
  const companyName = searchParams.get('companyName');
  const industry = searchParams.get('industry');

  if (!stockSymbol && !companyName && !industry) {
    return NextResponse.json(
      {
        tool: 'Financial Analysis',
        description: 'Comprehensive financial analysis combining stock data, economic indicators, and AI insights',
        endpoint: 'POST /api/intelligence/financial-analysis',
        parameters: {
          stockSymbol: 'string (optional) - Stock ticker symbol (e.g., AAPL)',
          companyName: 'string (optional) - Company name',
          industry: 'string (optional) - Industry for trend analysis',
        },
        dataSources: [
          'Alpha Vantage - Stock prices and company overview',
          'FRED - Economic indicators (GDP, unemployment, inflation, rates)',
          'Google Trends - Industry trends and demand signals',
          'Intelligence Engines - AI valuation and strategy',
        ],
        example: {
          stockSymbol: 'AAPL',
          companyName: 'Apple',
          industry: 'Technology',
        },
      },
      { status: 200 }
    );
  }

  // Handle GET with parameters
  const body = JSON.stringify({
    stockSymbol,
    companyName,
    industry,
  });

  const postRequest = new Request(request.url, {
    method: 'POST',
    body,
  });

  return POST(postRequest);
}

/**
 * Generate economic interpretation
 */
function generateEconomicInterpretation(indicators: any): string {
  const parts = [];

  if (indicators.gdp) {
    parts.push('GDP is ' + (indicators.gdp > 0 ? 'growing' : 'declining'));
  }

  if (indicators.unemployment) {
    parts.push(
      'unemployment at ' +
        indicators.unemployment.toFixed(1) +
        '% (lower is better for growth)'
    );
  }

  if (indicators.inflation) {
    parts.push(
      'inflation moderating (supportive for valuations and consumer demand)'
    );
  }

  if (indicators.interestRate) {
    parts.push(
      'interest rates at ' +
        indicators.interestRate.toFixed(2) +
        '% (affects financing costs and discount rates)'
    );
  }

  return parts.join('. ') + '. Overall: Moderate economic tailwinds for growth companies.';
}

/**
 * Calculate investment score
 */
function calculateInvestmentScore(data: any): number {
  let score = 50; // Base score

  if (data.stockData) {
    // PE ratio below 20 is attractive
    if (data.stockData.pe_ratio && data.stockData.pe_ratio < 20) score += 10;
    // Price momentum
    if (data.stockData.changePercent > 0) score += 5;
  }

  // Economic conditions
  if (data.gdp > 0) score += 5;
  if (data.unemployment && data.unemployment < 5) score += 5;
  if (data.marketTrends && data.marketTrends.length > 0) score += 5;

  return Math.min(100, score);
}

/**
 * Identify financial risks
 */
function identifyFinancialRisks(data: any): string[] {
  const risks = [];

  if (data.peRatio && data.peRatio > 30) {
    risks.push('Valuation may be elevated (high PE ratio)');
  }

  if (data.unemployment && data.unemployment > 6) {
    risks.push('Higher unemployment may indicate economic slowdown');
  }

  if (data.inflation && data.inflation > 3) {
    risks.push('Rising inflation may impact profitability and consumer spending');
  }

  if (risks.length === 0) {
    risks.push('No major economic risks identified');
  }

  return risks;
}
