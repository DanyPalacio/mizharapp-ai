"""
SPRINT 2 Phase 1: Case Ingestion Tests

Tests for data ingestion from multiple sources:
- YCombinator
- Crunchbase
- TechCrunch
- SEC EDGAR
"""

import os
import sys
import json
from datetime import datetime

# Add src to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from ai_engine import CaseIngestion, create_ingestion_pipeline


def test_yc_adapter():
    """Test YCombinator adapter initialization and structure."""
    print("\n" + "=" * 70)
    print("TEST 1: YCombinator Adapter")
    print("=" * 70)

    try:
        ingestion = CaseIngestion()
        adapter = ingestion.adapters["yc"]

        print("  ✅ YCombinator adapter initialized")
        print(f"     - Type: {type(adapter).__name__}")
        print(f"     - Methods: fetch_startups, normalize_profile")

        # Test normalize_profile with sample data
        sample_yc = {
            "name": "Anthropic",
            "description": "AI safety company",
            "founded_year": 2021,
            "team_size": 150,
            "location": "San Francisco",
            "website": "https://www.anthropic.com",
            "batch": "S21"
        }

        normalized = adapter.normalize_profile(sample_yc)
        print(f"  ✅ Profile normalized successfully")
        print(f"     - Name: {normalized['name']}")
        print(f"     - Stage: {normalized['stage']}")

        return True

    except Exception as e:
        print(f"  ❌ Error: {str(e)}")
        return False


def test_crunchbase_adapter():
    """Test Crunchbase adapter with mocked API response."""
    print("\n" + "=" * 70)
    print("TEST 2: Crunchbase Adapter")
    print("=" * 70)

    try:
        ingestion = CaseIngestion()
        adapter = ingestion.adapters["crunchbase"]

        print("  ✅ Crunchbase adapter initialized")

        # Test with sample data (what Crunchbase API returns)
        sample_cb = {
            "properties": {
                "identifier": {
                    "title": "Stripe",
                    "permalink": "stripe",
                    "announced_date": "2009-09-15"
                },
                "organization": {
                    "profile": {
                        "description": "Payment platform for the internet"
                    },
                    "financials": {
                        "total_funding_usd": 5000000000
                    }
                },
                "discovered": {
                    "web_presence": {
                        "website_url": "https://stripe.com"
                    }
                }
            }
        }

        normalized = adapter.normalize_profile(sample_cb)
        print(f"  ✅ Profile normalized successfully")
        print(f"     - Name: {normalized['name']}")
        print(f"     - Funding: ${normalized['total_funding']:,}")
        print(f"     - Stage: {normalized['stage']}")
        print(f"     - URL: {normalized['crunchbase_url']}")

        assert normalized['name'] == 'Stripe'
        assert normalized['total_funding'] == 5000000000
        assert normalized['stage'] == 'Late Stage'

        return True

    except Exception as e:
        print(f"  ❌ Error: {str(e)}")
        return False


def test_techcrunch_adapter():
    """Test TechCrunch adapter with sample article data."""
    print("\n" + "=" * 70)
    print("TEST 3: TechCrunch Adapter")
    print("=" * 70)

    try:
        ingestion = CaseIngestion()
        adapter = ingestion.adapters["techcrunch"]

        print("  ✅ TechCrunch adapter initialized")

        # Test with sample article data
        sample_tc = {
            "title": "OpenAI raises $100M Series B at $29B valuation",
            "summary": "The AI company has secured new funding to expand research",
            "url": "https://techcrunch.com/2024/05/sample",
            "published_date": "2024-05-20",
            "category": "funding"
        }

        normalized = adapter.normalize_profile(sample_tc)
        print(f"  ✅ Article profile normalized")
        print(f"     - Name: {normalized['name']}")
        print(f"     - Category: {normalized['category']}")
        print(f"     - Status: {normalized['status']}")
        print(f"     - Reliability: {normalized['source_reliability']}")

        assert normalized['status'] == 'mentioned'
        assert normalized['source_reliability'] == 'medium'

        return True

    except Exception as e:
        print(f"  ❌ Error: {str(e)}")
        return False


def test_sec_edgar_adapter():
    """Test SEC EDGAR adapter with sample filing data."""
    print("\n" + "=" * 70)
    print("TEST 4: SEC EDGAR Adapter")
    print("=" * 70)

    try:
        ingestion = CaseIngestion()
        adapter = ingestion.adapters["sec_edgar"]

        print("  ✅ SEC EDGAR adapter initialized")

        # Test with sample SEC filing data
        sample_sec = {
            "_source": {
                "company_name": "Databricks",
                "cik_str": "0001234567",
                "form_type": "S-1",
                "filing_date": "2024-05-15"
            }
        }

        normalized = adapter.normalize_profile(sample_sec)
        print(f"  ✅ SEC filing normalized")
        print(f"     - Name: {normalized['name']}")
        print(f"     - CIK: {normalized['cik']}")
        print(f"     - Filing: {normalized['filing_type']}")
        print(f"     - Status: {normalized['status']}")

        assert normalized['status'] == 'public'
        assert normalized['stage'] == 'Post-IPO'

        return True

    except Exception as e:
        print(f"  ❌ Error: {str(e)}")
        return False


def test_multi_source_ingestion():
    """Test ingestion orchestrator with all sources."""
    print("\n" + "=" * 70)
    print("TEST 5: Multi-Source Ingestion Orchestrator")
    print("=" * 70)

    try:
        pipeline = create_ingestion_pipeline()
        print("  ✅ Ingestion pipeline created")

        # Test with small limits to avoid API throttling
        result = pipeline.ingest_all(
            yc_limit=5,
            cb_limit=5,
            tc_limit=5,
            sec_limit=5
        )

        print(f"  ✅ Ingestion complete")
        print(f"     - Total ingested: {result['total_ingested']}")
        print(f"     - Sources: {len(result['by_source'])}")

        # Verify structure
        assert isinstance(result['timestamp'], str)
        assert 'by_source' in result
        assert 'yc' in result['by_source']
        assert 'crunchbase' in result['by_source']
        assert 'techcrunch' in result['by_source']
        assert 'sec_edgar' in result['by_source']

        return True

    except Exception as e:
        print(f"  ❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


def test_profile_normalization():
    """Test that all adapters normalize to consistent format."""
    print("\n" + "=" * 70)
    print("TEST 6: Consistent Profile Normalization")
    print("=" * 70)

    try:
        ingestion = CaseIngestion()

        # Create test data for each source
        test_profiles = {
            "yc": {
                "name": "Test Startup",
                "description": "A test startup",
                "batch": "S24"
            },
            "crunchbase": {
                "properties": {
                    "identifier": {"title": "Test Corp", "announced_date": "2020-01-01"},
                    "organization": {
                        "profile": {"description": "Test description"},
                        "financials": {"total_funding_usd": 1000000}
                    },
                    "discovered": {"web_presence": {"website_url": "https://test.com"}}
                }
            },
            "techcrunch": {
                "title": "TestCo raises funding",
                "summary": "New funding round",
                "url": "https://example.com",
                "published_date": "2024-05-20",
                "category": "funding"
            },
            "sec_edgar": {
                "_source": {
                    "company_name": "PublicCorp",
                    "cik_str": "0000123456",
                    "form_type": "S-1",
                    "filing_date": "2024-05-15"
                }
            }
        }

        results = {}
        for source, data in test_profiles.items():
            normalized = ingestion.normalize_profile(data, source)
            results[source] = normalized

            # Check required fields
            required_fields = ["name", "description", "status"]
            for field in required_fields:
                assert field in normalized, f"Missing {field} in {source}"

        print("  ✅ All profiles normalized consistently")
        for source, profile in results.items():
            print(f"     - {source}: {profile['name']} ({profile['status']})")

        return True

    except Exception as e:
        print(f"  ❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


def test_export_functionality():
    """Test JSON export of ingested cases."""
    print("\n" + "=" * 70)
    print("TEST 7: Export Functionality")
    print("=" * 70)

    try:
        pipeline = create_ingestion_pipeline()

        # Add some test data
        test_case = {
            "name": "Test Startup",
            "description": "Test description",
            "status": "active",
            "data_source": "test",
            "ingested_at": datetime.now().isoformat()
        }
        pipeline.ingested_cases.append(test_case)

        # Export
        export_path = "/tmp/mizhar_test_export.json"
        pipeline.export_to_json(export_path)

        # Verify
        with open(export_path, 'r') as f:
            exported = json.load(f)

        print("  ✅ Export successful")
        print(f"     - File: {export_path}")
        print(f"     - Cases: {len(exported)}")
        print(f"     - Sample: {exported[0]['name']}")

        # Cleanup
        os.remove(export_path)

        return True

    except Exception as e:
        print(f"  ❌ Error: {str(e)}")
        return False


def run_all_tests():
    """Run all SPRINT 2 Phase 1 tests."""
    print("\n" + "=" * 70)
    print("🚀 MIZHAR SPRINT 2 PHASE 1 TEST SUITE")
    print("Case Ingestion System")
    print("=" * 70)

    tests = [
        ("YCombinator Adapter", test_yc_adapter),
        ("Crunchbase Adapter", test_crunchbase_adapter),
        ("TechCrunch Adapter", test_techcrunch_adapter),
        ("SEC EDGAR Adapter", test_sec_edgar_adapter),
        ("Multi-Source Ingestion", test_multi_source_ingestion),
        ("Profile Normalization", test_profile_normalization),
        ("Export Functionality", test_export_functionality),
    ]

    results = {}
    for test_name, test_func in tests:
        try:
            results[test_name] = test_func()
        except Exception as e:
            print(f"\n❌ Test failed with exception: {str(e)}")
            import traceback
            traceback.print_exc()
            results[test_name] = False

    # Print summary
    print("\n" + "=" * 70)
    print("📊 TEST SUMMARY")
    print("=" * 70)

    passed = sum(1 for v in results.values() if v)
    total = len(results)

    for test_name, passed_test in results.items():
        status = "✅ PASS" if passed_test else "❌ FAIL"
        print(f"{status}: {test_name}")

    print(f"\nTotal: {passed}/{total} passed ({100*passed//total}%)")

    if passed == total:
        print("\n🎉 ALL TESTS PASSED - SPRINT 2 PHASE 1 READY")
    else:
        print(f"\n⚠️  {total - passed} tests failed")

    return passed == total


if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)
