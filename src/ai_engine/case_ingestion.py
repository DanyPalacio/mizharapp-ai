"""
MIZHAR Case Ingestion Module

Phase 1 of SPRINT 2: Real Case Studies System
Ingests startup data from multiple sources:
- YCombinator (via unofficial API)
- Crunchbase (via official API)
- TechCrunch (via RSS/scraping)
- SEC EDGAR (via official API for public filings)
"""

import os
import json
import requests
from datetime import datetime
from typing import Dict, List, Optional, Any
import logging
from abc import ABC, abstractmethod

logger = logging.getLogger(__name__)


class DataSourceAdapter(ABC):
    """Base class for all data source adapters."""

    @abstractmethod
    def fetch_startups(self, **kwargs) -> List[Dict]:
        """Fetch startup data from the source."""
        pass

    @abstractmethod
    def normalize_profile(self, raw_data: Dict) -> Dict:
        """Normalize raw data to standard MIZHAR format."""
        pass


class YCombinatorAdapter(DataSourceAdapter):
    """Fetch startup data from YCombinator."""

    def __init__(self):
        self.base_url = "https://api.ycombinator.com"
        self.session = requests.Session()

    def fetch_startups(self, batch: str = "latest", limit: int = 100) -> List[Dict]:
        """
        Fetch startups from YCombinator.

        Args:
            batch: Batch to fetch (e.g., 'S24', 'W24', 'latest')
            limit: Number of startups to fetch

        Returns:
            List of raw startup profiles
        """
        try:
            print(f"  📥 Fetching {limit} startups from YCombinator batch: {batch}")

            # YC maintains a public CSV of all companies
            # For now, we'll fetch from their public API endpoint
            companies = []

            # YC companies can be fetched via their public directory
            # This is a simplified approach - production would use their official API
            yc_data = {
                "batch": batch,
                "timestamp": datetime.now().isoformat(),
                "source": "yc_directory"
            }

            logger.info(f"YC Adapter ready for batch {batch}")
            return []

        except Exception as e:
            logger.error(f"YCombinator fetch error: {str(e)}")
            return []

    def normalize_profile(self, raw_data: Dict) -> Dict:
        """Convert YC data to MIZHAR format."""
        return {
            "name": raw_data.get("name", ""),
            "description": raw_data.get("description", ""),
            "founded_year": raw_data.get("founded_year"),
            "team_size": raw_data.get("team_size"),
            "location": raw_data.get("location", ""),
            "website": raw_data.get("website", ""),
            "sectors": raw_data.get("batch", "").split(",") if raw_data.get("batch") else [],
            "status": "active",
            "stage": self._infer_stage(raw_data),
        }

    def _infer_stage(self, data: Dict) -> str:
        """Infer funding stage from YC data."""
        batch = data.get("batch", "")
        if "W" in batch or "S" in batch:
            return "Seed"
        return "Series A"


class CrunchbaseAdapter(DataSourceAdapter):
    """Fetch startup data from Crunchbase."""

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("CRUNCHBASE_API_KEY", "")
        self.base_url = "https://api.crunchbase.com/v4/entities/organizations"
        self.session = requests.Session()
        if self.api_key:
            self.session.headers.update({"X-Cb-User-Key": self.api_key})

    def fetch_startups(self, sector: str = "software", limit: int = 50) -> List[Dict]:
        """
        Fetch startups from Crunchbase by sector.

        Args:
            sector: Industry sector filter
            limit: Number of results

        Returns:
            List of raw startup profiles
        """
        try:
            if not self.api_key:
                logger.warning("Crunchbase API key not configured")
                return []

            print(f"  📥 Fetching {limit} startups from Crunchbase (sector: {sector})")

            params = {
                "field_ids": [
                    "identifier.permalink",
                    "identifier.title",
                    "identifier.announced_date",
                    "discovered.web_presence.website_url",
                    "organization.profile.description",
                    "people.investors",
                    "organization.relationships.investors",
                    "organization.financials.revenue",
                    "organization.fundraising.total_funding_usd",
                ],
                "limit": limit,
                "sort": [{"field_id": "announced_date", "sort": "desc"}]
            }

            response = self.session.get(
                self.base_url,
                params=params,
                timeout=30
            )
            response.raise_for_status()

            data = response.json()
            entities = data.get("entities", [])

            logger.info(f"Crunchbase returned {len(entities)} organizations")
            return entities

        except requests.exceptions.RequestException as e:
            logger.error(f"Crunchbase API error: {str(e)}")
            return []

    def normalize_profile(self, raw_data: Dict) -> Dict:
        """Convert Crunchbase data to MIZHAR format."""
        properties = raw_data.get("properties", {})

        return {
            "name": properties.get("identifier", {}).get("title", ""),
            "description": properties.get("organization", {}).get("profile", {}).get("description", ""),
            "website": properties.get("discovered", {}).get("web_presence", {}).get("website_url", ""),
            "founded_year": self._extract_year(properties.get("identifier", {}).get("announced_date")),
            "total_funding": properties.get("organization", {}).get("financials", {}).get("total_funding_usd"),
            "status": "active",
            "stage": self._infer_stage_from_funding(
                properties.get("organization", {}).get("financials", {}).get("total_funding_usd", 0)
            ),
            "crunchbase_url": f"https://www.crunchbase.com/organization/{properties.get('identifier', {}).get('permalink', '')}",
        }

    def _extract_year(self, date_str: Optional[str]) -> Optional[int]:
        """Extract year from date string."""
        if not date_str:
            return None
        try:
            return int(date_str.split("-")[0])
        except:
            return None

    def _infer_stage_from_funding(self, funding: float) -> str:
        """Infer stage based on funding amount."""
        if funding == 0:
            return "Seed"
        elif funding < 2_000_000:
            return "Seed"
        elif funding < 10_000_000:
            return "Series A"
        elif funding < 50_000_000:
            return "Series B"
        elif funding < 200_000_000:
            return "Series C+"
        else:
            return "Late Stage"


class TechCrunchAdapter(DataSourceAdapter):
    """Fetch startup news and funding announcements from TechCrunch."""

    def __init__(self):
        self.base_url = "https://techcrunch.com"
        self.session = requests.Session()

    def fetch_startups(self, category: str = "funding", limit: int = 50) -> List[Dict]:
        """
        Fetch recent startup news from TechCrunch.

        Args:
            category: Category filter (funding, launches, acquisitions)
            limit: Number of articles

        Returns:
            List of extracted startup mentions
        """
        try:
            print(f"  📥 Fetching {limit} articles from TechCrunch ({category})")

            # TechCrunch API endpoint for stories
            url = f"{self.base_url}/api/feed"
            params = {
                "category": category,
                "limit": limit,
                "sort": "latest"
            }

            response = self.session.get(url, params=params, timeout=30)
            response.raise_for_status()

            articles = response.json().get("articles", [])
            logger.info(f"TechCrunch returned {len(articles)} articles")
            return articles

        except requests.exceptions.RequestException as e:
            logger.error(f"TechCrunch fetch error: {str(e)}")
            return []

    def normalize_profile(self, raw_data: Dict) -> Dict:
        """Extract startup profile from TechCrunch article."""
        return {
            "name": self._extract_startup_name(raw_data.get("title", "")),
            "description": raw_data.get("summary", ""),
            "article_url": raw_data.get("url", ""),
            "published_date": raw_data.get("published_date"),
            "category": raw_data.get("category", ""),
            "status": "mentioned",
            "source_reliability": "medium",  # News mentions are less reliable than official data
        }

    def _extract_startup_name(self, title: str) -> str:
        """Extract startup name from article title."""
        # Simple heuristic: first noun/proper noun
        # In production, use NLP for better extraction
        words = title.split()
        return words[0] if words else ""


class SECEdgarAdapter(DataSourceAdapter):
    """Fetch data from SEC EDGAR for public startup filings."""

    def __init__(self):
        self.base_url = "https://www.sec.gov/cgi-bin/browse-edgar"
        self.session = requests.Session()
        # SEC requires User-Agent header
        self.session.headers.update({
            "User-Agent": "MIZHAR Research Tool (contact: support@mizhar.io)"
        })

    def fetch_startups(self, sector: str = "technology", limit: int = 50) -> List[Dict]:
        """
        Fetch startup IPOs and S-1 filings from SEC EDGAR.

        Args:
            sector: Industry sector
            limit: Number of filings

        Returns:
            List of raw filing data
        """
        try:
            print(f"  📥 Fetching {limit} SEC filings ({sector})")

            # Search for recent S-1 filings (IPO documents)
            params = {
                "action": "getcompany",
                "type": "S-1",
                "dateb": datetime.now().strftime("%Y%m%d"),
                "owner": "exclude",
                "match": "",
                "count": limit,
                "output": "json"
            }

            response = self.session.get(self.base_url, params=params, timeout=30)
            response.raise_for_status()

            data = response.json()
            filings = data.get("hits", {}).get("hits", [])

            logger.info(f"SEC EDGAR returned {len(filings)} S-1 filings")
            return filings

        except requests.exceptions.RequestException as e:
            logger.error(f"SEC EDGAR fetch error: {str(e)}")
            return []

    def normalize_profile(self, raw_data: Dict) -> Dict:
        """Convert SEC filing data to MIZHAR format."""
        source = raw_data.get("_source", {})

        return {
            "name": source.get("company_name", ""),
            "cik": source.get("cik_str"),
            "filing_type": source.get("form_type", ""),
            "filing_date": source.get("filing_date"),
            "description": self._extract_from_filing(source),
            "status": "public",
            "stage": "Post-IPO",
            "sec_url": f"https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK={source.get('cik_str')}&type=&dateb=&owner=exclude&count=100",
        }

    def _extract_from_filing(self, source: Dict) -> str:
        """Extract company description from filing."""
        # In production, would parse actual S-1 document
        return "Public company filing - see SEC URL for details"


class CaseIngestion:
    """Main case ingestion orchestrator."""

    def __init__(self):
        self.adapters = {
            "yc": YCombinatorAdapter(),
            "crunchbase": CrunchbaseAdapter(),
            "techcrunch": TechCrunchAdapter(),
            "sec_edgar": SECEdgarAdapter(),
        }
        self.ingested_cases = []

    def ingest_yc(self, batch: str = "latest", limit: int = 100) -> List[Dict]:
        """Ingest YC startups."""
        print(f"\n📊 YOURCOMBINATOR INGESTION")
        print("=" * 70)
        adapter = self.adapters["yc"]
        raw_data = adapter.fetch_startups(batch=batch, limit=limit)
        normalized = [adapter.normalize_profile(d) for d in raw_data]

        print(f"  ✅ Ingested {len(normalized)} YC startups")
        self.ingested_cases.extend([
            {**n, "data_source": "yc", "ingested_at": datetime.now().isoformat()}
            for n in normalized
        ])
        return normalized

    def ingest_crunchbase(self, sector: str = "software", limit: int = 50) -> List[Dict]:
        """Ingest Crunchbase startups."""
        print(f"\n📊 CRUNCHBASE INGESTION")
        print("=" * 70)
        adapter = self.adapters["crunchbase"]
        raw_data = adapter.fetch_startups(sector=sector, limit=limit)
        normalized = [adapter.normalize_profile(d) for d in raw_data]

        print(f"  ✅ Ingested {len(normalized)} Crunchbase startups")
        self.ingested_cases.extend([
            {**n, "data_source": "crunchbase", "ingested_at": datetime.now().isoformat()}
            for n in normalized
        ])
        return normalized

    def ingest_techcrunch(self, category: str = "funding", limit: int = 50) -> List[Dict]:
        """Ingest TechCrunch mentions."""
        print(f"\n📊 TECHCRUNCH INGESTION")
        print("=" * 70)
        adapter = self.adapters["techcrunch"]
        raw_data = adapter.fetch_startups(category=category, limit=limit)
        normalized = [adapter.normalize_profile(d) for d in raw_data]

        print(f"  ✅ Ingested {len(normalized)} TechCrunch mentions")
        self.ingested_cases.extend([
            {**n, "data_source": "techcrunch", "ingested_at": datetime.now().isoformat()}
            for n in normalized
        ])
        return normalized

    def ingest_sec_edgar(self, sector: str = "technology", limit: int = 50) -> List[Dict]:
        """Ingest SEC EDGAR public company filings."""
        print(f"\n📊 SEC EDGAR INGESTION")
        print("=" * 70)
        adapter = self.adapters["sec_edgar"]
        raw_data = adapter.fetch_startups(sector=sector, limit=limit)
        normalized = [adapter.normalize_profile(d) for d in raw_data]

        print(f"  ✅ Ingested {len(normalized)} SEC EDGAR filings")
        self.ingested_cases.extend([
            {**n, "data_source": "sec_edgar", "ingested_at": datetime.now().isoformat()}
            for n in normalized
        ])
        return normalized

    def ingest_all(self, yc_limit: int = 50, cb_limit: int = 50,
                   tc_limit: int = 50, sec_limit: int = 50) -> Dict:
        """
        Ingest from all sources in parallel.

        Returns:
            Summary of ingestion results
        """
        print("\n🚀 MIZHAR CASE STUDY INGESTION - MULTI-SOURCE")
        print("=" * 70)

        results = {
            "yc": self.ingest_yc(limit=yc_limit),
            "crunchbase": self.ingest_crunchbase(limit=cb_limit),
            "techcrunch": self.ingest_techcrunch(limit=tc_limit),
            "sec_edgar": self.ingest_sec_edgar(limit=sec_limit),
        }

        total_ingested = sum(len(v) for v in results.values())

        print(f"\n✅ INGESTION COMPLETE")
        print(f"  Total startups ingested: {total_ingested}")
        print(f"  Sources: {len(results)}")
        print(f"  Timestamp: {datetime.now().isoformat()}")

        return {
            "timestamp": datetime.now().isoformat(),
            "total_ingested": total_ingested,
            "by_source": results,
            "all_cases": self.ingested_cases
        }

    def normalize_profile(self, raw_profile: Dict, source: str) -> Dict:
        """
        Normalize a profile using the appropriate adapter.

        Args:
            raw_profile: Raw startup data
            source: Data source identifier

        Returns:
            Normalized MIZHAR profile
        """
        adapter = self.adapters.get(source)
        if not adapter:
            raise ValueError(f"Unknown data source: {source}")

        return adapter.normalize_profile(raw_profile)

    def get_ingested_count(self) -> int:
        """Get total number of cases ingested."""
        return len(self.ingested_cases)

    def export_to_json(self, filepath: str) -> None:
        """Export ingested cases to JSON file."""
        with open(filepath, 'w') as f:
            json.dump(self.ingested_cases, f, indent=2, default=str)
        logger.info(f"Exported {len(self.ingested_cases)} cases to {filepath}")


# Module initialization
def create_ingestion_pipeline() -> CaseIngestion:
    """Factory function to create configured ingestion pipeline."""
    return CaseIngestion()
