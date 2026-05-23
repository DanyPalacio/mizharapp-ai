"""
MIZHAR Live Data APIs

Layer 1: Real-time market data from authoritative sources
- FRED: Economic indicators from Federal Reserve
- Google Trends: Market timing and search interest
- Industry benchmarks: SaaS/Startup metrics
"""

import os
from datetime import datetime, timedelta
import fredapi
import requests
from pytrends.request import TrendReq
import json

class MarketIntel:
    """Access real-time market intelligence from multiple sources."""
    
    def __init__(self):
        self.fred_key = os.getenv("FRED_API_KEY")
        self.fred = fredapi.Fred(api_key=self.fred_key)
        self.trends = TrendReq(hl='en-US', tz=360)
        
        # Cache for API calls (simple in-memory, would be pgvector in production)
        self.cache = {}
        self.cache_time = {}
    
    def _is_cached(self, key: str, max_age_hours=24) -> bool:
        """Check if cached data is still fresh."""
        if key not in self.cache:
            return False
        age = datetime.now() - self.cache_time.get(key, datetime.min)
        return age < timedelta(hours=max_age_hours)
    
    def get_econ_indicators(self) -> dict:
        """Fetch key economic indicators from Federal Reserve (FRED).
        
        Returns metrics relevant to startup valuation:
        - GDP growth rate
        - Unemployment rate  
        - Fed funds rate
        - Yield curve
        - Tech sector performance
        """
        if self._is_cached("econ"):
            return self.cache["econ"]
        
        try:
            data = {
                "timestamp": datetime.now().isoformat(),
                "indicators": {}
            }
            
            # Key economic indicators
            indicators = {
                "GDP_GROWTH": "A191RL1Q225SBEA",  # Real GDP growth
                "UNEMPLOYMENT": "UNRATE",           # Unemployment rate
                "FED_FUNDS": "FEDFUNDS",            # Fed funds rate
                "10Y_YIELD": "DGS10",               # 10-year treasury yield
                "VIX": "VIXCLS",                    # Market volatility
            }
            
            for name, code in indicators.items():
                try:
                    value = self.fred.get_series(code)
                    data["indicators"][name] = float(value.iloc[-1])
                except Exception as e:
                    data["indicators"][name] = None
                    print(f"Warning: Could not fetch {name}: {str(e)}")
            
            self.cache["econ"] = data
            self.cache_time["econ"] = datetime.now()
            return data
            
        except Exception as e:
            print(f"Error fetching economic data: {str(e)}")
            return {"error": str(e)}
    
    def get_market_timing(self, keywords: list[str]) -> dict:
        """Analyze market interest and timing using Google Trends.
        
        Args:
            keywords: List of keywords to analyze (e.g., ["AI", "SaaS", "DevOps"])
        
        Returns:
            Trend data showing search interest over time and geography
        """
        if not keywords:
            return {"error": "No keywords provided"}
        
        cache_key = f"trends_{','.join(keywords)}"
        if self._is_cached(cache_key):
            return self.cache[cache_key]
        
        try:
            data = {
                "timestamp": datetime.now().isoformat(),
                "keywords": keywords,
                "trends": {}
            }
            
            # Google Trends (past 5 years)
            try:
                # Try using timeframe parameter
                interest = self.trends.interest_over_time(timeframe='today 5-y', kw_list=keywords)
            except:
                # Fallback: use get_historical_interest
                try:
                    interest = self.trends.get_historical_interest(keywords, year_start=2019, month_start=1, day_start=1, hour_start=0, 
                                                                   year_end=2024, month_end=12, day_end=31, hour_end=23, cat=0, 
                                                                   gprop='', sleep=0)
                except:
                    # Final fallback: return empty data
                    return {"error": "Google Trends API temporarily unavailable"}
            
            data["trends"]["interest_over_time"] = {
                "dates": interest.index.strftime('%Y-%m-%d').tolist(),
                "values": interest[keywords[0]].tolist() if len(keywords) > 0 else []
            }
            
            # Regional interest
            interest_by_region = self.trends.interest_by_region()
            data["trends"]["top_regions"] = interest_by_region.head(10).to_dict()
            
            self.cache[cache_key] = data
            self.cache_time[cache_key] = datetime.now()
            return data
            
        except Exception as e:
            print(f"Error fetching trends: {str(e)}")
            return {"error": str(e)}
    
    def get_industry_benchmarks(self, industry: str = "SaaS") -> dict:
        """Get industry-specific benchmarks for evaluating startups.
        
        Args:
            industry: Industry type (SaaS, FinTech, MarketPlace, etc)
        
        Returns:
            Benchmark metrics: CAC, LTV, magic number, payback period, etc
        """
        cache_key = f"benchmarks_{industry}"
        if self._is_cached(cache_key):
            return self.cache[cache_key]
        
        # Aggregate benchmarks from public data (OpenView, Bessemer, etc)
        benchmarks = {
            "SaaS": {
                "gross_margin_target": 0.75,  # 75% is typical
                "cac_payback_months": 12,      # Months to recoup CAC
                "ltv_cac_ratio": 3.0,          # LTV should be 3x CAC
                "magic_number": 0.75,          # (ARR Growth / Sales & Mktg)
                "annual_churn": 0.05,          # 5% annual churn healthy
                "burn_multiple": 1.5,          # Revenue / Burn rate
                "rule_of_40": 40,              # Growth rate + Profit margin
            },
            "MarketPlace": {
                "gross_margin_target": 0.30,
                "cac_payback_months": 8,
                "ltv_cac_ratio": 2.5,
                "magic_number": 0.60,
                "annual_churn": 0.10,
                "network_effect_critical": True,
            },
            "FinTech": {
                "gross_margin_target": 0.65,
                "cac_payback_months": 18,
                "ltv_cac_ratio": 3.5,
                "regulatory_risk": "High",
                "customer_acquisition_complexity": "High",
            }
        }
        
        data = {
            "timestamp": datetime.now().isoformat(),
            "industry": industry,
            "benchmarks": benchmarks.get(industry, benchmarks["SaaS"])
        }
        
        self.cache[cache_key] = data
        self.cache_time[cache_key] = datetime.now()
        return data
    
    def get_competitor_funding(self, competitor_name: str) -> dict:
        """Get recent funding data for competitors (would integrate with Crunchbase).
        
        This is a placeholder - in production would call Crunchbase API.
        """
        return {
            "note": "Crunchbase integration required",
            "competitor": competitor_name,
            "requires_api_key": "CRUNCHBASE_API_KEY"
        }

    def health_check(self) -> dict:
        """Verify all API connections are working."""
        status = {
            "timestamp": datetime.now().isoformat(),
            "apis": {}
        }
        
        # Check FRED
        try:
            self.fred.get_series("UNRATE")
            status["apis"]["FRED"] = "✅ Connected"
        except Exception as e:
            status["apis"]["FRED"] = f"❌ Error: {str(e)}"
        
        # Check Google Trends  
        try:
            self.trends.build(kw_list=["test"], timeframe='today 1-m')
            status["apis"]["GoogleTrends"] = "✅ Connected"
        except Exception as e:
            status["apis"]["GoogleTrends"] = f"❌ Error: {str(e)}"
        
        return status
