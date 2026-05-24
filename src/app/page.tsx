import Link from "next/link"
import Image from "next/image"

export default function LandingPage() {
  return (
    <div style={{ background: "var(--mz-white)", minHeight: "100vh" }}>
      <Nav />
      <Hero />
      <MethodologyBar />
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
      background: "rgba(255,255,255,0.88)",
      backdropFilter: "saturate(180%) blur(14px)",
      borderBottom: "1px solid var(--mz-border-2)",
    }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", height: 72, display: "flex", alignItems: "center", padding: "0 40px", gap: 40 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ width: 32, height: 32, background: "var(--mz-orange)", borderRadius: 7, display: "grid", placeItems: "center", flexShrink: 0 }}>
            <svg width="19" height="19" viewBox="0 0 20 20" fill="none">
              <path d="M2 16V4l8 8 8-8v12" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 17, letterSpacing: "0.04em", color: "var(--mz-ink)" }}>MIZHAR</span>
        </Link>

        <nav style={{ display: "flex", gap: 28, fontSize: 14, color: "var(--mz-ink-2)", fontWeight: 500, flex: 1 }}>
          <a href="#product" style={{ transition: "color 120ms" }}>Product</a>
          <a href="#modules" style={{ transition: "color 120ms" }}>Solutions</a>
          <a href="#how" style={{ transition: "color 120ms" }}>How it works</a>
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
      {/* Pill */}
      <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", background: "var(--mz-cloud)", border: "1px solid var(--mz-border-2)", borderRadius: "var(--r-pill)", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--mz-ink-2)" }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--mz-orange)", boxShadow: "0 0 0 4px rgba(255,106,0,0.18)", display: "inline-block" }} />
        AI-Powered Venture Intelligence
      </div>

      {/* Title */}
      <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(48px,7vw,96px)", lineHeight: 1.0, letterSpacing: "-0.035em", margin: "28px 0 0" }}>
        Strategic intelligence<br />
        <span style={{ color: "var(--mz-orange)", fontStyle: "italic" }}>for founders.</span>
      </h1>

      {/* Sub */}
      <p style={{ fontSize: 19, color: "var(--mz-ink-2)", margin: "24px auto 0", maxWidth: 640, lineHeight: 1.55 }}>
        Validate, challenge, simulate and structure venture-scale business strategies
        with AI that reasons like a VC partner and remembers like a cofounder.
      </p>

      {/* CTAs */}
      <div style={{ marginTop: 36, display: "flex", gap: 12, justifyContent: "center", alignItems: "center" }}>
        <Link href="/onboarding" className="btn btn--primary btn--lg">
          Start Strategic Analysis →
        </Link>
        <Link href="/onboarding" className="btn btn--ghost btn--lg">
          Upload Business Documents
        </Link>
      </div>

      {/* Hero Visual — App Preview */}
      <div style={{
        marginTop: 64,
        background: "linear-gradient(180deg, #FFFFFF 0%, var(--mz-cloud) 100%)",
        border: "1px solid var(--mz-border-2)",
        borderRadius: 24,
        padding: 24,
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 32px 80px -32px rgba(20,24,28,0.18)",
      }}>
        {/* Orange glow */}
        <div style={{ position: "absolute", top: "-20%", right: "-5%", width: 480, height: 480, background: "radial-gradient(circle, rgba(255,106,0,0.12), transparent 60%)", pointerEvents: "none" }} />

        {/* App shell preview */}
        <div style={{
          background: "white",
          borderRadius: 16,
          border: "1px solid var(--mz-border-2)",
          boxShadow: "var(--sh-lg)",
          overflow: "hidden",
          display: "grid",
          gridTemplateColumns: "200px 1fr",
          minHeight: 480,
          textAlign: "left",
          position: "relative", zIndex: 1,
        }}>
          {/* Sidebar preview */}
          <div style={{ background: "var(--mz-graphite)", padding: "18px 12px", color: "var(--mz-ink-on-dark-2)", fontSize: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, paddingBottom: 14, borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: 14 }}>
              <div style={{ width: 22, height: 22, background: "var(--mz-orange)", borderRadius: 4, display: "grid", placeItems: "center" }}>
                <svg width="13" height="13" viewBox="0 0 20 20" fill="none"><path d="M2 16V4l8 8 8-8v12" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 13, color: "white", letterSpacing: "0.04em" }}>MIZHAR</span>
            </div>
            {["Overview","Challenge Mode","Business Plan","Marketing","Financials","Market Intel","SWOT Analysis"].map((item, i) => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", borderRadius: 4, color: i === 0 ? "var(--mz-orange)" : "var(--mz-ink-on-dark-2)", background: i === 0 ? "rgba(255,106,0,0.14)" : "transparent", fontWeight: i === 0 ? 600 : 400, marginBottom: 2 }}>
                <div style={{ width: 12, height: 12, background: "currentColor", borderRadius: 3, opacity: i === 0 ? 1 : 0.4, flexShrink: 0 }} />
                {item}
              </div>
            ))}
          </div>

          {/* Main content preview */}
          <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 11, color: "var(--mz-ink-3)", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 }}>Active Workspace</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, marginTop: 2 }}>Tesla Energy Expansion</h3>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--mz-orange)", fontWeight: 600 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--mz-orange)", animation: "pulse 2s infinite" }} />
                Analyzing
              </div>
            </div>

            {/* Metrics */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
              {[
                { l: "Venture Score", v: "78", s: "/100" },
                { l: "TAM", v: "$120B", s: "" },
                { l: "Risk", v: "Medium", s: "", c: "#C77700" },
                { l: "Funding Ready", v: "High", s: "", c: "var(--mz-success)" },
              ].map(m => (
                <div key={m.l} style={{ background: "var(--mz-cloud)", borderRadius: 10, padding: "12px 14px" }}>
                  <div style={{ fontSize: 9.5, color: "var(--mz-ink-3)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>{m.l}</div>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, marginTop: 4, color: m.c || "var(--mz-ink)" }}>
                    {m.v}<span style={{ fontSize: 12, fontWeight: 500, color: "var(--mz-ink-3)" }}>{m.s}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Chart placeholder */}
            <div style={{ background: "var(--mz-cloud)", borderRadius: 10, padding: 16, flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 12, color: "var(--mz-ink-2)" }}>Market Opportunity · 5Y Projection</div>
              <svg viewBox="0 0 400 100" width="100%" height="80">
                <defs>
                  <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FF6A00" stopOpacity="0.18"/>
                    <stop offset="100%" stopColor="#FF6A00" stopOpacity="0.01"/>
                  </linearGradient>
                </defs>
                <path d="M0,90 C60,85 120,70 180,50 C240,30 300,15 400,5" stroke="var(--mz-orange)" strokeWidth="2" fill="none"/>
                <path d="M0,90 C60,85 120,70 180,50 C240,30 300,15 400,5 L400,100 L0,100 Z" fill="url(#chartFill)"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── METHODOLOGY BAR ──────────────────────────────────────────── */
function MethodologyBar() {
  const items = [
    { icon: "📐", label: "FRAMEWORK", name: "Harvard Case Method" },
    { icon: "📊", label: "BUILT-IN", name: "McKinsey Frameworks" },
    { icon: "🔄", label: "STRATEGIC", name: "Scenario Simulations" },
    { icon: "📈", label: "INVESTOR-GRADE", name: "Financial Intelligence" },
  ]
  return (
    <div style={{ borderTop: "1px solid var(--mz-border-2)", borderBottom: "1px solid var(--mz-border-2)" }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "32px 40px", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 28 }}>
        {items.map(item => (
          <div key={item.name} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 20 }}>{item.icon}</span>
            <div>
              <div style={{ fontSize: 10, color: "var(--mz-ink-3)", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 }}>{item.label}</div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14, color: "var(--mz-ink)", marginTop: 2 }}>{item.name}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── MODULES SECTION ──────────────────────────────────────────── */
const MODULES = [
  { title: "Challenge Mode", desc: "Anti-BS engine that stress-tests every assumption like a Series A investor.", badge: "AI", bg: "var(--mz-graphite)", color: "white", accent: "var(--mz-orange)" },
  { title: "Business Plan", desc: "Generate investor-grade business plans with financial models in minutes.", badge: null, bg: "white", color: "var(--mz-ink)", accent: "var(--mz-orange)" },
  { title: "Market Intelligence", desc: "Real-time TAM/SAM/SOM analysis with live economic indicators.", badge: "LIVE", bg: "white", color: "var(--mz-ink)", accent: "var(--mz-orange)" },
  { title: "Valuation Engine", desc: "VC Method, DCF, Revenue Multiple — 5 methodologies, one answer.", badge: "PRO", bg: "var(--mz-orange)", color: "white", accent: "white" },
  { title: "Strategic Simulations", desc: "Monte Carlo scenarios, what-if analysis, and competitive simulations.", badge: "PRO", bg: "white", color: "var(--mz-ink)", accent: "var(--mz-orange)" },
  { title: "Investor Deck", desc: "AI-generated pitch decks built on your actual data and analysis.", badge: "PRO", bg: "white", color: "var(--mz-ink)", accent: "var(--mz-orange)" },
]

function ModulesSection() {
  return (
    <section id="modules" style={{ maxWidth: 1320, margin: "0 auto", padding: "120px 40px" }}>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--mz-orange)", letterSpacing: "0.14em", textTransform: "uppercase" }}>
        01 — Platform
      </div>
      <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(36px,4vw,56px)", letterSpacing: "-0.03em", lineHeight: 1.05, marginTop: 14, maxWidth: 760 }}>
        Every tool a founder needs.<br />
        <span style={{ color: "var(--mz-orange)" }}>Nothing they don&apos;t.</span>
      </h2>
      <p style={{ fontSize: 18, color: "var(--mz-ink-2)", marginTop: 18, maxWidth: 580, lineHeight: 1.55 }}>
        Integrated intelligence modules that work together to give you the full picture — from idea validation to Series A readiness.
      </p>

      <div style={{ marginTop: 56, display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
        {MODULES.map((m) => (
          <div key={m.title} style={{
            background: m.bg,
            border: m.bg === "white" ? "1px solid var(--mz-border-2)" : "none",
            borderRadius: 16,
            padding: 28,
            position: "relative",
            overflow: "hidden",
            transition: "transform var(--t-base) var(--ease-out), box-shadow var(--t-base) var(--ease-out)",
            cursor: "pointer",
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: m.bg === "white" ? "var(--mz-orange-50)" : "rgba(255,255,255,0.12)", display: "grid", placeItems: "center" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={m.accent} strokeWidth="2" strokeLinecap="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              </div>
              {m.badge && (
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.06em", padding: "3px 7px", borderRadius: 4, background: m.bg === "white" ? "var(--mz-graphite)" : "rgba(255,255,255,0.15)", color: m.bg === "white" ? "white" : "rgba(255,255,255,0.9)" }}>
                  {m.badge}
                </span>
              )}
            </div>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: m.color, letterSpacing: "-0.01em" }}>{m.title}</h3>
            <p style={{ fontSize: 14, color: m.bg === "white" ? "var(--mz-ink-2)" : "rgba(255,255,255,0.7)", marginTop: 10, lineHeight: 1.55 }}>{m.desc}</p>
            <div style={{ marginTop: 20, fontSize: 13, fontWeight: 600, color: m.accent, display: "flex", alignItems: "center", gap: 5 }}>
              Explore →
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ── HOW IT WORKS ─────────────────────────────────────────────── */
function HowItWorks() {
  const steps = [
    { n: "01", title: "Input", desc: "Upload your documents or answer 10 strategic questions." },
    { n: "02", title: "AI Analysis", desc: "Our AI analyzes your venture using Harvard & McKinsey frameworks." },
    { n: "03", title: "Strategic Intelligence", desc: "Get deep insights, simulations, and strategic recommendations." },
    { n: "04", title: "Make Better Decisions", desc: "Validate, refine and build with confidence." },
  ]
  return (
    <section id="how" style={{ background: "var(--mz-cloud)", padding: "0 0 120px" }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "120px 40px 0" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--mz-orange)", letterSpacing: "0.14em", textTransform: "uppercase" }}>02 — Process</div>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(36px,4vw,56px)", letterSpacing: "-0.03em", lineHeight: 1.05, marginTop: 14 }}>
          From idea to investor-ready<br /><span style={{ color: "var(--mz-orange)" }}>in 4 steps.</span>
        </h2>
        <div style={{ marginTop: 56, display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24 }}>
          {steps.map((s, i) => (
            <div key={s.n}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--mz-orange)", color: "white", display: "grid", placeItems: "center", fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{s.n}</div>
                {i < steps.length - 1 && <div style={{ flex: 1, height: 1, background: "var(--mz-border)" }} />}
              </div>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20 }}>{s.title}</h3>
              <p style={{ fontSize: 14, color: "var(--mz-ink-2)", marginTop: 8, lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── PRICING TEASER ───────────────────────────────────────────── */
function PricingTeaser() {
  return (
    <section style={{ background: "var(--mz-graphite)", padding: "120px 40px" }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--mz-orange)", letterSpacing: "0.14em", textTransform: "uppercase" }}>03 — Pricing</div>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(36px,4vw,56px)", letterSpacing: "-0.03em", color: "white", marginTop: 14, lineHeight: 1.05 }}>
          Start free. Scale when ready.
        </h2>
        <p style={{ fontSize: 18, color: "var(--mz-ink-on-dark-2)", marginTop: 18, maxWidth: 520, margin: "18px auto 0", lineHeight: 1.55 }}>
          Powerful free tools for every founder. Unlock the full intelligence suite when you need it.
        </p>
        <div style={{ marginTop: 56, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, maxWidth: 720, margin: "56px auto 0" }}>
          {[
            { plan: "Free", price: "$0", features: ["5 analyses/month", "Business Plan builder", "SWOT & Market basics", "AI Chat (limited)"], cta: "Start Free", ctaStyle: "ghost" },
            { plan: "Pro", price: "$49", period: "/mo", features: ["Unlimited analyses", "Challenge Mode (anti-BS AI)", "Valuation Engine", "Simulations & Scenarios", "Investor Deck generator", "Priority support"], cta: "Start Pro Trial", ctaStyle: "primary" },
          ].map(p => (
            <div key={p.plan} style={{ background: p.ctaStyle === "primary" ? "white" : "rgba(255,255,255,0.05)", border: p.ctaStyle === "primary" ? "none" : "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: 32, textAlign: "left" }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, letterSpacing: "0.04em", color: p.ctaStyle === "primary" ? "var(--mz-ink-2)" : "var(--mz-ink-on-dark-2)", textTransform: "uppercase" }}>{p.plan}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginTop: 8 }}>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 44, letterSpacing: "-0.03em", color: p.ctaStyle === "primary" ? "var(--mz-ink)" : "white" }}>{p.price}</span>
                {p.period && <span style={{ color: "var(--mz-ink-3)", fontSize: 16 }}>{p.period}</span>}
              </div>
              <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 10 }}>
                {p.features.map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: p.ctaStyle === "primary" ? "var(--mz-ink-2)" : "var(--mz-ink-on-dark-2)" }}>
                    <div style={{ width: 16, height: 16, borderRadius: "50%", background: p.ctaStyle === "primary" ? "var(--mz-orange-50)" : "rgba(255,106,0,0.15)", color: "var(--mz-orange)", display: "grid", placeItems: "center", fontSize: 10, fontWeight: 700, flexShrink: 0 }}>✓</div>
                    {f}
                  </div>
                ))}
              </div>
              <Link href="/onboarding" className={`btn btn--${p.ctaStyle} btn--lg`} style={{ marginTop: 28, width: "100%", justifyContent: "center" }}>
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── FOOTER ───────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--mz-border-2)", padding: "40px", background: "white" }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 26, height: 26, background: "var(--mz-orange)", borderRadius: 5, display: "grid", placeItems: "center" }}>
            <svg width="15" height="15" viewBox="0 0 20 20" fill="none"><path d="M2 16V4l8 8 8-8v12" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 15, letterSpacing: "0.04em" }}>MIZHAR</span>
        </div>
        <div style={{ display: "flex", gap: 28, fontSize: 13, color: "var(--mz-ink-3)" }}>
          <Link href="/legal/privacy">Privacy</Link>
          <Link href="/legal/terms">Terms</Link>
          <Link href="/legal/about">About</Link>
          <Link href="/blog">Blog</Link>
        </div>
        <p style={{ fontSize: 13, color: "var(--mz-ink-4)" }}>© 2026 MIZHAR AI. Built for founders.</p>
      </div>
    </footer>
  )
}
