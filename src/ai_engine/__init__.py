"""
MIZHAR AI Intelligence Engine

Three-layer architecture:
- Layer 1: Live APIs (FRED, Google Trends, SEC EDGAR, Crunchbase)
- Layer 2: RAG Knowledge System (McKinsey, BCG, MIT, arXiv via pgvector)
- Layer 3: Venture Intelligence Engine (Claude 3.5 Sonnet reasoning)
"""

from .prompts import CHALLENGE_MODE_PROMPT, STRATEGIC_REWRITE_PROMPT
from .apis import MarketIntel
from .rag import RAG
from .agent import ChallengeModeAgent
from .case_ingestion import CaseIngestion, create_ingestion_pipeline
from .case_analyzer import CaseAnalyzer, BatchProcessor, create_case_analyzer
from .blog_generator import BlogGenerator, create_blog_generator
from .comparison_engine import ComparisonEngine, create_comparison_engine

__all__ = [
    "CHALLENGE_MODE_PROMPT",
    "STRATEGIC_REWRITE_PROMPT",
    "MarketIntel",
    "RAG",
    "ChallengeModeAgent",
    "CaseIngestion",
    "create_ingestion_pipeline",
    "CaseAnalyzer",
    "BatchProcessor",
    "create_case_analyzer",
    "BlogGenerator",
    "create_blog_generator",
    "ComparisonEngine",
    "create_comparison_engine",
]

__version__ = "1.0.0"
