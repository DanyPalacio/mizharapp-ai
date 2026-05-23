/**
 * External API Integration Layer
 * Phase 4: Live API Integrations
 * Connects to: Crunchbase, PitchBook, SEC EDGAR, Google Trends, FRED, Alpha Vantage
 */

import axios, { AxiosInstance } from 'axios';

/**
 * Base API Client with caching and error handling
 */
export class APIClient {
  private client: AxiosInstance;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheExpiry = 3600000; // 1 hour

  constructor(baseURL: string, apiKey: string) {
    this.client = axios.create({
      baseURL,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });
  }

  async get<T>(url: string, useCache = true): Promise<T> {
    const cacheKey = `GET:${url}`;

    if (useCache) {
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
        return cached.data;
      }
    }

    try {
      const response = await this.client.get<T>(url);
      if (useCache) {
        this.cache.set(cacheKey, { data: response.data, timestamp: Date.now() });
      }
      return response.data;
    } catch (error) {
      console.error(`API Error (GET ${url}):`, error);
      throw error;
    }
  }

  async post<T>(url: string, data: any): Promise<T> {
    try {
      const response = await this.client.post<T>(url, data);
      return response.data;
    } catch (error) {
      console.error(`API Error (POST ${url}):`, error);
      throw error;
    }
  }

  clearCache() {
    this.cache.clear();
  }
}

/**
 * Crunchbase API Integration
 */
export interface CrunchbaseCompany {
  id: string;
  name: string;
  description: string;
  founders: string[];
  fundingTotal: number;
  fundingRound: string;
  investors: string[];
  employees: number;
  founded: number;
  status: 'operating' | 'acquired' | 'public' | 'closed';
  website: string;
  headquarters: string;
}

export class CrunchbaseAPI {
  private client: APIClient;

  constructor(apiKey: string = process.env.CRUNCHBASE_API_KEY || '') {
    this.client = new APIClient('https://api.crunchbase.com/v4', apiKey);
  }

  async searchCompanies(query: string): Promise<CrunchbaseCompany[]> {
    try {
      const data = await this.client.post<any>('/companies/search', {
        name: query,
        limit: 10,
      });

      return data.entities.map((entity: any) => ({
        id: entity.uuid,
        name: entity.name,
        description: entity.description,
        founders: entity.founder_identities?.map((f: any) => f.name) || [],
        fundingTotal: entity.funding_total || 0,
        fundingRound: entity.last_funding_type || 'Unknown',
        investors: entity.investor_identities?.map((i: any) => i.name) || [],
        employees: entity.num_employees_enum || 0,
        founded: parseInt(entity.founded_on?.substring(0, 4)) || 0,
        status: entity.operating_status || 'unknown',
        website: entity.website || '',
        headquarters: entity.headquarters_city || '',
      }));
    } catch (error) {
      console.error('Crunchbase search error:', error);
      return [];
    }
  }

  async getCompanyDetails(companyId: string): Promise<CrunchbaseCompany | null> {
    try {
      const data = await this.client.get<any>(`/companies/${companyId}`);
      return {
        id: data.uuid,
        name: data.name,
        description: data.description,
        founders: data.founder_identities?.map((f: any) => f.name) || [],
        fundingTotal: data.funding_total || 0,
        fundingRound: data.last_funding_type || 'Unknown',
        investors: data.investor_identities?.map((i: any) => i.name) || [],
        employees: data.num_employees_enum || 0,
        founded: parseInt(data.founded_on?.substring(0, 4)) || 0,
        status: data.operating_status || 'unknown',
        website: data.website || '',
        headquarters: data.headquarters_city || '',
      };
    } catch (error) {
      console.error('Crunchbase details error:', error);
      return null;
    }
  }
}

/**
 * SEC EDGAR API Integration
 */
export interface SECFiling {
  cik: string;
  company: string;
  filingType: string;
  date: string;
  url: string;
  revenue?: number;
  netIncome?: number;
  assets?: number;
}

export class SECEdgarAPI {
  private baseURL = 'https://data.sec.gov/submissions';

  async searchCompany(ticker: string): Promise<any> {
    try {
      const response = await axios.get(
        `${this.baseURL}/CIK${this.formatCIK(ticker)}.json`
      );
      return response.data;
    } catch (error) {
      console.error('SEC EDGAR search error:', error);
      return null;
    }
  }

  async getFilings(cik: string, filingType = '10-K'): Promise<SECFiling[]> {
    try {
      const data = await this.searchCompany(cik);
      if (!data) return [];

      const filings = data.filings.recent.form
        .map((form: string, index: number) => ({
          filingType: form,
          date: data.filings.recent.filingDate[index],
          url: `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=${cik}&type=${form}&dateb=&owner=exclude&count=100`,
        }))
        .filter((f: any) => f.filingType.includes(filingType));

      return filings.map((f: any) => ({
        cik,
        company: data.entityName,
        filingType: f.filingType,
        date: f.date,
        url: f.url,
      }));
    } catch (error) {
      console.error('SEC EDGAR filings error:', error);
      return [];
    }
  }

  private formatCIK(cik: string): string {
    return cik.padStart(10, '0');
  }
}

/**
 * Google Trends API Integration
 */
export interface TrendData {
  keyword: string;
  trend: number; // 0-100 scale
  date: string;
  region: string;
  category: string;
}

export class GoogleTrendsAPI {
  async searchTrend(keyword: string, region = 'US'): Promise<TrendData[]> {
    try {
      // Note: Google Trends API requires unofficial library or scraping
      // This is a placeholder for the actual integration
      const response = await axios.get(
        `https://www.google.com/trends/api/trends/daily?hl=en-US`,
        {
          params: {
            q: keyword,
            geo: region,
          },
        }
      );

      // Parse and normalize response
      return [
        {
          keyword,
          trend: Math.random() * 100, // Placeholder
          date: new Date().toISOString(),
          region,
          category: 'business',
        },
      ];
    } catch (error) {
      console.error('Google Trends error:', error);
      return [];
    }
  }

  async getTrendingTopics(region = 'US'): Promise<string[]> {
    try {
      // Placeholder for trending topics
      return [
        'AI startups',
        'Climate tech',
        'Fintech',
        'SaaS',
        'Web3',
        'Cyber security',
        'Healthcare tech',
        'Edtech',
      ];
    } catch (error) {
      console.error('Google Trends topics error:', error);
      return [];
    }
  }
}

/**
 * FRED (Federal Reserve Economic Data) API
 */
export interface EconomicIndicator {
  name: string;
  series_id: string;
  value: number;
  date: string;
  units: string;
}

export class FREDApi {
  private client: APIClient;

  constructor(apiKey: string = process.env.FRED_API_KEY || '') {
    this.client = new APIClient('https://api.stlouisfed.org/fred', apiKey);
  }

  async getIndicator(seriesId: string): Promise<EconomicIndicator | null> {
    try {
      const data = await this.client.get<any>(
        `/series/observations?series_id=${seriesId}&limit=1`
      );

      if (data.observations.length === 0) return null;

      const latest = data.observations[data.observations.length - 1];
      return {
        name: seriesId,
        series_id: seriesId,
        value: parseFloat(latest.value),
        date: latest.date,
        units: data.units || 'index',
      };
    } catch (error) {
      console.error('FRED API error:', error);
      return null;
    }
  }

  async getIndicators(seriesIds: string[]): Promise<EconomicIndicator[]> {
    const results = await Promise.all(
      seriesIds.map((id) => this.getIndicator(id))
    );
    return results.filter((r) => r !== null) as EconomicIndicator[];
  }

  // Common economic indicators
  async getGDP(): Promise<EconomicIndicator | null> {
    return this.getIndicator('A191RA1Q225SBEA'); // Real GDP
  }

  async getUnemploymentRate(): Promise<EconomicIndicator | null> {
    return this.getIndicator('UNRATE'); // Unemployment rate
  }

  async getInflationRate(): Promise<EconomicIndicator | null> {
    return this.getIndicator('CPIAUCSL'); // CPI
  }

  async getInterestRate(): Promise<EconomicIndicator | null> {
    return this.getIndicator('FEDFUNDS'); // Federal funds rate
  }
}

/**
 * Alpha Vantage Stock Data API
 */
export interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: number;
  pe_ratio: number;
  dividend_yield: number;
  52week_high: number;
  52week_low: number;
}

export class AlphaVantageAPI {
  private client: APIClient;

  constructor(apiKey: string = process.env.ALPHA_VANTAGE_API_KEY || '') {
    this.client = new APIClient('https://www.alphavantage.co', apiKey);
  }

  async getQuote(symbol: string): Promise<StockData | null> {
    try {
      const data = await this.client.get<any>(
        `/query?function=GLOBAL_QUOTE&symbol=${symbol}`
      );

      if (!data['Global Quote']) return null;

      const quote = data['Global Quote'];
      return {
        symbol,
        price: parseFloat(quote['05. price']),
        change: parseFloat(quote['09. change']),
        changePercent: parseFloat(quote['10. change percent']),
        marketCap: parseFloat(quote['market_cap'] || '0'),
        pe_ratio: parseFloat(quote['pe_ratio'] || '0'),
        dividend_yield: parseFloat(quote['dividend_yield'] || '0'),
        52week_high: parseFloat(quote['52_week_high'] || '0'),
        52week_low: parseFloat(quote['52_week_low'] || '0'),
      };
    } catch (error) {
      console.error('Alpha Vantage error:', error);
      return null;
    }
  }

  async getCompanyOverview(symbol: string): Promise<any> {
    try {
      const data = await this.client.get<any>(
        `/query?function=OVERVIEW&symbol=${symbol}`
      );
      return data;
    } catch (error) {
      console.error('Alpha Vantage overview error:', error);
      return null;
    }
  }

  async getMonthlyTimeSeries(symbol: string): Promise<any> {
    try {
      const data = await this.client.get<any>(
        `/query?function=TIME_SERIES_MONTHLY&symbol=${symbol}`
      );
      return data;
    } catch (error) {
      console.error('Alpha Vantage time series error:', error);
      return null;
    }
  }
}

/**
 * PitchBook API Integration (Simplified)
 */
export interface PitchBookCompany {
  name: string;
  industry: string;
  fundingRound: string;
  valuation: number;
  investors: string[];
  comparables: string[];
  marketSize: number;
}

export class PitchBookAPI {
  private client: APIClient;

  constructor(apiKey: string = process.env.PITCHBOOK_API_KEY || '') {
    this.client = new APIClient('https://api.pitchbook.com/v1', apiKey);
  }

  async searchCompany(query: string): Promise<PitchBookCompany[]> {
    try {
      const data = await this.client.post<any>('/search/companies', {
        query,
        limit: 10,
      });

      return (data.companies || []).map((c: any) => ({
        name: c.name,
        industry: c.industry,
        fundingRound: c.last_funding_round?.type || 'Unknown',
        valuation: c.valuation || 0,
        investors: c.investors?.map((i: any) => i.name) || [],
        comparables: c.comparables?.map((comp: any) => comp.name) || [],
        marketSize: c.market_size || 0,
      }));
    } catch (error) {
      console.error('PitchBook search error:', error);
      return [];
    }
  }

  async getComparables(industry: string): Promise<PitchBookCompany[]> {
    try {
      const data = await this.client.post<any>('/search/comparables', {
        industry,
        limit: 20,
      });

      return (data.companies || []).map((c: any) => ({
        name: c.name,
        industry: c.industry,
        fundingRound: c.last_funding_round?.type || 'Unknown',
        valuation: c.valuation || 0,
        investors: c.investors?.map((i: any) => i.name) || [],
        comparables: [],
        marketSize: c.market_size || 0,
      }));
    } catch (error) {
      console.error('PitchBook comparables error:', error);
      return [];
    }
  }
}

/**
 * Unified External Data Integration
 */
export class ExternalDataIntegration {
  crunchbase: CrunchbaseAPI;
  sec: SECEdgarAPI;
  googleTrends: GoogleTrendsAPI;
  fred: FREDApi;
  alphaVantage: AlphaVantageAPI;
  pitchbook: PitchBookAPI;

  constructor() {
    this.crunchbase = new CrunchbaseAPI();
    this.sec = new SECEdgarAPI();
    this.googleTrends = new GoogleTrendsAPI();
    this.fred = new FREDApi();
    this.alphaVantage = new AlphaVantageAPI();
    this.pitchbook = new PitchBookAPI();
  }

  /**
   * Get comprehensive company intelligence
   */
  async getCompanyIntelligence(companyName: string) {
    return {
      crunchbase: await this.crunchbase.searchCompanies(companyName),
      pitchbook: await this.pitchbook.searchCompany(companyName),
      trends: await this.googleTrends.searchTrend(companyName),
    };
  }

  /**
   * Get market intelligence
   */
  async getMarketIntelligence(industry: string) {
    return {
      trends: await this.googleTrends.searchTrend(industry),
      comparables: await this.pitchbook.getComparables(industry),
      economicIndicators: await this.fred.getIndicators([
        'A191RA1Q225SBEA', // GDP
        'UNRATE', // Unemployment
      ]),
    };
  }

  /**
   * Get stock and financial data
   */
  async getFinancialData(symbol: string) {
    return {
      stockData: await this.alphaVantage.getQuote(symbol),
      overview: await this.alphaVantage.getCompanyOverview(symbol),
      filings: await this.sec.getFilings(symbol),
    };
  }
}
