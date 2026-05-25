export default function TermsPage() {
  return (
    <div style={{ background: "var(--mz-white)", minHeight: "100vh" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "80px 40px" }}>
        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--mz-orange)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>Legal</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 40, letterSpacing: "-0.03em", marginBottom: 12 }}>Terms & Conditions</h1>
          <p style={{ fontSize: 14, color: "var(--mz-ink-3)" }}>Last Updated: May 2026 · MIZHAR AI, a division of Interbros LLC</p>
        </div>

        {/* Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
          {[
            { n: "1", title: "Agreement to Terms", content: "These Terms form a binding legal agreement between you and MIZHAR AI, a division of Interbros LLC. By accessing the Platform, you agree to be bound by these Terms. If you do not agree, do not use the Platform." },
            { n: "2", title: "Service Description", content: "MIZHAR AI provides AI-powered business intelligence tools, document processing, financial modeling, and market research services.", list: ["Free Tier: Limited access with usage restrictions (5-10 uses/month per tool)", "Pro Tier: Unlimited access, advanced features ($49/month with 5-day free trial)"] },
            { n: "3", title: "User Eligibility", content: "You must be at least 18 years old and have legal capacity to enter contracts. You warrant that you are not a resident of any U.S.-embargoed country." },
            { n: "4", title: "Acceptable Use", content: "You agree NOT to:", list: ["Violate any laws or regulations", "Attempt reverse engineering or unauthorized access", "Transmit malware or harmful content", "Scrape or bulk download content", "Develop competing products using our platform", "Harass or abuse other users", "Circumvent rate limiting or security mechanisms"] },
            { n: "5", title: "Intellectual Property Rights", content: "All Platform content, code, algorithms, and designs are owned by MIZHAR AI/Interbros LLC. You retain ownership of your uploaded content but grant us a non-exclusive license to use it to provide Services." },
            { n: "6", title: "Limitation of Liability", content: "MIZHAR AI is NOT liable for indirect, incidental, special, consequential damages, loss of profits, data, or business opportunities. Your sole remedy is account termination." },
            { n: "7", title: "Warranties Disclaimer", content: 'THE SERVICES ARE PROVIDED "AS IS" WITHOUT WARRANTIES OF MERCHANTABILITY, FITNESS, OR ERROR-FREE OPERATION. We disclaim warranties that recommendations are accurate or legally compliant.' },
            { n: "8", title: "Payment Terms", content: null, list: ["Billing: $49/month charged to your PayPal account", "Trial: 5 free days before first charge", "Refunds: Non-refundable except as required by law", "Disputes: Contact support@mizhar.ai within 30 days"] },
            { n: "9", title: "Cancellation", content: "Cancel anytime through account settings. Cancellation is effective at the end of your billing cycle. No pro-rata refunds." },
            { n: "10", title: "Data & Privacy", content: "Your use is governed by our Privacy Policy. We collect personal data only as described there. We use industry-standard security but assume no liability for unauthorized access." },
            { n: "11", title: "Account Security", content: "You are responsible for maintaining password confidentiality. Never share credentials. Notify us immediately of unauthorized access. We assume no liability for password breaches." },
            { n: "12", title: "Rate Limiting", content: null, list: ["Free Tier: 5 requests/hour", "Pro Tier: 100 requests/hour", "Admin: 1,000 requests/hour"] },
            { n: "13", title: "Third-Party Integrations", content: "The Platform integrates with Crunchbase, SEC EDGAR, Google Trends, FRED, Alpha Vantage, and PitchBook. Use of these integrations is subject to their respective Terms. We are not responsible for their service availability or accuracy." },
          ].map(s => (
            <div key={s.n} style={{ borderBottom: "1px solid var(--mz-border-3)", paddingBottom: 32 }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--mz-orange)", fontWeight: 700 }}>{s.n}.</span>
                {s.title}
              </h2>
              {s.content && <p style={{ fontSize: 15, color: "var(--mz-ink-2)", lineHeight: 1.7, marginBottom: s.list ? 12 : 0 }}>{s.content}</p>}
              {s.list && (
                <ul style={{ paddingLeft: 20, margin: 0, display: "flex", flexDirection: "column", gap: 6 }}>
                  {s.list.map((item, i) => (
                    <li key={i} style={{ fontSize: 15, color: "var(--mz-ink-2)", lineHeight: 1.6 }}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        <div style={{ marginTop: 40, padding: "20px 24px", background: "var(--mz-cloud)", borderRadius: 10, fontSize: 14, color: "var(--mz-ink-3)" }}>
          Questions? Contact us at <a href="mailto:support@mizhar.ai" style={{ color: "var(--mz-orange)", fontWeight: 600 }}>support@mizhar.ai</a>
        </div>
      </div>
    </div>
  )
}
