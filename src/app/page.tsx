import Link from "next/link"

export default function LandingPage() {
  return (
    <div style={{ background: "var(--mz-white)", minHeight: "100vh" }}>
      <Nav />
      <Hero />
      <LogoBar />
      <ModulesSection />
      <HowItWorks />
      <PricingTeaser />
      <Footer />
    </div>
  )
}

/* ── NAV ──────────────────────────────────────────────────────── */
function Nav() {
  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 50,
      background: "rgba(255,255,255,0.85)",
      backdropFilter: "saturate(180%) blur(14px)",
      borderBottom: "1px solid var(--mz-border-2)",
    }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", height: 72, display: "flex", alignItems: "center", padding: "0 40px", gap: 40 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 30, height: 30, background: "var(--mz-orange)", borderRadius: 6, display: "grid", placeItems: "center", color: "white", fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 16 }}>M</div>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 17, letterSpacing: "0.04em" }}>MIZHAR</span>
        </Link>

        <nav style={{ display: "flex", gap: 28, fontSize: 14, color: "var(--mz-ink-2)", fontWeight: 500, flex: 1 }}>
          <a href="#product">Product</a>
          <a href="#modules">Solutions</a>
          <a href="#how">How it works</a>
          <Link href="/pricing">Pricing</Link>
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Link href="/login" className="btn btn--ghost btn--sm">Log in</Link>
          <Link href="/onboarding" className="btn btn--primary btn--sm">Get Started</Link>
        </div>
      </div>
    </header>
  )
}

/* ── HERO ─────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section style={{ maxWidth: 1320, margin: "0 auto", padding: "96px 40px 80px", textAlign: "center" }}>
      <span className="pill">
        <span className="pill__dot" />
        AI-Powered Venture Intelligence
      </span>

      <h1 style={{
        fontFamily: "var(--font-display)", fontWeight: 700,
        fontSize: "clamp(48px, 7vw, 96px)",
        lineHeight: 1.0, letterSpacing: "-0.035em",
        margin: "28px 0 0",
      }}>
        Strategic intelligence<br />
        for <span style={{ color: "var(--mz-orange)", fontStyle: "italic" }}>founders.</span>
      </h1>

      <p style={{ fontSize: 19, color: "var(--mz-ink-2)", margin: "24px auto 0", maxWidth: 660, lineHeight: 1.5 }}>
        Validate, challenge, simulate and structure venture-scale business strategies with AI that reasons like a VC partner and remembers like a cofounder.
      </p>

      <div style={{ marginTop: 36, display: "flex", gap: 12, justifyContent: "center" }}>
        <Link href="/onboarding" className="btn btn--primary btn--lg">Start Strategic Analysis →</Link>
        <Link href="/onboarding?mode=upload" className="btn btn--secondary btn--lg">Upload Business Documents</Link>
      </div>

      {/* Hero Dashboard Preview */}
      <div style={{
        marginTop: 64,
        background: "linear-gradient(180deg,#FFFFFF 0%,#F5F6F7 100%)",
        border: "1px solid var(--mz-border-2)",
        borderRadius: 24, padding: 24,
        position: "relative", overflow: "hidden",
        boxShadow: "0 32px 80px -32px rgba(20,24,28,0.18)",
      }}>
        <div style={{ position: "absolute", top: "-40%", right: "-20%", width: 480, height: 480, background: "radial-gradient(circle,rgba(255,106,0,.16),transparent 60%)", pointerEvents: "none" }} />

        <div style={{
          background: "white", borderRadius: 16, border: "1px solid var(--mz-border-2)",
          boxShadow: "var(--sh-lg)", overflow: "hidden",
          display: "grid", gridTemplateColumns: "200px 1fr",
          minHeight: 480, textAlign: "left", position: "relative", zIndex: 1,
        }}>
          {/* Sidebar mini */}
          <aside style={{ background: "var(--mz-graphite)", padding: "18px 12px", color: "var(--mz-ink-on-dark-2)", fontSize: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, paddingBottom: 14, borderBottom: "1px solid rgba(255,255,255,.06)", marginBottom: 14 }}>
              <div style={{ width: 22, height: 22, background: "var(--mz-orange)", borderRadius: 4, display: "grid", placeItems: "center", color: "white", fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 12 }}>M</div>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 13, color: "white", letterSpacing: "0.04em" }}>MIZHAR</span>
            </div>
            {["Overview", "Challenge Mode", "Business Plan", "Marketing", "Valuation", "Simulations"].map((item, i) => (
              <div key={item} style={{
                display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", borderRadius: 4,
                color: i === 0 ? "var(--mz-orange)" : "var(--mz-ink-on-dark-2)", fontWeight: 500,
                background: i === 0 ? "rgba(255,106,0,0.14)" : "transparent",
              }}>
                <div style={{ width: 12, height: 12, background: "currentColor", borderRadius: 3, opacity: 0.6, flexShrink: 0 }} />
                {item}
              </div>
            ))}
          </aside>

          {/* Dashboard mini */}
          <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 11, color: "var(--mz-ink-3)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Active Workspace</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, marginTop: 2 }}>Tesla Energy Expansion</h3>
              </div>
              <span className="chip chip--orange">● Analyzing</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
              {[
                { label: "Venture Score", value: "78", sub: "/100", color: "var(--mz-orange)" },
                { label: "TAM", value: "$120B", sub: "", color: "var(--mz-ink)" },
                { label: "Risk", value: "Medium", sub: "", color: "var(--mz-warning)" },
                { label: "Funding Ready", value: "High", sub: "", color: "var(--mz-success)" },
              ].map(({ label, value, sub, color }) => (
                <div key={label} style={{ background: "white", border: "1px solid var(--mz-border-2)", borderRadius: 10, padding: 12 }}>
                  <div style={{ fontSize: 9.5, color: "var(--mz-ink-3)", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 }}>{label}</div>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, marginTop: 4, letterSpacing: "-0.02em", color }}>
                    {value}<span style={{ color: "var(--mz-ink-3)", fontSize: 12, fontWeight: 500 }}>{sub}</span>
                  </div>
                  <svg viewBox="0 0 100 30" style={{ marginTop: 6, height: 24, width: "100%" }}>
                    <path d="M0 25 Q20 22 40 16 T100 4" stroke={color} strokeWidth="1.6" fill="none" strokeLinecap="round" />
                  </svg>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 12, flex: 1 }}>
              <div style={{ background: "white", border: "1px solid var(--mz-border-2)", borderRadius: 10, padding: 14 }}>
                <h4 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 12, marginBottom: 8 }}>Market Opportunity · 5Y Projection</h4>
                <svg viewBox="0 0 360 120" style={{ width: "100%", height: 120 }}>
                  <defs>
                    <linearGradient id="grad1" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0" stopColor="#FF6A00" stopOpacity="0.25" />
                      <stop offset="1" stopColor="#FF6A00" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M10 100 Q70 85 130 65 T250 30 T350 10 L350 110 L10 110 Z" fill="url(#grad1)" />
                  <path d="M10 100 Q70 85 130 65 T250 30 T350 10" stroke="#FF6A00" strokeWidth="2" fill="none" />
                  <g fontFamily="var(--font-mono)" fontSize="9" fill="#9CA3AD">
                    <text x="10" y="118">2024</text><text x="100" y="118">2026</text>
                    <text x="200" y="118">2028</text><text x="305" y="118">2030</text>
                  </g>
                </svg>
              </div>
              <div style={{ background: "white", border: "1px solid var(--mz-border-2)", borderRadius: 10, padding: 14 }}>
                <h4 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 12, margin: "0 0 10px" }}>Strategic Highlights</h4>
                {[
                  { icon: "✓", text: "Strong unit economics ($312 LTV / $48 CAC)" },
                  { icon: "✓", text: "22% market growth tailwind" },
                  { icon: "!", text: "Regulatory uncertainty in 3 markets" },
                  { icon: "✓", text: "Series A readiness · 85% complete" },
                ].map(({ icon, text }) => (
                  <div key={text} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 11, marginBottom: 8 }}>
                    <span style={{ width: 14, height: 14, borderRadius: "50%", background: "var(--mz-orange-50)", display: "grid", placeItems: "center", color: "var(--mz-orange)", fontSize: 9, fontWeight: 700, flexShrink: 0 }}>{icon}</span>
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── LOGO BAR ─────────────────────────────────────────────────── */
function LogoBar() {
  const methods = [
    { label: "Method", title: "Harvard Case Method" },
    { label: "Frameworks", title: "McKinsey Built-in" },
    { label: "Engine", title: "Strategic Simulations" },
    { label: "Output", title: "Investor-Grade Intelligence" },
  ]
  return (
    <div style={{ maxWidth: 1320, margin: "0 auto", padding: 40, display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 28, borderTop: "1px solid var(--mz-border-2)", borderBottom: "1px solid var(--mz-border-2)" }}>
      {methods.map(({ label, title }) => (
        <div key={title} style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--mz-orange-50)", display: "grid", placeItems: "center" }}>
            <div style={{ width: 16, height: 16, borderRadius: 3, background: "var(--mz-orange)" }} />
          </div>
          <div>
            <div style={{ fontSize: 11, color: "var(--mz-ink-3)", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}>{label}</div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14, color: "var(--mz-ink)", marginTop: 2 }}>{title}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ── MODULES ──────────────────────────────────────────────────── */
const MODULE_CARDS = [
  { title: "Strategic Validation",  variant: "light",  desc: "Stress-test your idea against Harvard case logic, McKinsey frameworks, and 100k+ failed startups before you build." },
  { title: "Challenge Mode",        variant: "dark",   desc: "Our Anti-BS engine attacks your assumptions like a Tier-1 VC investment committee. Weak moat? CAC fantasy? It will tell you.", demo: '"Your projected 12% CAC payback is 3× more optimistic than the SaaS median. Defend or revise."' },
  { title: "Financial Modeling",    variant: "light",  desc: "5-year P&L, cash runway, unit economics, scenario forecasts — generated in seconds, editable in cells." },
  { title: "Valuation Engine",      variant: "orange", desc: "VC-grade valuation ranges, dilution simulators, SAFE conversion, ownership evolution across rounds." },
  { title: "What-If Simulations",   variant: "light",  desc: "Pivot to B2B. Raise the price. Lose your top customer. Run the scenario before the boardroom asks." },
  { title: "AI Strategic Chat",     variant: "light",  desc: '"What would YC think?" "Should I raise now?" "Rewrite my GTM." Persistent memory across every conversation.' },
]

function ModulesSection() {
  return (
    <section id="modules" style={{ maxWidth: 1320, margin: "0 auto", padding: "120px 40px" }}>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--mz-orange)", letterSpacing: "0.14em", textTransform: "uppercase" }}>// The platform</div>
      <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 56, letterSpacing: "-0.03em", lineHeight: 1.05, marginTop: 14, maxWidth: 760 }}>
        Twelve intelligence modules.<br />
        One <span style={{ color: "var(--mz-orange)" }}>strategic operating system.</span>
      </h2>
      <p style={{ fontSize: 18, color: "var(--mz-ink-2)", marginTop: 18, maxWidth: 640, lineHeight: 1.55 }}>
        Mizhar replaces the patchwork of consulting decks, financial models, market reports, and pitch templates with a single conversational intelligence layer that thinks like a cofounder.
      </p>

      <div style={{ marginTop: 56, display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
        {MODULE_CARDS.map(({ title, desc, variant, demo }) => {
          const bg = variant === "dark" ? "var(--mz-graphite)" : variant === "orange" ? "var(--mz-orange)" : "var(--mz-white)"
          const border = variant === "light" ? "var(--mz-border-2)" : bg
          const textColor = variant === "light" ? "var(--mz-ink)" : "white"
          const descColor = variant === "dark" ? "var(--mz-ink-on-dark-2)" : variant === "orange" ? "rgba(255,255,255,.85)" : "var(--mz-ink-3)"
          const iconBg = variant === "orange" ? "rgba(255,255,255,.18)" : variant === "dark" ? "rgba(255,106,0,.15)" : "var(--mz-orange-50)"
          const iconColor = variant === "orange" ? "white" : "var(--mz-orange)"
          return (
            <div key={title} style={{ background: bg, border: `1px solid ${border}`, borderRadius: 16, padding: 28, minHeight: 280, display: "flex", flexDirection: "column", color: textColor }}>
              <div style={{ width: 40, height: 40, background: iconBg, borderRadius: 10, display: "grid", placeItems: "center", marginBottom: 18, color: iconColor }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="m9 12 2 2 4-4" /></svg>
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, letterSpacing: "-0.015em" }}>{title}</div>
              <p style={{ fontSize: 14, marginTop: 8, lineHeight: 1.5, color: descColor }}>{desc}</p>
              {demo && (
                <div style={{ marginTop: "auto", paddingTop: 24 }}>
                  <div style={{ background: "rgba(255,106,0,.08)", borderLeft: "2px solid var(--mz-orange)", padding: "10px 12px", borderRadius: "0 8px 8px 0", fontSize: 12.5, lineHeight: 1.5, color: "var(--mz-ink-on-dark-2)" }}>{demo}</div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}

/* ── HOW IT WORKS ─────────────────────────────────────────────── */
function HowItWorks() {
  const steps = [
    { num: "01 — INPUT",       title: "Describe or upload",        desc: "Type a pitch, upload your deck, drop in financials, or start from one of 10 industry templates." },
    { num: "02 — INTERVIEW",   title: "10 strategic questions",    desc: "Conversational onboarding gathers what matters — like a fund partner's first meeting, not a tax form." },
    { num: "03 — INTELLIGENCE",title: "AI runs the frameworks",    desc: "Market sizing, SWOT, competitive landscape, valuation, financials and risks — generated in parallel." },
    { num: "04 — EXPORT",      title: "Investor-grade artifacts",  desc: "One-click PDF, PowerPoint and interactive HTML presentations with your branding." },
  ]
  return (
    <section id="how" style={{ maxWidth: 1320, margin: "0 auto", padding: "0 40px 120px" }}>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--mz-orange)", letterSpacing: "0.14em", textTransform: "uppercase" }}>// How it works</div>
      <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 56, letterSpacing: "-0.03em", lineHeight: 1.05, marginTop: 14 }}>
        From <span style={{ color: "var(--mz-orange)" }}>idea to investor-ready</span> in under an hour.
      </h2>
      <div style={{ marginTop: 64, display: "grid", gridTemplateColumns: "repeat(4,1fr)", border: "1px solid var(--mz-border-2)", borderRadius: 16, overflow: "hidden" }}>
        {steps.map(({ num, title, desc }, i) => (
          <div key={num} style={{ padding: "32px 28px", borderRight: i < 3 ? "1px solid var(--mz-border-2)" : "none", background: "var(--mz-white)" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--mz-orange)", letterSpacing: "0.1em", fontWeight: 600 }}>{num}</div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, marginTop: 8, letterSpacing: "-0.01em" }}>{title}</div>
            <p style={{ fontSize: 13.5, color: "var(--mz-ink-3)", marginTop: 8, lineHeight: 1.5 }}>{desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ── PRICING TEASER ───────────────────────────────────────────── */
function PricingTeaser() {
  const plans = [
    { name: "Free", price: "$0", period: "/mo", active: false, feats: ["1 startup workspace", "Basic business plan", "Light SWOT", "PDF export (watermark)"] },
    { name: "Pro",  price: "$49", period: "/mo", active: true,  feats: ["Unlimited analyses", "Challenge Mode + Valuation", "What-If simulations", "Full export suite"] },
  ]
  return (
    <section style={{ padding: "0 40px 120px", maxWidth: 1320, margin: "0 auto" }}>
      <div style={{ background: "var(--mz-graphite)", borderRadius: 24, padding: 64, display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 48, alignItems: "center" }}>
        <div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--mz-orange)", letterSpacing: "0.14em", textTransform: "uppercase" }}>// Founder-grade pricing</div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 48, letterSpacing: "-0.025em", lineHeight: 1.05, color: "white", marginTop: 12 }}>
            Validate free. <span style={{ color: "var(--mz-orange)" }}>Build venture-scale</span> on Pro.
          </h2>
          <p style={{ color: "var(--mz-ink-on-dark-2)", fontSize: 17, marginTop: 16, maxWidth: 460, lineHeight: 1.5 }}>
            Start free with a short business plan, basic SWOT, and a marketing snapshot. Upgrade to unlock unlimited analyses, Challenge Mode, valuation, simulations and premium exports.
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
            <Link href="/pricing" className="btn btn--primary btn--lg">See full pricing →</Link>
            <Link href="/onboarding" className="btn btn--ghost btn--lg" style={{ color: "white" }}>Start free</Link>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {plans.map(({ name, price, period, active, feats }) => (
            <div key={name} style={{ background: "var(--mz-graphite-2)", border: `1px solid ${active ? "var(--mz-orange)" : "var(--mz-graphite-3)"}`, borderRadius: 14, padding: 20, position: "relative" }}>
              {active && <div style={{ position: "absolute", top: -8, right: 16, background: "var(--mz-orange)", color: "white", fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 99, letterSpacing: "0.08em" }}>POPULAR</div>}
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "white" }}>{name}</div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 32, color: "white", marginTop: 12, letterSpacing: "-0.02em" }}>
                {price}<span style={{ fontSize: 14, color: "var(--mz-ink-on-dark-3)", fontWeight: 500 }}>{period}</span>
              </div>
              <div style={{ marginTop: 14, fontSize: 12, color: "var(--mz-ink-on-dark-2)", display: "grid", gap: 5 }}>
                {feats.map(f => <span key={f}><span style={{ color: "var(--mz-orange)", fontWeight: 700 }}>✓</span> {f}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── FOOTER ───────────────────────────────────────────────────── */
function Footer() {
  const cols = [
    { heading: "Product",   links: ["Strategic Analysis", "Challenge Mode", "Valuation Engine", "Simulations", "Pricing"] },
    { heading: "Resources", links: ["Documentation", "Founder library", "Methodology", "API"] },
    { heading: "Company",   links: ["About", "Careers", "Privacy", "Terms"] },
  ]
  return (
    <footer style={{ borderTop: "1px solid var(--mz-border-2)" }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "64px 40px 40px", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <div style={{ width: 30, height: 30, background: "var(--mz-orange)", borderRadius: 6, display: "grid", placeItems: "center", color: "white", fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 16 }}>M</div>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 17, letterSpacing: "0.04em" }}>MIZHAR</span>
          </div>
          <p style={{ fontSize: 13, color: "var(--mz-ink-3)", maxWidth: 300, lineHeight: 1.55 }}>
            The venture intelligence infrastructure that helps founders validate, challenge, and build venture-scale companies.
          </p>
        </div>
        {cols.map(({ heading, links }) => (
          <div key={heading}>
            <h5 style={{ fontSize: 12, color: "var(--mz-ink-3)", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600, fontFamily: "var(--font-body)", marginBottom: 14 }}>{heading}</h5>
            {links.map(link => <a key={link} href="#" style={{ display: "block", fontSize: 14, color: "var(--mz-ink-2)", padding: "5px 0" }}>{link}</a>)}
          </div>
        ))}
      </div>
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "24px 40px 48px", borderTop: "1px solid var(--mz-border-2)", display: "flex", justifyContent: "space-between", color: "var(--mz-ink-3)", fontSize: 13 }}>
        <div>© 2026 Mizhar Labs · Strategic Intelligence for Founders</div>
        <div>Status · All systems operational</div>
      </div>
    </footer>
  )
}
