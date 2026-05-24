import Link from "next/link"
import { CheckCircle } from "lucide-react"

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "Forever free",
    desc: "Perfect for getting started",
    cta: "Start free",
    highlight: false,
    features: [
      "Landing page + login",
      "Onboarding interview (10Q)",
      "Overview dashboard",
      "Business plan",
      "Market intelligence",
      "SWOT analysis",
      "Competitor analysis",
      "Watermarked exports",
      "Email support",
    ],
  },
  {
    name: "Pro",
    price: "$49",
    period: "per month",
    desc: "For serious founders",
    cta: "Start free trial",
    highlight: true,
    features: [
      "Everything in Free",
      "Challenge Mode (VC stress test)",
      "Valuation (5 methods)",
      "Fundraising (investor targeting)",
      "Monte Carlo simulations",
      "Investor pitch deck builder",
      "Full data room",
      "Unlimited exports (no watermark)",
      "API access",
      "Priority support",
      "Custom branding",
    ],
  },
]

export default function PricingPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--mz-cloud)", display: "flex", flexDirection: "column" }}>
      {/* Nav */}
      <header style={{ height: 64, background: "var(--mz-white)", borderBottom: "1px solid var(--mz-border-2)", display: "flex", alignItems: "center", padding: "0 40px" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 30, height: 30, background: "var(--mz-orange)", borderRadius: 6, display: "grid", placeItems: "center", color: "white", fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 16 }}>M</div>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 17, letterSpacing: "0.04em" }}>MIZHAR</span>
        </Link>
      </header>

      <main style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 48, maxWidth: 600 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--mz-orange)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>Pricing</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 48, letterSpacing: "-0.03em", color: "var(--mz-ink)", lineHeight: 1.05, marginBottom: 12 }}>
            Simple, transparent pricing
          </h1>
          <p style={{ fontSize: 16, color: "var(--mz-ink-3)", lineHeight: 1.6 }}>
            Start free. Upgrade to Pro when you're ready to scale your fundraise. No credit card required.
          </p>
        </div>

        {/* Plans */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24, maxWidth: 900, width: "100%" }}>
          {PLANS.map(plan => (
            <div
              key={plan.name}
              className="card"
              style={{
                padding: "32px 28px",
                background: plan.highlight ? "var(--mz-white)" : "var(--mz-white)",
                border: plan.highlight ? "2px solid var(--mz-orange)" : "1px solid var(--mz-border-2)",
                position: "relative",
              }}
            >
              {plan.highlight && (
                <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "var(--mz-orange)", color: "white", padding: "4px 12px", borderRadius: 99, fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>Most popular</div>
              )}

              <div style={{ marginBottom: 24 }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 24, color: "var(--mz-ink)", marginBottom: 4 }}>{plan.name}</div>
                <p style={{ fontSize: 13, color: "var(--mz-ink-3)", marginBottom: 16 }}>{plan.desc}</p>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 12 }}>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 40, color: "var(--mz-ink)", letterSpacing: "-0.03em" }}>{plan.price}</span>
                  {plan.period && <span style={{ fontSize: 13, color: "var(--mz-ink-4)" }}>{plan.period}</span>}
                </div>
              </div>

              <Link
                href={plan.name === "Free" ? "/onboarding" : "/login"}
                className={plan.highlight ? "btn btn--primary" : "btn btn--secondary"}
                style={{ width: "100%", justifyContent: "center", marginBottom: 28 }}
              >
                {plan.cta}
              </Link>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {plan.features.map(feat => (
                  <div key={feat} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <CheckCircle size={16} style={{ color: "var(--mz-success)", flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: 13, color: "var(--mz-ink-2)" }}>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div style={{ marginTop: 64, maxWidth: 720, width: "100%" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 24, color: "var(--mz-ink)", marginBottom: 20, textAlign: "center" }}>Questions?</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { q: "Can I change plans anytime?", a: "Yes, upgrade or downgrade instantly." },
              { q: "Is there a free trial for Pro?", a: "Yes, 14 days free. No card required." },
              { q: "What payment methods?", a: "Credit card and PayPal." },
              { q: "Do you offer annual discounts?", a: "Yes, 20% off annual billing." },
            ].map(item => (
              <div key={item.q} style={{ padding: "16px 20px", background: "var(--mz-white)", borderRadius: 12, border: "1px solid var(--mz-border-2)" }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: "var(--mz-ink)", marginBottom: 6 }}>{item.q}</div>
                <div style={{ fontSize: 12, color: "var(--mz-ink-3)" }}>{item.a}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
