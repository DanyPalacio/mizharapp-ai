"use client"

import { useState } from "react"
import Topbar from "@/components/layout/topbar"
import {
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle,
  ArrowRight, Zap, BarChart2, Target, Users, DollarSign, Globe
} from "lucide-react"

const VENTURE_SCORE = 74

const METRIC_STRIP = [
  { label: "Runway",           value: "18 mo",   trend: "up",   delta: "+2 mo",    icon: TrendingUp },
  { label: "Burn Rate",        value: "$42K",    trend: "down", delta: "-8%",      icon: TrendingDown },
  { label: "ARR",              value: "$124K",   trend: "up",   delta: "+31%",     icon: TrendingUp },
  { label: "CAC",              value: "$840",    trend: "down", delta: "-12%",     icon: TrendingDown },
  { label: "LTV:CAC",         value: "3.2×",    trend: "up",   delta: "+0.4",     icon: TrendingUp },
  { label: "Gross Margin",     value: "68%",     trend: "up",   delta: "+3pp",     icon: TrendingUp },
]

const STRENGTHS = [
  "Strong LTV:CAC ratio well above VC benchmark of 3×",
  "Gross margin trajectory toward SaaS median (75%)",
  "Product-market fit signals: NPS 62, churn <2%/mo",
  "Technical moat: proprietary ML pipeline reduces CAC",
]

const RISKS = [
  { severity: "high",   label: "Runway < 18 months — must close next round by Q3" },
  { severity: "medium", label: "Competitive entry from funded incumbents likely in 6–9 months" },
  { severity: "medium", label: "CAC increasing YoY as paid channels saturate" },
  { severity: "low",    label: "Enterprise sales cycle (90 days avg) strains cash flow" },
]

const MODULES = [
  { key: "challenge",    icon: Zap,       label: "Challenge Mode",     sub: "Stress-test your pitch",     href: "/app/startup/challenge",  badge: "PRO", color: "var(--mz-orange)" },
  { key: "plan",         icon: BarChart2, label: "Business Plan",       sub: "Full strategic document",   href: "/app/startup/plan",        color: "var(--mz-graphite)" },
  { key: "market",       icon: Globe,     label: "Market Intelligence", sub: "TAM, trends, benchmarks",   href: "/app/startup/market",      color: "#0A84FF" },
  { key: "financials",   icon: DollarSign,label: "Financials",          sub: "3-year model + scenarios",  href: "/app/startup/financials",  color: "#30D158" },
  { key: "competitors",  icon: Users,     label: "Competitors",         sub: "Landscape + positioning",   href: "/app/startup/competitors", color: "#FF9F0A" },
  { key: "fundraising",  icon: Target,    label: "Fundraising",         sub: "Investor targeting + deck", href: "/app/startup/fundraising", badge: "PRO", color: "#BF5AF2" },
]

const CHART_POINTS = [18, 24, 22, 31, 38, 45, 52, 58, 62, 71, 74]

export default function OverviewPage() {
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null)

  const circumference = 2 * Math.PI * 44
  const scoreOffset = circumference - (VENTURE_SCORE / 100) * circumference

  const chartW = 320
  const chartH = 80
  const pts = CHART_POINTS
  const minPt = Math.min(...pts)
  const maxPt = Math.max(...pts)
  const toX = (i: number) => (i / (pts.length - 1)) * chartW
  const toY = (v: number) => chartH - ((v - minPt) / (maxPt - minPt)) * chartH
  const polyline = pts.map((v, i) => `${toX(i)},${toY(v)}`).join(" ")
  const area = `M0,${chartH} ` + pts.map((v, i) => `L${toX(i)},${toY(v)}`).join(" ") + ` L${chartW},${chartH} Z`

  return (
    <>
      <Topbar
        crumbs={[{ label: "Startup" }, { label: "Overview" }]}
        meta={[{ label: "Last updated 2 hours ago" }]}
      />

      <div style={{ padding: "32px 40px", display: "flex", flexDirection: "column", gap: 24 }}>

        {/* Hero card: Venture Score + trajectory */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {/* Venture Score */}
          <div className="card" style={{ display: "flex", gap: 28, alignItems: "center" }}>
            {/* Ring */}
            <div style={{ position: "relative", width: 108, height: 108, flexShrink: 0 }}>
              <svg width="108" height="108" viewBox="0 0 108 108" style={{ transform: "rotate(-90deg)" }}>
                <circle cx="54" cy="54" r="44" fill="none" stroke="var(--mz-cloud)" strokeWidth="8" />
                <circle
                  cx="54" cy="54" r="44"
                  fill="none"
                  stroke={VENTURE_SCORE >= 70 ? "var(--mz-success)" : VENTURE_SCORE >= 50 ? "var(--mz-orange)" : "var(--mz-danger)"}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={scoreOffset}
                />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 26, letterSpacing: "-0.03em", color: "var(--mz-ink)" }}>{VENTURE_SCORE}</span>
                <span style={{ fontSize: 10, color: "var(--mz-ink-4)", letterSpacing: "0.06em" }}>/100</span>
              </div>
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--mz-orange)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>Venture Score</div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--mz-ink)", letterSpacing: "-0.02em", marginBottom: 4 }}>
                Strong Fundamentals
              </div>
              <p style={{ fontSize: 13, color: "var(--mz-ink-3)", lineHeight: 1.55, maxWidth: 280 }}>
                Your venture scores in the top 28% of SaaS startups at this stage. Key driver: LTV:CAC ratio and low churn.
              </p>
              <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
                {["Traction", "Moat", "Team"].map(tag => (
                  <span key={tag} className="chip chip--success" style={{ fontSize: 11 }}>{tag} ✓</span>
                ))}
                <span className="chip chip--warning" style={{ fontSize: 11 }}>Runway ⚠</span>
              </div>
            </div>
          </div>

          {/* Score trajectory chart */}
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--mz-ink-4)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>Score Trajectory</div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--mz-ink)" }}>+56 pts in 90 days</div>
              </div>
              <span style={{ fontSize: 12, color: "var(--mz-success)", fontWeight: 600 }}>↑ Improving</span>
            </div>
            <svg width="100%" viewBox={`0 0 ${chartW} ${chartH}`} preserveAspectRatio="none" style={{ height: 80 }}>
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--mz-orange)" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="var(--mz-orange)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={area} fill="url(#scoreGrad)" />
              <polyline points={polyline} fill="none" stroke="var(--mz-orange)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
              <circle cx={toX(CHART_POINTS.length - 1)} cy={toY(CHART_POINTS[CHART_POINTS.length - 1])} r="4" fill="var(--mz-orange)" />
            </svg>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
              <span style={{ fontSize: 11, color: "var(--mz-ink-4)" }}>Feb</span>
              <span style={{ fontSize: 11, color: "var(--mz-ink-4)" }}>Apr</span>
              <span style={{ fontSize: 11, color: "var(--mz-ink-4)" }}>Today</span>
            </div>
          </div>
        </div>

        {/* Metric strip */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 12 }}>
          {METRIC_STRIP.map(m => (
            <div
              key={m.label}
              className="card"
              onMouseEnter={() => setHoveredMetric(m.label)}
              onMouseLeave={() => setHoveredMetric(null)}
              style={{
                padding: "16px 18px",
                border: hoveredMetric === m.label ? "1px solid var(--mz-orange-100)" : "1px solid var(--mz-border-2)",
                transition: "border-color var(--t-fast) var(--ease-out)",
              }}
            >
              <div style={{ fontSize: 11, color: "var(--mz-ink-4)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>{m.label}</div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--mz-ink)", letterSpacing: "-0.02em", marginBottom: 4 }}>{m.value}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <m.icon size={12} style={{ color: m.trend === "up" ? "var(--mz-success)" : "var(--mz-danger)" }} />
                <span style={{ fontSize: 11, fontWeight: 600, color: m.trend === "up" ? "var(--mz-success)" : "var(--mz-danger)" }}>{m.delta}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Strengths + Risks */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {/* Strengths */}
          <div className="card">
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <CheckCircle size={16} style={{ color: "var(--mz-success)" }} />
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--mz-ink)" }}>Strategic Strengths</span>
              <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--mz-success)", fontWeight: 600 }}>{STRENGTHS.length} identified</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {STRENGTHS.map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 10, padding: "10px 12px", background: "var(--mz-success-50)", borderRadius: 8, border: "1px solid rgba(52,199,89,.15)" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--mz-success)", marginTop: 5, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: "var(--mz-ink-2)", lineHeight: 1.5 }}>{s}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Risks */}
          <div className="card">
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <AlertTriangle size={16} style={{ color: "var(--mz-warning)" }} />
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--mz-ink)" }}>Risk Flags</span>
              <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--mz-danger)", fontWeight: 600 }}>1 critical</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {RISKS.map((r, i) => {
                const bg = r.severity === "high" ? "var(--mz-danger-50)" : r.severity === "medium" ? "var(--mz-warning-50)" : "var(--mz-cloud)"
                const dot = r.severity === "high" ? "var(--mz-danger)" : r.severity === "medium" ? "var(--mz-warning)" : "var(--mz-ink-4)"
                return (
                  <div key={i} style={{ display: "flex", gap: 10, padding: "10px 12px", background: bg, borderRadius: 8, border: `1px solid ${dot}22` }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: dot, marginTop: 5, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: 13, color: "var(--mz-ink-2)", lineHeight: 1.5 }}>{r.label}</span>
                    </div>
                    <span style={{
                      fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", flexShrink: 0, marginTop: 2,
                      color: dot,
                    }}>{r.severity}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Module quick-access */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--mz-ink)" }}>Intelligence Modules</h2>
            <span style={{ fontSize: 13, color: "var(--mz-ink-3)" }}>6 modules · 2 require Pro</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
            {MODULES.map(mod => (
              <a
                key={mod.key}
                href={mod.href}
                style={{
                  display: "flex", alignItems: "center", gap: 14,
                  padding: "18px 20px", borderRadius: 14,
                  background: "var(--mz-white)", border: "1px solid var(--mz-border-2)",
                  textDecoration: "none", position: "relative", overflow: "hidden",
                  transition: "border-color var(--t-fast) var(--ease-out), box-shadow var(--t-fast) var(--ease-out)",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = mod.color; (e.currentTarget as HTMLElement).style.boxShadow = "var(--mz-shadow-md)" }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--mz-border-2)"; (e.currentTarget as HTMLElement).style.boxShadow = "none" }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 10, background: `${mod.color}18`, display: "grid", placeItems: "center", flexShrink: 0 }}>
                  <mod.icon size={18} style={{ color: mod.color }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "var(--mz-ink)", display: "flex", alignItems: "center", gap: 6 }}>
                    {mod.label}
                    {mod.badge && (
                      <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.06em", background: "var(--mz-orange)", color: "white", padding: "1px 6px", borderRadius: 99 }}>PRO</span>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--mz-ink-4)", marginTop: 2 }}>{mod.sub}</div>
                </div>
                <ArrowRight size={14} style={{ color: "var(--mz-ink-4)", flexShrink: 0 }} />
              </a>
            ))}
          </div>
        </div>

        {/* Pro upsell banner */}
        <div style={{
          padding: "20px 24px", borderRadius: 14,
          background: "linear-gradient(135deg, var(--mz-graphite) 0%, #2a2f35 100%)",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(255,106,0,.15)", border: "1px solid rgba(255,106,0,.3)", display: "grid", placeItems: "center" }}>
              <Zap size={20} style={{ color: "var(--mz-orange)" }} />
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "white" }}>Unlock the full intelligence suite</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,.5)", marginTop: 2 }}>Challenge Mode, Valuation, Fundraising, Simulations + watermark-free exports</div>
            </div>
          </div>
          <a href="/pricing" className="btn btn--primary btn--sm" style={{ whiteSpace: "nowrap" }}>
            Upgrade to Pro · $49/mo
          </a>
        </div>

      </div>
    </>
  )
}
