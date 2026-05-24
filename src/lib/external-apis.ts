/**
 * External APIs - SIMPLIFIED FOR DEPLOYMENT
 * Only essential APIs included
 */

// Basic API Client
class APIClient {
  private baseUrl: string;
  private apiKey: string;

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}&api_key=${this.apiKey}`);
    return response.json();
  }
}

// FRED API
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

  async getGDP(): Promise<EconomicIndicator | null> {
    try {
      const data = await this.client.get<any>('/series/observations?series_id=A191RA1Q225SBEA&limit=1');
      if (!data.observations || data.observations.length === 0) return null;
      const latest = data.observations[data.observations.length - 1];
      return {
        name: 'GDP',
        series_id: 'A191RA1Q225SBEA',
        value: parseFloat(latest.value),
        date: latest.date,
        units: 'index',
      };
    } catch {
      return null;
    }
  }

  async getUnemploymentRate(): Promise<EconomicIndicator | null> {
    return null;
  }

  async getInflationRate(): Promise<EconomicIndicator | null> {
    return null;
  }

  async getInterestRate(): Promise<EconomicIndicator | null> {
    return null;
  }
}

// News API
export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
}

export class NewsAPI {
  private apiKey: string;

  constructor(apiKey: string = process.env.NEWS_API_KEY || '') {
    this.apiKey = apiKey;
  }

  async getTopHeadlines(category = 'business'): Promise<NewsArticle[]> {
    try {
      const response = await fetch(
        `https://newsapi.org/v2/top-headlines?category=${category}&apiKey=${this.apiKey}`
      );
      const data = await response.json();
      return data.articles || [];
    } catch {
      return [];
    }
  }
}

// Placeholder exports for other APIs
export class CrunchbaseAPI {
  async getCompany(id: string) {
    return null;
  }

  async searchCompanies(query: string) {
    return [];
  }
}

export class SECFilingsAPI {
  async getFilings(cik: string) {
    return [];
  }
}

export class GoogleTrendsAPI {
  async getTrendData(keyword: string) {
    return null;
  }
}

// Main integration class
export class ExternalDataIntegration {
  public fred: FREDApi;
  public news: NewsAPI;
  public crunchbase: CrunchbaseAPI;
  public sec: SECFilingsAPI;
  public trends: GoogleTrendsAPI;
  public alphaVantage: any;
  public pitchbook: any;
  public googleTrends: any;

  constructor() {
    this.fred = new FREDApi();
    this.news = new NewsAPI();
    this.crunchbase = new CrunchbaseAPI();
    this.sec = new SECFilingsAPI();
    this.trends = new GoogleTrendsAPI();
    this.alphaVantage = { getStockPrice: async () => null, getCompanyMetrics: async () => null };
    this.pitchbook = { searchFunding: async () => [] };
    this.googleTrends = { searchTrends: async () => null };
  }

  async getEconomicData() {
    const gdp = await this.fred.getGDP();
    return { gdp };
  }

  async getMarketNews(category = 'business') {
    return await this.news.getTopHeadlines(category);
  }

  async getCompanyData(companyId: string) {
    return await this.crunchbase.getCompany(companyId);
  }

  async getSECFilings(cik: string) {
    return await this.sec.getFilings(cik);
  }

  async getTrendData(keyword: string) {
    return await this.trends.getTrendData(keyword);
  }
}
