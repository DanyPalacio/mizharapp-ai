/**
 * Knowledge Bank Search Quality Testing
 * Phase 0 Week 4: Validates search relevance and performance
 */

import { searchKnowledgeHybrid, searchKnowledgeSemantic, searchKnowledgeFullText } from '../src/lib/knowledge-search';
import { ragQuery } from '../src/lib/rag-engine';

interface SearchTest {
  query: string;
  expectedTopics: string[];
  minRelevance: number; // 0-1 scale
  testType: 'semantic' | 'fulltext' | 'hybrid' | 'rag';
}

interface TestResult {
  query: string;
  testType: string;
  resultsCount: number;
  topResult: string;
  relevanceScore: number;
  latencyMs: number;
  passed: boolean;
  feedback: string;
}

const results: TestResult[] = [];

/**
 * Define test queries covering all knowledge domains
 */
const searchTests: SearchTest[] = [
  // Business Strategy
  {
    query: 'How do I achieve product-market fit?',
    expectedTopics: ['product-market-fit', 'startup', 'validation', 'customers'],
    minRelevance: 0.85,
    testType: 'hybrid',
  },
  {
    query: 'What makes a successful business model?',
    expectedTopics: ['business-model', 'revenue', 'scaling', 'unit-economics'],
    minRelevance: 0.82,
    testType: 'hybrid',
  },
  // Financial
  {
    query: 'How do I calculate customer lifetime value?',
    expectedTopics: ['ltv', 'cac', 'unit-economics', 'valuation'],
    minRelevance: 0.88,
    testType: 'semantic',
  },
  {
    query: 'What is a good LTV/CAC ratio?',
    expectedTopics: ['unit-economics', 'metrics', 'saas', 'profitability'],
    minRelevance: 0.85,
    testType: 'semantic',
  },
  // Competitive Strategy
  {
    query: 'How should I position against competitors?',
    expectedTopics: ['competitive-analysis', 'positioning', 'differentiation', 'strategy'],
    minRelevance: 0.82,
    testType: 'hybrid',
  },
  // Growth
  {
    query: 'What are the best customer acquisition channels?',
    expectedTopics: ['growth', 'marketing', 'cac', 'acquisition'],
    minRelevance: 0.83,
    testType: 'fulltext',
  },
  // Industry-Specific
  {
    query: 'How do SaaS companies scale?',
    expectedTopics: ['saas', 'growth', 'playbook', 'metrics'],
    minRelevance: 0.85,
    testType: 'hybrid',
  },
  {
    query: 'What are the key metrics in a marketplace business?',
    expectedTopics: ['marketplace', 'two-sided', 'network-effects', 'metrics'],
    minRelevance: 0.84,
    testType: 'semantic',
  },
  // Case Studies
  {
    query: 'What lessons can I learn from Airbnb?',
    expectedTopics: ['case-study', 'airbnb', 'sharing-economy', 'strategy'],
    minRelevance: 0.87,
    testType: 'fulltext',
  },
  // Fundraising
  {
    query: 'How do venture capital returns work?',
    expectedTopics: ['venture-capital', 'fundraising', 'valuation', 'returns'],
    minRelevance: 0.84,
    testType: 'semantic',
  },
];

/**
 * Execute a single search test
 */
async function executeSearchTest(test: SearchTest): Promise<TestResult> {
  const startTime = Date.now();
  let results: any[] = [];
  let topResult = '';
  let relevanceScore = 0;

  try {
    switch (test.testType) {
      case 'semantic':
        results = await searchKnowledgeSemantic(test.query, 5, 0.7);
        break;
      case 'fulltext':
        results = await searchKnowledgeFullText(test.query, 5);
        break;
      case 'hybrid':
        results = await searchKnowledgeHybrid(test.query, 5, 0.7);
        break;
      case 'rag':
        const ragResult = await ragQuery(test.query);
        // RAG returns different structure, adapt for comparison
        results = ragResult.sources || [];
        break;
    }

    const latencyMs = Date.now() - startTime;

    // Extract top result
    topResult = results[0]?.title || results[0]?.content?.substring(0, 50) || 'No results';

    // Calculate relevance: check if expected topics appear in results
    const topResultText = JSON.stringify(results[0] || '').toLowerCase();
    const matchedTopics = test.expectedTopics.filter((topic) =>
      topResultText.includes(topic.toLowerCase().replace(/-/g, ' '))
    );
    relevanceScore = matchedTopics.length / test.expectedTopics.length;

    const passed = relevanceScore >= test.minRelevance && latencyMs < 500;

    return {
      query: test.query,
      testType: test.testType,
      resultsCount: results.length,
      topResult: topResult,
      relevanceScore: relevanceScore,
      latencyMs: latencyMs,
      passed: passed,
      feedback: passed
        ? `✅ Relevant results in ${latencyMs}ms`
        : `⚠️ Score ${(relevanceScore * 100).toFixed(0)}% (target ${test.minRelevance * 100}%), ${latencyMs}ms`,
    };
  } catch (error) {
    return {
      query: test.query,
      testType: test.testType,
      resultsCount: 0,
      topResult: 'ERROR',
      relevanceScore: 0,
      latencyMs: Date.now() - startTime,
      passed: false,
      feedback: `❌ Error: ${String(error).substring(0, 50)}`,
    };
  }
}

/**
 * Calculate relevance score for a search result
 */
function calculateRelevance(result: any, query: string, expectedTopics: string[]): number {
  let score = 0;

  // Query term matching (30%)
  const queryTerms = query.toLowerCase().split(' ');
  const resultText = JSON.stringify(result).toLowerCase();
  const matchedTerms = queryTerms.filter((term) => resultText.includes(term));
  score += (matchedTerms.length / queryTerms.length) * 0.3;

  // Expected topic matching (50%)
  const matchedTopics = expectedTopics.filter((topic) => resultText.includes(topic.toLowerCase()));
  score += (matchedTopics.length / expectedTopics.length) * 0.5;

  // Quality score (20%)
  if (result.quality_score) {
    score += result.quality_score * 0.2;
  }

  return Math.min(score, 1);
}

/**
 * Run all search tests
 */
async function runAllTests() {
  console.log('\n🔍 KNOWLEDGE BANK SEARCH QUALITY TESTING');
  console.log('━'.repeat(70));
  console.log(`Start Time: ${new Date().toISOString()}\n`);

  // Run all tests
  for (const test of searchTests) {
    process.stdout.write(`Testing: "${test.query.substring(0, 40)}..." [${test.testType}] `);
    const result = await executeSearchTest(test);
    results.push(result);
    console.log(result.feedback);
  }

  // Display results summary
  displaySummary();
}

/**
 * Display test summary
 */
function displaySummary() {
  console.log('\n' + '═'.repeat(70));
  console.log('📊 SEARCH QUALITY TEST SUMMARY');
  console.log('═'.repeat(70));

  const passed = results.filter((r) => r.passed).length;
  const total = results.length;
  const passRate = ((passed / total) * 100).toFixed(1);

  console.log(`\n📈 Overall Results`);
  console.log(`  Total Tests: ${total}`);
  console.log(`  Passed: ${passed}`);
  console.log(`  Failed: ${total - passed}`);
  console.log(`  Pass Rate: ${passRate}%`);

  // Stats by test type
  const byType = results.reduce(
    (acc, r) => {
      if (!acc[r.testType]) {
        acc[r.testType] = { passed: 0, total: 0, avgLatency: 0, totalLatency: 0 };
      }
      acc[r.testType].total += 1;
      if (r.passed) acc[r.testType].passed += 1;
      acc[r.testType].totalLatency += r.latencyMs;
      return acc;
    },
    {} as Record<string, any>
  );

  console.log(`\n🔍 Results by Search Type`);
  Object.entries(byType).forEach(([type, stats]: [string, any]) => {
    stats.avgLatency = (stats.totalLatency / stats.total).toFixed(0);
    console.log(
      `  ${type.toUpperCase()}: ${stats.passed}/${stats.total} passed (${((stats.passed / stats.total) * 100).toFixed(0)}%) - ${stats.avgLatency}ms avg`
    );
  });

  // Relevance stats
  const avgRelevance = (
    results.reduce((sum, r) => sum + r.relevanceScore, 0) / results.length * 100
  ).toFixed(1);
  const avgLatency = (results.reduce((sum, r) => sum + r.latencyMs, 0) / results.length).toFixed(0);

  console.log(`\n⚡ Performance Metrics`);
  console.log(`  Average Relevance Score: ${avgRelevance}%`);
  console.log(`  Average Query Latency: ${avgLatency}ms`);
  console.log(`  Target Latency: <100ms`);
  console.log(`  Target Relevance: >95%`);

  // Failed tests
  const failed = results.filter((r) => !r.passed);
  if (failed.length > 0) {
    console.log(`\n⚠️ Failed Tests (${failed.length})`);
    failed.forEach((result) => {
      console.log(`  • "${result.query}"`);
      console.log(`    Score: ${(result.relevanceScore * 100).toFixed(0)}% | Latency: ${result.latencyMs}ms`);
      console.log(`    Feedback: ${result.feedback}`);
    });
  }

  // Recommendations
  console.log(`\n💡 Recommendations`);
  if (passRate === '100') {
    console.log(`  ✅ Knowledge bank search quality is excellent`);
    console.log(`  ✅ Ready for Phase 1 implementation`);
  } else if (parseInt(passRate) >= 90) {
    console.log(`  ✅ Knowledge bank quality is good`);
    console.log(`  ⚠️ Optimize failing queries before production`);
  } else {
    console.log(`  ⚠️ Knowledge bank needs optimization`);
    console.log(`  1. Increase quality of knowledge chunks`);
    console.log(`  2. Improve tagging and metadata`);
    console.log(`  3. Retune hybrid search weights`);
  }

  console.log(`\n📊 Detailed Results`);
  console.log(`${'Query'.padEnd(45)} | ${'Type'.padEnd(8)} | ${'Score'.padEnd(6)} | ${'Latency'.padEnd(8)} | Status`);
  console.log('─'.repeat(80));

  results.forEach((result) => {
    const score = (result.relevanceScore * 100).toFixed(0);
    const status = result.passed ? '✅' : '❌';
    console.log(
      `${result.query.substring(0, 42).padEnd(45)} | ${result.testType.padEnd(8)} | ${score.padEnd(6)}% | ${result.latencyMs.toString().padEnd(8)}ms | ${status}`
    );
  });

  console.log('\n' + '═'.repeat(70));
  console.log('✅ PHASE 0 WEEK 4: SEARCH QUALITY TESTING COMPLETE');
  console.log('═'.repeat(70));
  console.log(`End Time: ${new Date().toISOString()}\n`);
}

// Run all tests
runAllTests().catch(console.error);
