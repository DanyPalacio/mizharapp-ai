export default function PrivacyPage() {
  return (
    <div style={{ background: "var(--mz-white)", minHeight: "100vh" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "80px 40px" }}>
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--mz-orange)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>Legal</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 40, letterSpacing: "-0.03em", marginBottom: 12 }}>Privacy Policy</h1>
          <p style={{ fontSize: 14, color: "var(--mz-ink-3)" }}>Last Updated: May 2026 · MIZHAR AI, a division of Interbros LLC</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {[
            { n: "1", t: "Data We Collect", b: "We collect: email address, usage data (pages visited, features used), documents you upload for analysis (processed and deleted within 30 days), payment information (processed by PayPal, not stored by us), and technical data (IP, browser type, device)." },
            { n: "2", t: "How We Use Your Data", b: "We use your data to: provide and improve the platform, personalize your experience, send service updates (not marketing without consent), comply with legal obligations, and prevent fraud and abuse." },
            { n: "3", t: "Data Sharing", b: "We do not sell your data. We share data only with: service providers (Supabase, Vercel, Anthropic AI, OpenAI) under strict DPAs, payment processors (PayPal), and legal authorities when required by law." },
            { n: "4", t: "Data Retention", b: "Account data: retained while your account is active. Uploaded documents: deleted within 30 days of upload or immediately on account deletion. Analytics: retained for 24 months in aggregated form." },
            { n: "5", t: "Your Rights (GDPR / CCPA)", b: null, list: ["Right to access your personal data", "Right to correction of inaccurate data", "Right to deletion ('right to be forgotten')", "Right to data portability", "Right to object to processing", "Right to withdraw consent at any time"] },
            { n: "6", t: "Security", b: "We use industry-standard security: TLS encryption in transit, AES-256 at rest, access controls, and regular security audits. No system is 100% secure; we assume no liability for unauthorized access beyond our control." },
            { n: "7", t: "Cookies", b: "We use essential cookies (authentication, preferences) and analytics cookies (with your consent). You can manage cookies in your browser settings. Refusing analytics cookies does not affect platform functionality." },
            { n: "8", t: "Contact", b: "Privacy questions: privacy@mizhar.ai · MIZHAR AI / Interbros LLC · Colombia" },
          ].map(s => (
            <div key={s.n} style={{ borderBottom: "1px solid var(--mz-border-3)", paddingBottom: 28 }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, marginBottom: 10, display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--mz-orange)" }}>{s.n}.</span>{s.t}
              </h2>
              {s.b && <p style={{ fontSize: 15, color: "var(--mz-ink-2)", lineHeight: 1.7 }}>{s.b}</p>}
              {s.list && <ul style={{ paddingLeft: 20, margin: 0, display: "flex", flexDirection: "column", gap: 6 }}>{s.list.map((i, k) => <li key={k} style={{ fontSize: 15, color: "var(--mz-ink-2)", lineHeight: 1.6 }}>{i}</li>)}</ul>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
