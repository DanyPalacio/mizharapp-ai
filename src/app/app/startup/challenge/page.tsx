"use client"

import { useState } from "react"
import { Shield, AlertOctagon, AlertTriangle, Info, ChevronDown, ChevronUp, Zap, RefreshCw } from "lucide-react"

type Severity = "critical" | "major" | "moderate" | "minor"
type VCVoice = "tiger" | "contrarian" | "operator" | "thesis"

interface Critique {
  id: number
  severity: Severity
  dimension: string
  headline: string
  body: string
  vcVoice: VCVoice
  counterpoint?: string
}

const CRITIQUES: Critique[] = [
  {
    id: 1,
    severity: "critical",
    dimension: "Market Timing",
    headline: "You're solving 2022's problem in 2026's market",
    body: "The AI automation wave you're riding crested 18 months ago. Enterprise buyers are now fatigued and retrenchment has set in. Category leaders (Workday, SAP extensions) are shipping native AI features that close your feature gap. What's your response to a world where your wedge is table stakes by your Series A?",
    vcVoice: "tiger",
    counterpoint: "Mizhar sees your differentiation in data moat — however, this argument needs to be pre-empted in your deck, not discovered in diligence.",
  },
  {
    id: 2,
    severity: "critical",
    dimension: "Unit Economics",
    headline: "Your CAC math doesn't survive channel saturation",
    body: "Your $840 CAC is based on blended paid + organic. Your organic is decaying (content ROI -34% YoY per Google Trends proxy) and your paid CAC is $1,420 standalone — already above breakeven at current LTV. At scale, you're buying customers you can't afford.",
    vcVoice: "operator",
    counterpoint: "Build a bottoms-up CAC model by channel with a credible path to $400 CAC. PLG or outbound-assisted motion may be the answer.",
  },
  {
    id: 3,
    severity: "major",
    dimension: "Competition",
    headline: "The incumbents have a 24-month head start on your moat",
    body: "You claim a 'proprietary ML pipeline' as your defensibility. But Salesforce Einstein, HubSpot Breeze, and three well-funded YC companies shipped equivalent features in the last 6 months. What's the technical moat that survives 18 months of VC-backed competition?",
    vcVoice: "contrarian",
  },
  {
    id: 4,
    severity: "major",
    dimension: "GTM Strategy",
    headline: "You're threading too many needles simultaneously",
    body: "Your deck shows enterprise, mid-market, and SMB as target segments. That's not a GTM strategy, it's an aspiration. Enterprise requires 90-day sales cycles and $300K+ deals; SMB needs PLG and sub-$500 ACV. You can't win both from a 12-person team with 18 months of runway.",
    vcVoice: "tiger",
    counterpoint: "Pick one. The beachhead should be the segment where you have the deepest existing relationships and the fastest time-to-value.",
  },
  {
    id: 5,
    severity: "moderate",
    dimension: "Team",
    headline: "No enterprise sales DNA in the founding team",
    body: "Your founders are technical and product-led — which is right for early-stage. But you're targeting enterprise as your primary motion. Without a sales leader with enterprise SaaS experience (quota-carrying, $500K+ ACV), your assumptions about sales velocity are optimistic by 2–3×.",
    vcVoice: "operator",
  },
  {
    id: 6,
    severity: "minor",
    dimension: "Financials",
    headline: "Your 3-year projections assume hockey-stick without evidence",
    body: "Going from $124K ARR today to $4.2M ARR in 36 months requires a 34× step-up with no account for churn, which historically runs 8–12% annually in your segment. Adjust for realistic churn and your Year 3 lands at $2.8M — still good, but be precise.",
    vcVoice: "thesis",
  },
]

const VC_VOICES: Record<VCVoice, { label: string; description: string; color: string }> = {
  tiger:       { label: "Tiger Mode",      description: "Aggressive growth investor. Pushes on speed, scale, and TAM.",  color: "#FF453A" },
  contrarian:  { label: "Contrarian",      description: "Challenges your core thesis. Assumes incumbents always win.",    color: "#FF9F0A" },
  operator:    { label: "Operator",        description: "Ex-founder focus. Tears apart unit economics and GTM math.",     color: "#64D2FF" },
  thesis:      { label: "Thesis Investor", description: "Macro-first. Evaluates against portfolio and market cycle.",     color: "#BF5AF2" },
}

const SEVERITY_META: Record<Severity, { icon: typeof AlertOctagon; color: string; bg: string; label: string }> = {
  critical: { icon: AlertOctagon, color: "#FF453A", bg: "rgba(255,69,58,.12)",  label: "Critical" },
  major:    { icon: AlertTriangle, color: "#FF9F0A", bg: "rgba(255,159,10,.10)", label: "Major" },
  moderate: { icon: AlertTriangle, color: "#FFD60A", bg: "rgba(255,214,10,.08)", label: "Moderate" },
  minor:    { icon: Info,          color: "#64D2FF", bg: "rgba(100,210,255,.08)", label: "Minor" },
}

export default function ChallengePage() {
  const [expanded, setExpanded] = useState<number | null>(1)
  const [activeVoice, setActiveVoice] = useState<VCVoice | "all">("all")
  const [showCounterpoint, setShowCounterpoint] = useState<Set<number>>(new Set())

  const filtered = activeVoice === "all"
    ? CRITIQUES
    : CRITIQUES.filter(c => c.vcVoice === activeVoice)

  const criticalCount = CRITIQUES.filter(c => c.severity === "critical").length
  const majorCount = CRITIQUES.filter(c => c.severity === "major").length

  return (
    <div style={{ minHeight: "100vh", background: "#0D1117", color: "white" }}>
      {/* Dark topbar */}
      <div style={{ height: 60, background: "#161B22", borderBottom: "1px solid rgba(255,255,255,.06)", display: "flex", alignItems: "center", padding: "0 32px", gap: 12 }}>
        <Shield size={18} style={{ color: "#FF453A" }} />
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "white" }}>Challenge Mode</span>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,.3)", fontFamily: "var(--font-mono)" }}>// VC stress-test simulation</span>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 8, color: "rgba(255,255,255,.6)", fontSize: 12, cursor: "pointer" }}>
            <RefreshCw size={13} /> Regenerate
          </button>
        </div>
      </div>

      <div style={{ padding: "32px 40px", maxWidth: 1100, margin: "0 auto" }}>
        {/* Header stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 32 }}>
          {[
            { label: "Total Critiques",    value: CRITIQUES.length,  color: "rgba(255,255,255,.8)" },
            { label: "Critical Issues",    value: criticalCount,     color: "#FF453A" },
            { label: "Major Issues",       value: majorCount,        color: "#FF9F0A" },
            { label: "Venture Score",      value: "74/100",          color: "#64D2FF" },
          ].map(stat => (
            <div key={stat.label} style={{ padding: "16px 20px", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 12 }}>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,.3)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>{stat.label}</div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 28, color: stat.color, letterSpacing: "-0.02em" }}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* VC Voice filter */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
          <button
            onClick={() => setActiveVoice("all")}
            style={{
              padding: "6px 14px", borderRadius: 99, fontSize: 12, fontWeight: 600, cursor: "pointer",
              background: activeVoice === "all" ? "rgba(255,255,255,.12)" : "transparent",
              border: `1px solid ${activeVoice === "all" ? "rgba(255,255,255,.2)" : "rgba(255,255,255,.08)"}`,
              color: activeVoice === "all" ? "white" : "rgba(255,255,255,.4)",
            }}
          >All voices</button>
          {(Object.entries(VC_VOICES) as [VCVoice, typeof VC_VOICES[VCVoice]][]).map(([key, voice]) => (
            <button
              key={key}
              onClick={() => setActiveVoice(key)}
              style={{
                padding: "6px 14px", borderRadius: 99, fontSize: 12, fontWeight: 600, cursor: "pointer",
                background: activeVoice === key ? `${voice.color}22` : "transparent",
                border: `1px solid ${activeVoice === key ? voice.color : "rgba(255,255,255,.08)"}`,
                color: activeVoice === key ? voice.color : "rgba(255,255,255,.4)",
              }}
            >
              {voice.label}
            </button>
          ))}
        </div>

        {/* Critique cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map(critique => {
            const { icon: SeverityIcon, color, bg, label } = SEVERITY_META[critique.severity]
            const voice = VC_VOICES[critique.vcVoice]
            const isExpanded = expanded === critique.id
            const showCP = showCounterpoint.has(critique.id)

            return (
              <div
                key={critique.id}
                style={{
                  background: bg,
                  border: `1px solid ${color}33`,
                  borderRadius: 14,
                  overflow: "hidden",
                  transition: "border-color var(--t-base) var(--ease-out)",
                }}
              >
                {/* Card header */}
                <button
                  onClick={() => setExpanded(isExpanded ? null : critique.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 14,
                    padding: "18px 20px", width: "100%", textAlign: "left",
                    background: "none", border: "none", cursor: "pointer",
                  }}
                >
                  <SeverityIcon size={18} style={{ color, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color, letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</span>
                      <span style={{ fontSize: 11, color: "rgba(255,255,255,.35)" }}>·</span>
                      <span style={{ fontSize: 11, color: "rgba(255,255,255,.4)", fontWeight: 600 }}>{critique.dimension}</span>
                      <span style={{ fontSize: 11, color: "rgba(255,255,255,.35)" }}>·</span>
                      <span style={{ fontSize: 10, padding: "1px 8px", borderRadius: 99, border: `1px solid ${voice.color}55`, color: voice.color, background: `${voice.color}11` }}>{voice.label}</span>
                    </div>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "white", lineHeight: 1.2 }}>
                      {critique.headline}
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp size={16} style={{ color: "rgba(255,255,255,.3)", flexShrink: 0 }} /> : <ChevronDown size={16} style={{ color: "rgba(255,255,255,.3)", flexShrink: 0 }} />}
                </button>

                {/* Expanded body */}
                {isExpanded && (
                  <div style={{ padding: "0 20px 20px 52px" }}>
                    <p style={{ fontSize: 14, color: "rgba(255,255,255,.65)", lineHeight: 1.7, marginBottom: critique.counterpoint ? 16 : 0 }}>
                      {critique.body}
                    </p>

                    {critique.counterpoint && (
                      <div>
                        <button
                          onClick={() => setShowCounterpoint(prev => {
                            const next = new Set(prev)
                            next.has(critique.id) ? next.delete(critique.id) : next.add(critique.id)
                            return next
                          })}
                          style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--mz-orange)", background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: showCP ? 10 : 0 }}
                        >
                          <Zap size={12} />
                          {showCP ? "Hide Mizhar's counterpoint" : "Show Mizhar's counterpoint"}
                        </button>
                        {showCP && (
                          <div style={{ padding: "12px 16px", background: "rgba(255,106,0,.1)", border: "1px solid rgba(255,106,0,.2)", borderRadius: 10, fontSize: 13, color: "rgba(255,255,255,.75)", lineHeight: 1.6 }}>
                            <strong style={{ color: "var(--mz-orange)" }}>Mizhar:</strong> {critique.counterpoint}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Risk matrix */}
        <div style={{ marginTop: 32, padding: "24px 28px", background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 14 }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "white", marginBottom: 20 }}>Risk Matrix</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
            {(["critical", "major", "moderate", "minor"] as Severity[]).map(sev => {
              const { color, label } = SEVERITY_META[sev]
              const items = CRITIQUES.filter(c => c.severity === sev)
              return (
                <div key={sev} style={{ padding: "14px 16px", background: `${color}0a`, border: `1px solid ${color}22`, borderRadius: 10 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>{label} ({items.length})</div>
                  {items.map(item => (
                    <div key={item.id} style={{ fontSize: 12, color: "rgba(255,255,255,.5)", marginBottom: 6, lineHeight: 1.4 }}>· {item.dimension}</div>
                  ))}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
