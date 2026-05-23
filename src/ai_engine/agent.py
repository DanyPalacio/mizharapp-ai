"""
MIZHAR Challenge Mode Agent

Layer 3: Venture Intelligence Engine using Claude 3.5 Sonnet
Integrates:
- Live APIs (MarketIntel)
- RAG Knowledge System
- Evidence-based VC critique prompts
"""

import os
import json
from datetime import datetime
from typing import Dict, List, Optional
from anthropic import Anthropic

from .apis import MarketIntel
from .rag import RAG
from .prompts import (
    CHALLENGE_MODE_PROMPT,
    STRATEGIC_REWRITE_PROMPT,
    CHALLENGE_MODE_SYSTEM,
    STRATEGIC_REWRITE_SYSTEM,
    inject_rag_context
)


class ChallengeModeAgent:
    """AI Agent for aggressive startup analysis using Claude."""
    
    def __init__(self, use_rag: bool = True, use_live_data: bool = True):
        self.client = Anthropic()
        self.model = "claude-opus-4-1-20250805"
        
        # Initialize subsystems
        self.rag = RAG() if use_rag else None
        self.market_intel = MarketIntel() if use_live_data else None
        
        # Conversation history for multi-turn
        self.conversation_history = []
    
    def analyze_startup(self, startup_profile: Dict) -> Dict:
        """Run Challenge Mode analysis on a startup.
        
        Args:
            startup_profile: {
                "name": "StartupName",
                "description": "What they do",
                "market": "Target market",
                "stage": "Seed/Series A/B",
                "funding_ask": 2000000,
                "team": "Founding team info",
                "traction": "Revenue/users to date",
                "product": "Current product status"
            }
        
        Returns:
            Challenge analysis with verdict, issues, and questions
        """
        
        print(f"\n🔍 CHALLENGE MODE ANALYSIS: {startup_profile.get('name', 'Unknown Startup')}")
        print("=" * 70)
        
        # Prepare context
        context = self._gather_context(startup_profile)
        
        # Build analysis prompt
        analysis_prompt = self._build_analysis_prompt(startup_profile, context)
        
        # Get Claude's analysis
        analysis = self._invoke_claude(
            prompt=analysis_prompt,
            system=CHALLENGE_MODE_SYSTEM,
            temperature=0.7,
            max_tokens=2000
        )
        
        return {
            "startup": startup_profile.get("name"),
            "timestamp": datetime.now().isoformat(),
            "analysis": analysis,
            "sources": context.get("sources", []),
            "market_data": context.get("market_data", {}),
            "knowledge_context": context.get("knowledge_context", [])
        }
    
    def propose_strategic_rewrite(self, startup_profile: Dict, current_analysis: str) -> Dict:
        """Propose alternative business models for the startup.
        
        Args:
            startup_profile: Startup info
            current_analysis: Output from analyze_startup()
        
        Returns:
            Alternative business models and strategies
        """
        
        print(f"\n🎯 STRATEGIC REWRITE: {startup_profile.get('name', 'Unknown Startup')}")
        print("=" * 70)
        
        rewrite_prompt = f"""
Based on this startup profile and our challenge analysis, propose 2-3 fundamentally different business models.

## STARTUP PROFILE:
{json.dumps(startup_profile, indent=2)}

## CURRENT ANALYSIS:
{current_analysis}

## YOUR TASK:
{STRATEGIC_REWRITE_PROMPT}

Be creative but grounded. Each alternative should:
1. Address the same market opportunity
2. Use the same core team/assets  
3. Improve unit economics and defensibility
4. Be executable in 90 days
"""
        
        rewrite = self._invoke_claude(
            prompt=rewrite_prompt,
            system=STRATEGIC_REWRITE_SYSTEM,
            temperature=0.8,
            max_tokens=2500
        )
        
        return {
            "startup": startup_profile.get("name"),
            "timestamp": datetime.now().isoformat(),
            "alternative_strategies": rewrite
        }
    
    def _gather_context(self, startup_profile: Dict) -> Dict:
        """Gather market data and knowledge context."""
        
        context = {
            "sources": [],
            "market_data": {},
            "knowledge_context": []
        }
        
        # Get market intelligence if available
        if self.market_intel:
            try:
                print("  📊 Fetching live market data...")
                econ = self.market_intel.get_econ_indicators()
                if econ and "indicators" in econ:
                    context["market_data"]["economics"] = econ["indicators"]
                    context["sources"].append("Federal Reserve FRED API")
            except Exception as e:
                print(f"  ⚠️ Could not fetch economic data: {str(e)}")
        
        # Get relevant knowledge from RAG
        if self.rag:
            try:
                print("  📚 Searching knowledge base...")
                market = startup_profile.get("market", "")
                product = startup_profile.get("product", "")
                search_query = f"{market} {product} competitive advantage unit economics"
                
                results = self.rag.search(search_query, top_k=5)
                context["knowledge_context"] = [r["content"] for r in results]
                context["sources"].extend([r["source"] for r in results])
            except Exception as e:
                print(f"  ⚠️ Could not search knowledge base: {str(e)}")
        
        return context
    
    def _build_analysis_prompt(self, startup_profile: Dict, context: Dict) -> str:
        """Build comprehensive analysis prompt with context."""
        
        prompt = f"""
## STARTUP TO ANALYZE:
{json.dumps(startup_profile, indent=2)}

## MARKET CONTEXT:
{json.dumps(context.get('market_data', {}), indent=2)}

## STRATEGIC KNOWLEDGE:
"""
        
        for i, knowledge in enumerate(context.get("knowledge_context", [])[:3], 1):
            prompt += f"\n{i}. {knowledge}\n"
        
        prompt += f"\n\n{CHALLENGE_MODE_PROMPT}"
        
        return prompt
    
    def _invoke_claude(self, prompt: str, system: str, temperature: float = 0.7, 
                      max_tokens: int = 2000) -> str:
        """Call Claude API with conversation history."""
        
        # Add to conversation
        self.conversation_history.append({
            "role": "user",
            "content": prompt
        })
        
        # Call Claude
        response = self.client.messages.create(
            model=self.model,
            max_tokens=max_tokens,
            temperature=temperature,
            system=system,
            messages=self.conversation_history
        )
        
        # Extract response
        assistant_message = response.content[0].text
        
        # Add to history
        self.conversation_history.append({
            "role": "assistant",
            "content": assistant_message
        })
        
        return assistant_message
    
    def health_check(self) -> Dict:
        """Verify all systems are operational."""
        
        status = {
            "timestamp": datetime.now().isoformat(),
            "agent": "ChallengeModeAgent",
            "systems": {}
        }
        
        # Check Claude API
        try:
            response = self.client.messages.create(
                model=self.model,
                max_tokens=10,
                messages=[{"role": "user", "content": "Hi"}]
            )
            status["systems"]["Claude API"] = "✅ Connected"
        except Exception as e:
            status["systems"]["Claude API"] = f"❌ Error: {str(e)}"
        
        # Check Market Intel
        if self.market_intel:
            market_status = self.market_intel.health_check()
            status["systems"].update(market_status.get("apis", {}))
        
        # Check RAG
        if self.rag:
            rag_status = self.rag.health_check()
            status["systems"]["RAG"] = f"✅ {rag_status['knowledge_base_items']} items"
        
        return status


def run_full_analysis(startup_profile: Dict) -> Dict:
    """Run complete analysis pipeline: Challenge Mode + Strategic Rewrite."""
    
    print("\n" + "="*70)
    print("🚀 MIZHAR CHALLENGE MODE - FULL ANALYSIS")
    print("="*70)
    
    # Initialize agent
    agent = ChallengeModeAgent(use_rag=True, use_live_data=True)
    
    # Check health
    print("\n⚙️  System Health Check:")
    health = agent.health_check()
    for system, status in health.get("systems", {}).items():
        print(f"  {status}")
    
    # Run analysis
    challenge_result = agent.analyze_startup(startup_profile)
    print("\n✅ Challenge Mode analysis complete")
    
    # Run strategic rewrite
    rewrite_result = agent.propose_strategic_rewrite(
        startup_profile,
        challenge_result["analysis"]
    )
    print("✅ Strategic rewrite complete")
    
    return {
        "startup": startup_profile.get("name"),
        "challenge_analysis": challenge_result,
        "strategic_alternatives": rewrite_result,
        "timestamp": datetime.now().isoformat()
    }
