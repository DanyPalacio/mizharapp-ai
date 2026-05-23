import Link from "next/link"

export default function LoginPage() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "100vh" }}>
      <IdentityPanel />
      <FormPanel />
    </div>
  )
}

/* ── LEFT — IDENTITY PANEL ─────────────────────────────────────── */
function IdentityPanel() {
  return (
    <div style={{
      background: "var(--mz-graphite)",
      display: "flex", flexDirection: "column",
      padding: "48px 56px",
      position: "relative", overflow: "hidden",
    }}>
      {/* Decorative radial */}
      <div style={{ position: "absolute", top: -80, right: -80, width: 480, height: 480, background: "radial-gradient(circle, rgba(255,106,0,.18), transparent 60%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -120, left: -80, width: 360, height: 360, background: "radial-gradient(circle, rgba(255,106,0,.08), transparent 60%)", pointerEvents: "none" }} />

      {/* Brand */}
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, position: "relative", zIndex: 1 }}>
        <div style={{ width: 32, height: 32, background: "var(--mz-orange)", borderRadius: 7, display: "grid", placeItems: "center", color: "white", fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 17 }}>M</div>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 18, letterSpacing: "0.04em", color: "white" }}>MIZHAR</span>
      </Link>

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", zIndex: 1 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--mz-orange)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 20 }}>
          // Strategic Intelligence
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 42, letterSpacing: "-0.03em", lineHeight: 1.05, color: "white", maxWidth: 380 }}>
          Your AI venture<br />intelligence layer.
        </h1>
        <p style={{ color: "var(--mz-ink-on-dark-2)", fontSize: 16, marginTop: 20, maxWidth: 360, lineHeight: 1.6 }}>
          Mizhar thinks like a strategic cofounder. It challenges your assumptions, simulates your future, and remembers everything.
        </p>

        {/* Trust stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24, marginTop: 48 }}>
          {[
            { value: "12,400+", label: "Analyses run" },
            { value: "$2.4B+", label: "Capital influenced" },
            { value: "94%", label: "Retention rate" },
          ].map(({ value, label }) => (
            <div key={label}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 26, color: "white", letterSpacing: "-0.02em" }}>{value}</div>
              <div style={{ fontSize: 12, color: "var(--mz-ink-on-dark-3)", marginTop: 4, letterSpacing: "0.04em" }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Testimonial */}
        <div style={{ marginTop: 48, background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 12, padding: "20px 24px" }}>
          <p style={{ color: "var(--mz-ink-on-dark-2)", fontSize: 14, lineHeight: 1.65, fontStyle: "italic" }}>
            "Mizhar identified three fatal assumptions in our pitch before our first VC meeting. We fixed them and closed our seed round in 3 weeks."
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, var(--mz-orange), var(--mz-orange-700))", display: "grid", placeItems: "center", color: "white", fontWeight: 700, fontSize: 13 }}>S</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "white" }}>Sofia Mendez</div>
              <div style={{ fontSize: 11, color: "var(--mz-ink-on-dark-3)", marginTop: 2 }}>CEO @ Launchpad AI · Seed $1.8M</div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust strip */}
      <div style={{ display: "flex", alignItems: "center", gap: 20, position: "relative", zIndex: 1, paddingTop: 32, borderTop: "1px solid rgba(255,255,255,.06)" }}>
        {["SOC 2 Type II", "GDPR", "E2E Encrypted"].map(t => (
          <span key={t} style={{ fontSize: 11, color: "var(--mz-ink-on-dark-3)", display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--mz-success)", display: "inline-block" }} />
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ── RIGHT — FORM PANEL ────────────────────────────────────────── */
function FormPanel() {
  return (
    <div style={{ background: "var(--mz-white)", display: "flex", flexDirection: "column", justifyContent: "center", padding: "48px 72px" }}>
      <div style={{ maxWidth: 400, width: "100%", margin: "0 auto" }}>
        {/* Header */}
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 30, letterSpacing: "-0.025em" }}>
          Welcome back, founder.
        </h2>
        <p style={{ color: "var(--mz-ink-3)", fontSize: 15, marginTop: 8 }}>
          Sign in to your workspace or{" "}
          <Link href="/onboarding" style={{ color: "var(--mz-orange)", fontWeight: 600 }}>create a new one.</Link>
        </p>

        {/* SSO Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 32 }}>
          {[
            { label: "Continue with Google",   color: "#4285F4", letter: "G" },
            { label: "Continue with LinkedIn",  color: "#0A66C2", letter: "in" },
            { label: "Continue with Apple",     color: "#000000", letter: "" },
          ].map(({ label, color, letter }) => (
            <button
              key={label}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                height: 44, borderRadius: "var(--r-md)", border: "1px solid var(--mz-border)",
                background: "var(--mz-white)", color: "var(--mz-ink)",
                fontWeight: 600, fontSize: 14, cursor: "pointer",
                transition: "all var(--t-fast) var(--ease-out)",
              }}
            >
              <span style={{
                width: 22, height: 22, borderRadius: 4, background: color,
                display: "grid", placeItems: "center", color: "white",
                fontSize: letter === "in" ? 10 : 13, fontWeight: 700,
              }}>
                {letter || (
                  <svg width="14" height="14" viewBox="0 0 814 1000" fill="currentColor">
                    <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-43.4-150.3-107.7C27.5 749.5 0 651.2 0 556.5 0 295 186 143 370 143c96 0 183.3 63.3 244 63.3z" />
                  </svg>
                )}
              </span>
              {label}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "28px 0" }}>
          <div style={{ flex: 1, height: 1, background: "var(--mz-border-2)" }} />
          <span style={{ fontSize: 12, color: "var(--mz-ink-4)", fontWeight: 600 }}>or continue with email</span>
          <div style={{ flex: 1, height: 1, background: "var(--mz-border-2)" }} />
        </div>

        {/* Email Form */}
        <form style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="field">
            <label className="field__label">Email address</label>
            <input
              type="email"
              className="mz-input"
              placeholder="you@startup.com"
              autoComplete="email"
            />
          </div>
          <div className="field">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label className="field__label">Password</label>
              <a href="#" style={{ fontSize: 12, color: "var(--mz-orange)", fontWeight: 600 }}>Forgot password?</a>
            </div>
            <input
              type="password"
              className="mz-input"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="btn btn--primary" style={{ height: 44, marginTop: 4, fontSize: 15 }}>
            Sign in →
          </button>
        </form>

        {/* Magic link */}
        <button style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", marginTop: 12, height: 44, borderRadius: "var(--r-md)", border: "1px dashed var(--mz-border)", background: "transparent", color: "var(--mz-ink-3)", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
          <span>✨</span> Send magic link instead
        </button>

        {/* Footer */}
        <p style={{ textAlign: "center", fontSize: 13, color: "var(--mz-ink-3)", marginTop: 28 }}>
          No account?{" "}
          <Link href="/onboarding" style={{ color: "var(--mz-orange)", fontWeight: 600 }}>Start for free</Link>
        </p>
        <p style={{ textAlign: "center", fontSize: 11, color: "var(--mz-ink-4)", marginTop: 16, lineHeight: 1.6 }}>
          By signing in, you agree to our{" "}
          <a href="#" style={{ color: "var(--mz-ink-3)" }}>Terms of Service</a> and{" "}
          <a href="#" style={{ color: "var(--mz-ink-3)" }}>Privacy Policy</a>
        </p>
      </div>
    </div>
  )
}
