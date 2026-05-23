"""
MIZHAR Case Analyzer Module

Phase 2 of SPRINT 2: Real Case Studies System
Analyzes ingested startup cases using the Challenge Mode agent.

Features:
- Single and batch analysis
- Rate limiting to respect API quotas
- Parallel processing with ThreadPoolExecutor
- Progress tracking
- Result aggregation
"""

import json
import time
import logging
from typing import Dict, List, Optional, Callable
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime

from .agent import ChallengeModeAgent

logger = logging.getLogger(__name__)


class CaseAnalyzer:
    """Analyzes startup cases using Challenge Mode AI."""

    def __init__(self, max_workers: int = 3, rate_limit_delay: float = 0.5):
        """
        Initialize analyzer.

        Args:
            max_workers: Number of concurrent analysis threads
            rate_limit_delay: Minimum delay between API calls (seconds)
        """
        self.agent = ChallengeModeAgent(use_rag=True, use_live_data=True)
        self.max_workers = max_workers
        self.rate_limit_delay = rate_limit_delay
        self.last_api_call = 0
        self.analyzed_cases = []

    def _respect_rate_limit(self) -> None:
        """Enforce minimum delay between API calls."""
        elapsed = time.time() - self.last_api_call
        if elapsed < self.rate_limit_delay:
            time.sleep(self.rate_limit_delay - elapsed)
        self.last_api_call = time.time()

    def analyze_single(self, startup_data: Dict, include_rewrite: bool = True) -> Dict:
        """
        Analyze a single startup case.

        Args:
            startup_data: Normalized startup profile
            include_rewrite: Whether to generate strategic alternatives

        Returns:
            Complete analysis result
        """
        try:
            self._respect_rate_limit()

            startup_name = startup_data.get("name", "Unknown")
            print(f"  🔍 Analyzing: {startup_name}")

            # Build startup profile for agent
            profile = {
                "name": startup_data.get("name", ""),
                "description": startup_data.get("description", ""),
                "market": startup_data.get("sectors", ["Unknown"])[0] if startup_data.get("sectors") else "Unknown",
                "stage": startup_data.get("stage", "Unknown"),
                "funding_ask": startup_data.get("total_funding", 0),
                "team": startup_data.get("team_size", "Unknown"),
                "traction": startup_data.get("traction", "Not provided"),
                "product": startup_data.get("product", "Not provided"),
                "data_source": startup_data.get("data_source", "unknown"),
            }

            # Run Challenge Mode analysis
            analysis_result = self.agent.analyze_startup(profile)

            result = {
                "startup_name": startup_name,
                "original_data": startup_data,
                "challenge_analysis": analysis_result,
                "analyzed_at": datetime.now().isoformat(),
            }

            # Generate strategic rewrite if requested
            if include_rewrite:
                rewrite_result = self.agent.propose_strategic_rewrite(
                    profile,
                    analysis_result["analysis"]
                )
                result["strategic_alternatives"] = rewrite_result

            print(f"     ✅ Analysis complete for {startup_name}")

            return result

        except Exception as e:
            logger.error(f"Error analyzing {startup_data.get('name', 'Unknown')}: {str(e)}")
            return {
                "startup_name": startup_data.get("name", "Unknown"),
                "error": str(e),
                "analyzed_at": datetime.now().isoformat(),
            }

    def analyze_batch(self, startup_cases: List[Dict], progress_callback: Optional[Callable] = None) -> Dict:
        """
        Analyze multiple startup cases in parallel with rate limiting.

        Args:
            startup_cases: List of normalized startup profiles
            progress_callback: Optional callback function for progress updates

        Returns:
            Aggregated analysis results
        """
        print(f"\n📊 BATCH CASE ANALYSIS")
        print(f"Cases to analyze: {len(startup_cases)}")
        print(f"Max workers: {self.max_workers}")
        print("=" * 70)

        results = {
            "total_cases": len(startup_cases),
            "analyses": [],
            "summary": {
                "successful": 0,
                "failed": 0,
                "start_time": datetime.now().isoformat(),
            }
        }

        # Process in parallel
        with ThreadPoolExecutor(max_workers=self.max_workers) as executor:
            futures = {
                executor.submit(self.analyze_single, case): idx
                for idx, case in enumerate(startup_cases)
            }

            completed = 0
            for future in as_completed(futures):
                try:
                    analysis = future.result()
                    results["analyses"].append(analysis)

                    if "error" not in analysis:
                        results["summary"]["successful"] += 1
                    else:
                        results["summary"]["failed"] += 1

                    completed += 1
                    if progress_callback:
                        progress_callback(completed, len(startup_cases))

                except Exception as e:
                    logger.error(f"Batch processing error: {str(e)}")
                    results["summary"]["failed"] += 1

        results["summary"]["end_time"] = datetime.now().isoformat()
        self.analyzed_cases.extend(results["analyses"])

        print(f"\n✅ Batch analysis complete")
        print(f"   Successful: {results['summary']['successful']}")
        print(f"   Failed: {results['summary']['failed']}")

        return results

    def extract_verdicts(self) -> Dict:
        """
        Extract all verdicts from analyzed cases.

        Returns:
            Dictionary of verdicts by startup
        """
        verdicts = {}

        for case in self.analyzed_cases:
            startup_name = case.get("startup_name", "Unknown")
            analysis = case.get("challenge_analysis", {})
            analysis_text = analysis.get("analysis", "")

            # Extract verdict from analysis text (first line typically contains verdict)
            verdict = "UNKNOWN"
            if "CONDITIONAL" in analysis_text:
                verdict = "CONDITIONAL"
            elif "PASS" in analysis_text:
                verdict = "PASS"
            elif "FAIL" in analysis_text:
                verdict = "FAIL"

            verdicts[startup_name] = verdict

        return verdicts

    def extract_risk_scores(self) -> Dict:
        """
        Extract risk scores from analyzed cases.

        Returns:
            Dictionary of risk scores by startup
        """
        risk_scores = {}

        for case in self.analyzed_cases:
            startup_name = case.get("startup_name", "Unknown")
            analysis = case.get("challenge_analysis", {})
            analysis_text = analysis.get("analysis", "")

            # Extract risk score (look for "Risk Score: X/10" pattern)
            risk_score = None
            import re
            match = re.search(r"Risk Score:\s*(\d+)/10", analysis_text)
            if match:
                risk_score = int(match.group(1))

            risk_scores[startup_name] = risk_score

        return risk_scores

    def extract_critical_issues(self) -> Dict:
        """
        Extract critical issues from all analyses.

        Returns:
            Dictionary of critical issues by startup
        """
        issues = {}

        for case in self.analyzed_cases:
            startup_name = case.get("startup_name", "Unknown")
            analysis = case.get("challenge_analysis", {})
            analysis_text = analysis.get("analysis", "")

            # Extract critical issues section
            critical_issues = []
            lines = analysis_text.split("\n")

            in_critical_section = False
            for line in lines:
                if "CRITICAL ISSUES" in line:
                    in_critical_section = True
                    continue
                elif in_critical_section and ("MAJOR CONCERNS" in line or "Strategic" in line):
                    break
                elif in_critical_section and line.strip().startswith("-"):
                    critical_issues.append(line.strip()[2:])

            issues[startup_name] = critical_issues

        return issues

    def get_analyzed_count(self) -> int:
        """Get total number of analyzed cases."""
        return len(self.analyzed_cases)

    def export_analyses(self, filepath: str) -> None:
        """
        Export all analyses to JSON file.

        Args:
            filepath: Output file path
        """
        with open(filepath, 'w') as f:
            json.dump(self.analyzed_cases, f, indent=2, default=str)
        logger.info(f"Exported {len(self.analyzed_cases)} analyses to {filepath}")

    def generate_summary_report(self) -> Dict:
        """
        Generate summary statistics of all analyses.

        Returns:
            Summary report with statistics
        """
        verdicts = self.extract_verdicts()
        risk_scores = self.extract_risk_scores()

        verdict_counts = {}
        for verdict in verdicts.values():
            verdict_counts[verdict] = verdict_counts.get(verdict, 0) + 1

        avg_risk_score = None
        if risk_scores and any(v is not None for v in risk_scores.values()):
            scores = [v for v in risk_scores.values() if v is not None]
            avg_risk_score = sum(scores) / len(scores) if scores else None

        return {
            "total_analyzed": len(self.analyzed_cases),
            "verdict_distribution": verdict_counts,
            "average_risk_score": avg_risk_score,
            "analysis_timestamp": datetime.now().isoformat(),
            "verdicts_by_startup": verdicts,
            "risk_scores_by_startup": risk_scores,
        }


class BatchProcessor:
    """
    Orchestrator for large-scale batch processing with progress tracking.
    """

    def __init__(self, analyzer: CaseAnalyzer, batch_size: int = 10):
        """
        Initialize batch processor.

        Args:
            analyzer: CaseAnalyzer instance
            batch_size: Number of cases per batch
        """
        self.analyzer = analyzer
        self.batch_size = batch_size

    def process_with_progress(self, startup_cases: List[Dict]) -> Dict:
        """
        Process cases with progress tracking.

        Args:
            startup_cases: List of startup cases

        Returns:
            Complete processing results
        """
        total_cases = len(startup_cases)
        total_batches = (total_cases + self.batch_size - 1) // self.batch_size

        all_results = {
            "total_cases": total_cases,
            "batches": [],
            "summary": {
                "start_time": datetime.now().isoformat(),
                "successful": 0,
                "failed": 0,
            }
        }

        print(f"\n🚀 BATCH PROCESSING WITH PROGRESS")
        print(f"Total cases: {total_cases}")
        print(f"Batch size: {self.batch_size}")
        print(f"Total batches: {total_batches}")
        print("=" * 70)

        for batch_num in range(total_batches):
            start_idx = batch_num * self.batch_size
            end_idx = min(start_idx + self.batch_size, total_cases)
            batch = startup_cases[start_idx:end_idx]

            print(f"\nBatch {batch_num + 1}/{total_batches} (cases {start_idx + 1}-{end_idx})")

            # Progress callback
            def on_progress(current, total):
                pct = (current / total) * 100
                print(f"  Progress: {current}/{total} ({pct:.0f}%)")

            batch_result = self.analyzer.analyze_batch(batch, progress_callback=on_progress)
            all_results["batches"].append(batch_result)

            # Aggregate results
            all_results["summary"]["successful"] += batch_result["summary"]["successful"]
            all_results["summary"]["failed"] += batch_result["summary"]["failed"]

        all_results["summary"]["end_time"] = datetime.now().isoformat()

        return all_results

    def export_complete_results(self, analyses_file: str, summary_file: str) -> None:
        """
        Export complete results.

        Args:
            analyses_file: Path to save detailed analyses
            summary_file: Path to save summary report
        """
        # Export analyses
        self.analyzer.export_analyses(analyses_file)

        # Export summary
        summary = self.analyzer.generate_summary_report()
        with open(summary_file, 'w') as f:
            json.dump(summary, f, indent=2, default=str)

        logger.info(f"Exported analyses to {analyses_file}")
        logger.info(f"Exported summary to {summary_file}")


def create_case_analyzer() -> CaseAnalyzer:
    """Factory function to create configured analyzer."""
    return CaseAnalyzer()
