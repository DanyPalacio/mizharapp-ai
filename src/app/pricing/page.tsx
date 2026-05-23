import { Metadata } from 'next';
import Link from 'next/link';
import { PayPalSubscriptionButton } from '@/components/payments/PayPalSubscriptionButton';

export const metadata: Metadata = {
  title: 'Pricing - MIZHAR',
  description: 'Choose the perfect plan for your venture intelligence needs',
};

export default function PricingPage() {
  const handlePayPalSuccess = (subscriptionId: string) => {
    console.log('Subscription successful:', subscriptionId);
  };

  const handlePayPalError = (error: any) => {
    console.error('Payment error:', error);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <Link href="/" className="text-2xl font-bold text-orange-600">
            MIZHAR
          </Link>
        </nav>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start free and upgrade anytime. No credit card required to explore MIZHAR.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Tier */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 hover:shadow-lg transition-shadow">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Free Forever</h3>
            <p className="text-gray-600 mb-6">Perfect to get started</p>

            <div className="mb-8">
              <span className="text-4xl font-bold text-gray-900">$0</span>
              <span className="text-gray-600 ml-2">/ month</span>
            </div>

            <p className="text-sm text-gray-600 mb-8">
              5-day free trial on all features. Then limited to:
            </p>

            {/* Free Features */}
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 text-green-600 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">5 Business Plans / month</span>
              </li>
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 text-green-600 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">5 SWOT Analysis / month</span>
              </li>
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 text-green-600 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">5 TAM Calculations / month</span>
              </li>
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 text-green-600 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Case Studies Database</span>
              </li>
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 text-green-600 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">All Free Tools</span>
              </li>
            </ul>

            <Link
              href="/app/register"
              className="w-full block text-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              Get Started Free
            </Link>
          </div>

          {/* Pro Tier */}
          <div className="bg-white rounded-2xl border-2 border-orange-600 p-8 shadow-xl relative">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <span className="bg-orange-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                MOST POPULAR
              </span>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro</h3>
            <p className="text-gray-600 mb-6">For serious founders & investors</p>

            <div className="mb-8">
              <span className="text-4xl font-bold text-gray-900">$29</span>
              <span className="text-gray-600 ml-2">/ month</span>
              <p className="text-sm text-gray-500 mt-2">Billed monthly</p>
            </div>

            <div className="mb-8 p-4 bg-orange-50 rounded-lg border border-orange-200">
              <p className="text-sm font-semibold text-orange-900">
                ✨ 5-day free trial included
              </p>
              <p className="text-xs text-orange-700 mt-1">
                Try all Pro features free. Cancel anytime.
              </p>
            </div>

            {/* Pro Features */}
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 text-orange-600 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">
                  <strong>Unlimited</strong> all tools & analysis
                </span>
              </li>
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 text-orange-600 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">
                  <strong>Challenge Mode</strong> - VC critique system
                </span>
              </li>
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 text-orange-600 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">
                  <strong>Strategic Rewrites</strong> & Simulations
                </span>
              </li>
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 text-orange-600 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">
                  <strong>Founder Intelligence</strong> Analysis
                </span>
              </li>
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 text-orange-600 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">
                  <strong>Financial Intelligence</strong> & Valuations
                </span>
              </li>
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 text-orange-600 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">
                  <strong>Strategic Memory</strong> & Portfolio tracking
                </span>
              </li>
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 text-orange-600 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">
                  <strong>9+ Export</strong> formats (PDF, Word, HTML, etc)
                </span>
              </li>
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 text-orange-600 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">
                  <strong>Live API</strong> integrations (Crunchbase, FRED, SEC, etc)
                </span>
              </li>
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 text-orange-600 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Priority support & roadmap input</span>
              </li>
            </ul>

            <div className="mb-8">
              <PayPalSubscriptionButton
                planId={process.env.NEXT_PUBLIC_PAYPAL_PRO_PLAN_ID || 'P-5BC97589SB7542152NIIPEWI'}
                onSuccess={handlePayPalSuccess}
                onError={handlePayPalError}
                style={{
                  shape: 'pill',
                  color: 'gold',
                  layout: 'vertical',
                }}
              />
            </div>

            <p className="text-xs text-center text-gray-500">
              Cancel anytime. No questions asked.
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mt-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I cancel my subscription anytime?
              </h3>
              <p className="text-gray-600">
                Yes. Cancel anytime directly from your account settings. No hidden fees, no questions asked. Your access continues until the end of the billing cycle.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What happens to my data if I cancel?
              </h3>
              <p className="text-gray-600">
                Your data remains accessible for 30 days after cancellation. You can download all your analyses and reports during this time.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Do you offer team plans?
              </h3>
              <p className="text-gray-600">
                Currently, each user needs their own Pro subscription. Team features and bulk pricing are coming soon. Contact us for early access.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is the free trial really 5 days?
              </h3>
              <p className="text-gray-600">
                Yes. When you start a Pro subscription, you get 5 days to explore all Pro features. After 5 days, your first $29 charge applies. Cancel anytime during the trial.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept all major credit cards and PayPal. Payments are processed securely through PayPal.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
