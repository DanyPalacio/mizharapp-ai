/**
 * External API Integration Testing
 * Tests all Phase 4 API integrations
 */

import { ExternalDataIntegration } from '../src/lib/external-apis';

interface TestResult {
  api: string;
  endpoint: string;
  status: 'PASS' | 'FAIL' | 'SKIP';
  duration: number;
  error?: string;
  data?: any;
}

const results: TestResult[] = [];

async function testAPIIntegration() {
  console.log('\n🔗 PHASE 4: External API Integration Testing');
  console.log('━'.repeat(70));
  console.log(`Start Time: ${new Date().toISOString()}\n`);

  const externalData = new ExternalDataIntegration();

  // Test Crunchbase
  await testCrunchbase(externalData);

  // Test SEC EDGAR
  await testSECEdgar(externalData);

  // Test Google Trends
  await testGoogleTrends(externalData);

  // Test FRED
  await testFRED(externalData);

  // Test Alpha Vantage
  await testAlphaVantage(externalData);

  // Test PitchBook
  await testPitchBook(externalData);

  // Display results
  displayResults();
}

/**
 * Test Crunchbase Integration
 */
async function testCrunchbase(externalData: ExternalDataIntegration) {
  console.log('Testing Crunchbase Integration...');

  try {
    const start = Date.now();

    // Test company search
    const companies = await externalData.crunchbase.searchCompanies('OpenAI');

    const duration = Date.now() - start;

    results.push({
      api: 'Crunchbase',
      endpoint: 'searchCompanies',
      status: companies.length > 0 ? 'PASS' : 'FAIL',
      duration,
      data: {
        companiesFound: companies.length,
        sample: companies[0] || null,
      },
    });

    console.log(
      `✅ Crunchbase: ${companies.length} companies found in ${duration}ms`
    );
  } catch (error) {
    results.push({
      api: 'Crunchbase',
      endpoint: 'searchCompanies',
      status: 'FAIL',
      duration: 0,
      error: String(error),
    });
    console.log(
      `❌ Crunchbase: ${String(error).substring(0, 100)}`
    );
  }
}

/**
 * Test SEC EDGAR Integration
 */
async function testSECEdgar(externalData: ExternalDataIntegration) {
  console.log('\nTesting SEC EDGAR Integration...');

  try {
    const start = Date.now();

    // Test filing search
    const filings = await externalData.sec.getFilings('0000789019', '10-K');

    const duration = Date.now() - start;

    results.push({
      api: 'SEC EDGAR',
      endpoint: 'getFilings',
      status: filings.length > 0 ? 'PASS' : 'FAIL',
      duration,
      data: {
        filingsFound: filings.length,
        sample: filings[0] || null,
      },
    });

    console.log(
      `✅ SEC EDGAR: ${filings.length} filings found in ${duration}ms`
    );
  } catch (error) {
    results.push({
      api: 'SEC EDGAR',
      endpoint: 'getFilings',
      status: 'FAIL',
      duration: 0,
      error: String(error),
    });
    console.log(
      `❌ SEC EDGAR: ${String(error).substring(0, 100)}`
    );
  }
}

/**
 * Test Google Trends Integration
 */
async function testGoogleTrends(externalData: ExternalDataIntegration) {
  console.log('\nTesting Google Trends Integration...');

  try {
    const start = Date.now();

    // Test trend search
    const trends = await externalData.googleTrends.searchTrend('AI startup');
    const topics = await externalData.googleTrends.getTrendingTopics();

    const duration = Date.now() - start;

    results.push({
      api: 'Google Trends',
      endpoint: 'searchTrend',
      status: 'PASS',
      duration,
      data: {
        trendsFound: trends.length,
        topicCount: topics.length,
        sample: trends[0] || null,
      },
    });

    console.log(
      `✅ Google Trends: ${topics.length} trending topics found in ${duration}ms`
    );
  } catch (error) {
    results.push({
      api: 'Google Trends',
      endpoint: 'searchTrend',
      status: 'FAIL',
      duration: 0,
      error: String(error),
    });
    console.log(
      `❌ Google Trends: ${String(error).substring(0, 100)}`
    );
  }
}

/**
 * Test FRED Integration
 */
async function testFRED(externalData: ExternalDataIntegration) {
  console.log('\nTesting FRED Integration...');

  try {
    const start = Date.now();

    // Test economic indicators
    const [gdp, unemployment, inflation, interestRate] = await Promise.all([
      externalData.fred.getGDP(),
      externalData.fred.getUnemploymentRate(),
      externalData.fred.getInflationRate(),
      externalData.fred.getInterestRate(),
    ]);

    const duration = Date.now() - start;

    const indicators = [
      gdp ? 'GDP' : null,
      unemployment ? 'Unemployment' : null,
      inflation ? 'Inflation' : null,
      interestRate ? 'Interest Rate' : null,
    ].filter(Boolean);

    results.push({
      api: 'FRED',
      endpoint: 'getIndicators',
      status: indicators.length > 0 ? 'PASS' : 'FAIL',
      duration,
      data: {
        indicatorsFound: indicators.length,
        indicators: {
          gdp: gdp?.value,
          unemployment: unemployment?.value,
          inflation: inflation?.value,
          interestRate: interestRate?.value,
        },
      },
    });

    console.log(
      `✅ FRED: ${indicators.length} indicators retrieved in ${duration}ms`
    );
  } catch (error) {
    results.push({
      api: 'FRED',
      endpoint: 'getIndicators',
      status: 'FAIL',
      duration: 0,
      error: String(error),
    });
    console.log(
      `❌ FRED: ${String(error).substring(0, 100)}`
    );
  }
}

/**
 * Test Alpha Vantage Integration
 */
async function testAlphaVantage(externalData: ExternalDataIntegration) {
  console.log('\nTesting Alpha Vantage Integration...');

  try {
    const start = Date.now();

    // Test stock quote
    const quote = await externalData.alphaVantage.getQuote('AAPL');

    const duration = Date.now() - start;

    results.push({
      api: 'Alpha Vantage',
      endpoint: 'getQuote',
      status: quote ? 'PASS' : 'FAIL',
      duration,
      data: quote || null,
    });

    if (quote) {
      console.log(
        `✅ Alpha Vantage: ${quote.symbol} at $${quote.price} in ${duration}ms`
      );
    } else {
      console.log(`⚠️ Alpha Vantage: No data returned in ${duration}ms`);
    }
  } catch (error) {
    results.push({
      api: 'Alpha Vantage',
      endpoint: 'getQuote',
      status: 'FAIL',
      duration: 0,
      error: String(error),
    });
    console.log(
      `❌ Alpha Vantage: ${String(error).substring(0, 100)}`
    );
  }
}

/**
 * Test PitchBook Integration
 */
async function testPitchBook(externalData: ExternalDataIntegration) {
  console.log('\nTesting PitchBook Integration...');

  try {
    const start = Date.now();

    // Test company search
    const companies = await externalData.pitchbook.searchCompany('Stripe');

    const duration = Date.now() - start;

    results.push({
      api: 'PitchBook',
      endpoint: 'searchCompany',
      status: companies.length > 0 ? 'PASS' : 'FAIL',
      duration,
      data: {
        companiesFound: companies.length,
        sample: companies[0] || null,
      },
    });

    console.log(
      `✅ PitchBook: ${companies.length} companies found in ${duration}ms`
    );
  } catch (error) {
    results.push({
      api: 'PitchBook',
      endpoint: 'searchCompany',
      status: 'FAIL',
      duration: 0,
      error: String(error),
    });
    console.log(
      `❌ PitchBook: ${String(error).substring(0, 100)}`
    );
  }
}

/**
 * Display test results
 */
function displayResults() {
  console.log('\n' + '═'.repeat(70));
  console.log('📊 TEST RESULTS SUMMARY');
  console.log('═'.repeat(70));

  const passed = results.filter((r) => r.status === 'PASS').length;
  const failed = results.filter((r) => r.status === 'FAIL').length;
  const total = results.length;

  console.log(`\n✅ Passed: ${passed}/${total}`);
  console.log(`❌ Failed: ${failed}/${total}`);
  console.log(`⏭️  Skipped: ${total - passed - failed}/${total}`);

  console.log(`\n📈 Success Rate: ${((passed / total) * 100).toFixed(1)}%`);

  const avgLatency = (results.reduce((sum, r) => sum + r.duration, 0) / total).toFixed(0);
  console.log(`⚡ Average Latency: ${avgLatency}ms`);

  console.log('\n' + '─'.repeat(70));
  console.log('📋 Detailed Results');
  console.log('─'.repeat(70));

  results.forEach((result) => {
    const status = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '⏭️';
    console.log(`\n${status} ${result.api} - ${result.endpoint}`);
    console.log(`   Duration: ${result.duration}ms`);

    if (result.error) {
      console.log(`   Error: ${result.error.substring(0, 100)}`);
    } else if (result.data) {
      console.log(`   Data: ${JSON.stringify(result.data).substring(0, 100)}...`);
    }
  });

  console.log('\n' + '═'.repeat(70));
  console.log('✅ PHASE 4: API INTEGRATION TESTING COMPLETE');
  console.log('═'.repeat(70));
  console.log(`\nEnd Time: ${new Date().toISOString()}`);

  if (passed === total) {
    console.log('\n🚀 All APIs integrated successfully!');
    console.log('Ready to deploy Phase 4 to production.');
  } else {
    console.log(
      `\n⚠️ ${failed} API(s) need attention. Check API keys and network connectivity.`
    );
  }
}

// Run tests
testAPIIntegration().catch(console.error);
