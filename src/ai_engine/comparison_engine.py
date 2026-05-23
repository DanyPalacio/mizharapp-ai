"""
MIZHAR Comparison Engine Module

Phase 4 of SPRINT 2: Real Case Studies System
Finds similar cases and generates comparative analytics.

Features:
- Semantic similarity matching
- Verdict aggregation by sector/stage
- Risk profile clustering
- Recommendation generation
"""

import json
import logging
from typing import Dict, List, Optional, Tuple
from datetime import datetime
from collections import defaultdict

logger = logging.getLogger(__name__)


class ComparisonEngine:
    """Analyzes and compares startup cases."""

    def __init__(self, analyses: List[Dict]):
        """
        Initialize comparison engine.

        Args:
            analyses: List of case analyses
        """
        self.analyses = analyses
        self.comparisons = []

    def find_similar_cases(self, startup_name: str, similarity_threshold: float = 0.5) -> List[Tuple[str, float]]:
        """
        Find cases similar to a given startup.

        Args:
            startup_name: Target startup name
            similarity_threshold: Minimum similarity score (0-1)

        Returns:
            List of (startup_name, similarity_score) tuples
        """
        # Find target case
        target_case = None
        for case in self.analyses:
            if case.get("startup_name") == startup_name:
                target_case = case
                break

        if not target_case:
            logger.warning(f"Case not found: {startup_name}")
            return []

        target_data = target_case.get("original_data", {})
        similar = []

        for case in self.analyses:
            if case.get("startup_name") == startup_name:
                continue

            case_data = case.get("original_data", {})

            # Calculate similarity across multiple dimensions
            similarity = self._calculate_similarity(target_data, case_data)

            if similarity >= similarity_threshold:
                similar.append((case.get("startup_name"), similarity))

        # Sort by similarity (descending)
        similar.sort(key=lambda x: x[1], reverse=True)

        return similar

    def _calculate_similarity(self, profile1: Dict, profile2: Dict) -> float:
        """
        Calculate similarity between two startup profiles.

        Uses:
        - Stage matching (same stage = 1.0, adjacent = 0.7, different = 0.3)
        - Market/sector matching (same sector = 1.0, different = 0.4)
        - Funding proximity (closer = higher score)
        """
        scores = []

        # Stage similarity
        stage1 = profile1.get("stage", "Unknown")
        stage2 = profile2.get("stage", "Unknown")

        if stage1 == stage2:
            scores.append(1.0)
        elif self._are_adjacent_stages(stage1, stage2):
            scores.append(0.7)
        else:
            scores.append(0.3)

        # Market/sector similarity
        sectors1 = set(profile1.get("sectors", []))
        sectors2 = set(profile2.get("sectors", []))

        if sectors1 & sectors2:  # Any overlap
            scores.append(1.0)
        else:
            scores.append(0.4)

        # Funding similarity (normalized)
        funding1 = profile1.get("total_funding", 0) or 0
        funding2 = profile2.get("total_funding", 0) or 0

        if funding1 == 0 and funding2 == 0:
            scores.append(1.0)
        elif funding1 == 0 or funding2 == 0:
            scores.append(0.5)
        else:
            ratio = min(funding1, funding2) / max(funding1, funding2)
            scores.append(ratio)

        # Average all scores
        return sum(scores) / len(scores)

    def _are_adjacent_stages(self, stage1: str, stage2: str) -> bool:
        """Check if two stages are adjacent."""
        stage_order = ["Seed", "Series A", "Series B", "Series C+", "Late Stage", "Post-IPO"]

        try:
            idx1 = stage_order.index(stage1)
            idx2 = stage_order.index(stage2)
            return abs(idx1 - idx2) == 1
        except ValueError:
            return False

    def compare_verdicts_by_sector(self) -> Dict[str, Dict]:
        """
        Aggregate verdicts by sector.

        Returns:
            Dictionary of sectors with verdict distributions
        """
        by_sector = defaultdict(lambda: defaultdict(int))
        total_by_sector = defaultdict(int)

        for case in self.analyses:
            original_data = case.get("original_data", {})
            sectors = original_data.get("sectors", ["Unknown"])

            # Extract verdict
            verdict = self._extract_verdict(case)

            for sector in sectors:
                by_sector[sector][verdict] += 1
                total_by_sector[sector] += 1

        # Calculate percentages
        results = {}
        for sector in by_sector:
            total = total_by_sector[sector]
            verdict_distribution = {}

            for verdict in ["PASS", "CONDITIONAL", "FAIL", "UNKNOWN"]:
                count = by_sector[sector].get(verdict, 0)
                pct = (count / total * 100) if total > 0 else 0
                verdict_distribution[verdict] = {
                    "count": count,
                    "percentage": round(pct, 1)
                }

            results[sector] = {
                "total": total,
                "verdicts": verdict_distribution
            }

        return results

    def compare_verdicts_by_stage(self) -> Dict[str, Dict]:
        """
        Aggregate verdicts by funding stage.

        Returns:
            Dictionary of stages with verdict distributions
        """
        by_stage = defaultdict(lambda: defaultdict(int))
        total_by_stage = defaultdict(int)

        for case in self.analyses:
            original_data = case.get("original_data", {})
            stage = original_data.get("stage", "Unknown")

            # Extract verdict
            verdict = self._extract_verdict(case)

            by_stage[stage][verdict] += 1
            total_by_stage[stage] += 1

        # Calculate percentages
        results = {}
        for stage in by_stage:
            total = total_by_stage[stage]
            verdict_distribution = {}

            for verdict in ["PASS", "CONDITIONAL", "FAIL", "UNKNOWN"]:
                count = by_stage[stage].get(verdict, 0)
                pct = (count / total * 100) if total > 0 else 0
                verdict_distribution[verdict] = {
                    "count": count,
                    "percentage": round(pct, 1)
                }

            results[stage] = {
                "total": total,
                "verdicts": verdict_distribution
            }

        return results

    def _extract_verdict(self, case: Dict) -> str:
        """Extract verdict from case analysis."""
        analysis = case.get("challenge_analysis", {})
        analysis_text = analysis.get("analysis", "")

        if "FAIL" in analysis_text:
            return "FAIL"
        elif "CONDITIONAL" in analysis_text:
            return "CONDITIONAL"
        elif "PASS" in analysis_text:
            return "PASS"
        else:
            return "UNKNOWN"

    def generate_recommendations(self, startup_name: str) -> Dict:
        """
        Generate recommendations based on similar cases.

        Args:
            startup_name: Target startup

        Returns:
            Recommendations based on similar cases
        """
        similar_cases = self.find_similar_cases(startup_name)

        if not similar_cases:
            return {
                "startup": startup_name,
                "recommendations": "No similar cases found",
                "generated_at": datetime.now().isoformat()
            }

        # Get verdicts of similar cases
        verdict_counts = defaultdict(int)
        for similar_name, _ in similar_cases:
            verdict = None
            for case in self.analyses:
                if case.get("startup_name") == similar_name:
                    verdict = self._extract_verdict(case)
                    break
            if verdict:
                verdict_counts[verdict] += 1

        # Generate recommendation
        recommendation = self._generate_recommendation_text(verdict_counts, len(similar_cases))

        return {
            "startup": startup_name,
            "similar_cases": similar_cases[:5],  # Top 5
            "verdict_distribution": dict(verdict_counts),
            "recommendation": recommendation,
            "generated_at": datetime.now().isoformat()
        }

    def _generate_recommendation_text(self, verdicts: Dict, total_similar: int) -> str:
        """Generate human-readable recommendation."""
        if not verdicts:
            return "Unable to generate recommendation based on similar cases."

        # Find dominant verdict
        dominant_verdict = max(verdicts.items(), key=lambda x: x[1])[0]
        dominant_pct = (verdicts[dominant_verdict] / total_similar * 100)

        if dominant_verdict == "PASS" and dominant_pct > 70:
            return f"Strong positive signal: {dominant_pct:.0f}% of similar cases passed Challenge Mode analysis."
        elif dominant_verdict == "CONDITIONAL" and dominant_pct > 70:
            return f"Mixed signal: {dominant_pct:.0f}% of similar cases received CONDITIONAL verdicts. Key issues to address."
        elif dominant_verdict == "FAIL" and dominant_pct > 70:
            return f"Cautionary signal: {dominant_pct:.0f}% of similar cases failed Challenge Mode analysis. Significant concerns present."
        else:
            return f"Diverse outcomes: {len(verdicts)} different verdict types across similar cases. Consider case-by-case details."

    def cluster_by_risk_profile(self) -> Dict[str, List[str]]:
        """
        Cluster cases by risk profile.

        Returns:
            Dictionary of risk clusters with startup names
        """
        clusters = {
            "low_risk": [],
            "medium_risk": [],
            "high_risk": [],
            "unknown_risk": []
        }

        for case in self.analyses:
            startup_name = case.get("startup_name", "Unknown")
            analysis = case.get("challenge_analysis", {})
            analysis_text = analysis.get("analysis", "")

            # Extract risk score
            import re
            match = re.search(r"Risk Score:\s*(\d+)/10", analysis_text)

            if match:
                score = int(match.group(1))
                if score <= 3:
                    clusters["low_risk"].append(startup_name)
                elif score <= 7:
                    clusters["medium_risk"].append(startup_name)
                else:
                    clusters["high_risk"].append(startup_name)
            else:
                clusters["unknown_risk"].append(startup_name)

        # Remove empty clusters
        return {k: v for k, v in clusters.items() if v}

    def generate_sector_report(self) -> Dict:
        """
        Generate comprehensive sector analysis report.

        Returns:
            Sector analysis with key metrics
        """
        verdict_by_sector = self.compare_verdicts_by_sector()

        report = {
            "timestamp": datetime.now().isoformat(),
            "total_cases": len(self.analyses),
            "sectors": {}
        }

        for sector, data in verdict_by_sector.items():
            # Calculate average risk score for sector
            sector_cases = [
                c for c in self.analyses
                if sector in c.get("original_data", {}).get("sectors", [])
            ]

            risk_scores = []
            for case in sector_cases:
                analysis_text = case.get("challenge_analysis", {}).get("analysis", "")
                import re
                match = re.search(r"Risk Score:\s*(\d+)/10", analysis_text)
                if match:
                    risk_scores.append(int(match.group(1)))

            avg_risk = sum(risk_scores) / len(risk_scores) if risk_scores else None

            report["sectors"][sector] = {
                "total_cases": data["total"],
                "verdict_distribution": data["verdicts"],
                "average_risk_score": round(avg_risk, 1) if avg_risk else None,
                "recommendation": self._sector_recommendation(data)
            }

        return report

    def _sector_recommendation(self, sector_data: Dict) -> str:
        """Generate recommendation for a sector."""
        verdicts = sector_data["verdicts"]
        pass_pct = verdicts["PASS"]["percentage"]
        fail_pct = verdicts["FAIL"]["percentage"]

        if pass_pct > 60:
            return "Positive sector outlook - most companies passing analysis"
        elif fail_pct > 60:
            return "Cautionary sector outlook - most companies failing analysis"
        else:
            return "Mixed sector dynamics - investigate case-by-case"

    def export_comparison_report(self, filepath: str) -> None:
        """
        Export comprehensive comparison report.

        Args:
            filepath: Output file path
        """
        report = {
            "generated_at": datetime.now().isoformat(),
            "total_analyses": len(self.analyses),
            "verdict_by_sector": self.compare_verdicts_by_sector(),
            "verdict_by_stage": self.compare_verdicts_by_stage(),
            "risk_clusters": self.cluster_by_risk_profile(),
            "sector_report": self.generate_sector_report(),
        }

        with open(filepath, 'w') as f:
            json.dump(report, f, indent=2, default=str)

        logger.info(f"Exported comparison report to {filepath}")


def create_comparison_engine(analyses: List[Dict]) -> ComparisonEngine:
    """Factory function to create comparison engine."""
    return ComparisonEngine(analyses)
