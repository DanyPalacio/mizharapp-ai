/**
 * Privacy Policy - USA Legal Compliance
 */
export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1>Privacy Policy</h1>
      <p className="text-gray-600">Last Updated: May 2026</p>
      <p className="text-gray-600">Effective: May 2026</p>

      <h2>1. Introduction</h2>
      <p>
        MIZHAR AI, a division of Interbros LLC ("we," "us," "our," or "Company"), respects your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information.
      </p>

      <h2>2. Information We Collect</h2>

      <h3>2.1 Account Registration</h3>
      <p>When you create an account, we collect:</p>
      <ul>
        <li>Email address</li>
        <li>Password (hashed, never stored in plain text)</li>
        <li>Full name (optional)</li>
        <li>Country and City (for analytics)</li>
        <li>Company name (optional)</li>
        <li>Industry (optional)</li>
      </ul>

      <h3>2.2 Usage Data</h3>
      <p>We automatically collect:</p>
      <ul>
        <li>IP address and geolocation</li>
        <li>Device type (mobile, tablet, desktop)</li>
        <li>Browser and operating system information</li>
        <li>Pages visited and features used</li>
        <li>Time spent on each page</li>
        <li>Click behavior and interactions</li>
        <li>API requests and parameters</li>
        <li>Login attempts (successful and failed)</li>
      </ul>

      <h3>2.3 Document & Content</h3>
      <p>
        When you upload documents or create content, we store:
      </p>
      <ul>
        <li>Business plans and financial documents you upload</li>
        <li>Generated reports and analyses</li>
        <li>Chat conversations and strategic memory</li>
        <li>Notes and annotations you create</li>
      </ul>

      <h3>2.4 Payment Information</h3>
      <p>
        Payment information (credit card, PayPal account) is processed by PayPal and not stored on our servers. We only store transaction records showing amount, date, and status.
      </p>

      <h3>2.5 Cookies & Tracking</h3>
      <p>
        We use cookies to:
      </p>
      <ul>
        <li>Maintain your session/login state</li>
        <li>Remember your preferences</li>
        <li>Track usage for analytics</li>
        <li>Detect fraud and abuse</li>
      </ul>
      <p>
        You can disable cookies in your browser settings, but some features may not work.
      </p>

      <h2>3. How We Use Your Information</h2>
      <p>We use collected information for:</p>
      <ul>
        <li>Providing and improving the Services</li>
        <li>Personalizing your experience</li>
        <li>Authentication and account security</li>
        <li>Processing payments and managing subscriptions</li>
        <li>Sending service announcements and updates</li>
        <li>Responding to support requests</li>
        <li>Analyzing usage patterns and improving features</li>
        <li>Detecting and preventing fraud, abuse, and security incidents</li>
        <li>Complying with legal obligations</li>
        <li>Marketing and promotional communications (with your consent)</li>
      </ul>

      <h2>4. Legal Basis for Processing (GDPR Compliance)</h2>
      <p>
        For EU residents, we process your data based on:
      </p>
      <ul>
        <li>Contract Performance: Services you requested</li>
        <li>Legal Obligation: Compliance with laws and regulations</li>
        <li>Legitimate Interest: Fraud detection, security, analytics</li>
        <li>Consent: Marketing communications (only with your opt-in)</li>
      </ul>

      <h2>5. Data Sharing & Disclosure</h2>
      <p>
        We do NOT sell your personal data. We share information only with:
      </p>
      <ul>
        <li><strong>Service Providers:</strong> PayPal (payments), Supabase (hosting), AWS (infrastructure)</li>
        <li><strong>Third-Party APIs:</strong> Crunchbase, SEC EDGAR, Google Trends, FRED, Alpha Vantage, PitchBook (for market data - they receive company research data only, not personal data)</li>
        <li><strong>Legal Compliance:</strong> Law enforcement or courts when required by law</li>
        <li><strong>Business Transfer:</strong> In case of merger, acquisition, or bankruptcy (with prior notice)</li>
      </ul>

      <h2>6. Data Retention</h2>
      <ul>
        <li><strong>Active Accounts:</strong> Data retained while account is active</li>
        <li><strong>Free Accounts:</strong> Deleted after 90 days of inactivity</li>
        <li><strong>Pro Accounts:</strong> Retained for 1 year after cancellation</li>
        <li><strong>Auth Logs:</strong> Retained for 90 days for security purposes</li>
        <li><strong>Payment Records:</strong> Retained for 7 years (tax compliance)</li>
        <li><strong>User Deletion Request:</strong> Processed within 30 days; backups deleted within 90 days</li>
      </ul>

      <h2>7. Data Security</h2>
      <p>
        We implement:
      </p>
      <ul>
        <li>TLS 1.3 encryption for all data in transit</li>
        <li>256-bit AES encryption for data at rest</li>
        <li>Secure password hashing (bcrypt with salt)</li>
        <li>JWT-based authentication</li>
        <li>Rate limiting to prevent brute force attacks</li>
        <li>IP whitelisting for admin access</li>
        <li>Regular security audits and penetration testing</li>
        <li>SIEM for anomaly detection</li>
      </ul>
      <p>
        However, no system is 100% secure. We are not liable for unauthorized access due to your negligence (e.g., password sharing).
      </p>

      <h2>8. Your Privacy Rights</h2>

      <h3>For All Users</h3>
      <ul>
        <li><strong>Access:</strong> Request a copy of your data</li>
        <li><strong>Correction:</strong> Update inaccurate information</li>
        <li><strong>Deletion:</strong> Request deletion of your account and data</li>
        <li><strong>Opt-Out:</strong> Unsubscribe from marketing emails</li>
      </ul>

      <h3>For EU Residents (GDPR Rights)</h3>
      <ul>
        <li><strong>Right to Access:</strong> Get a copy of your personal data</li>
        <li><strong>Right to Rectification:</strong> Correct inaccurate data</li>
        <li><strong>Right to Erasure:</strong> Delete your data ("right to be forgotten")</li>
        <li><strong>Right to Restrict Processing:</strong> Limit how we use your data</li>
        <li><strong>Right to Data Portability:</strong> Export your data in machine-readable format</li>
        <li><strong>Right to Object:</strong> Opt out of marketing and certain processing</li>
        <li><strong>Right to Lodge a Complaint:</strong> File a complaint with your local data protection authority</li>
      </ul>

      <h3>For California Residents (CCPA Rights)</h3>
      <ul>
        <li><strong>Right to Know:</strong> Request categories and specific pieces of personal information we've collected</li>
        <li><strong>Right to Delete:</strong> Request deletion of personal information (with exceptions)</li>
        <li><strong>Right to Opt-Out:</strong> Opt out of the sale/sharing of personal information</li>
        <li><strong>Right to Non-Discrimination:</strong> We will not discriminate for exercising CCPA rights</li>
      </ul>

      <p>
        To exercise any of these rights, contact: privacy@mizhar.ai with subject line "Data Subject Request"
      </p>

      <h2>9. Children's Privacy</h2>
      <p>
        The Services are not directed to individuals under 18. We do not knowingly collect personal data from children. If we become aware a child has provided information, we will delete it immediately.
      </p>

      <h2>10. International Data Transfers</h2>
      <p>
        Your data may be transferred to, stored in, and processed in countries outside the United States, including countries with different privacy protections. By using the Services, you consent to such transfers. We implement Standard Contractual Clauses (SCCs) for EU data transfers.
      </p>

      <h2>11. Third-Party Links</h2>
      <p>
        The Platform may contain links to third-party websites. We are not responsible for their privacy practices. Review their privacy policies before providing information.
      </p>

      <h2>12. Do Not Track (DNT)</h2>
      <p>
        Our Platform does not respond to DNT browser signals. We may continue to collect usage data even if DNT is enabled.
      </p>

      <h2>13. Policy Changes</h2>
      <p>
        We may update this Privacy Policy anytime. Changes take effect upon posting. For material changes affecting how we use your data, we will notify you via email and request consent.
      </p>

      <h2>14. Contact Us</h2>
      <p>
        For privacy inquiries, data subject requests, or complaints:<br />
        <br />
        <strong>MIZHAR AI</strong><br />
        A Division of Interbros LLC<br />
        Email: privacy@mizhar.ai<br />
        Website: mizhar.ai
      </p>

      <h2>15. Data Protection Officer</h2>
      <p>
        For EU residents, our Data Protection Officer can be contacted at: dpo@mizhar.ai
      </p>
    </div>
  );
}
