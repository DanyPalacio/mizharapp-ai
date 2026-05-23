"use client"

import Topbar from "@/components/layout/topbar"
import { Globe, TrendingUp, TrendingDown, ExternalLink, BarChart2 } from "lucide-react"

const TAM_DATA = { tam: 28.4, sam: 4.1, som: 0.38 }

const TREND_ITEMS = [
  { keyword: "AI recruiting software",   volume: "8,100/mo",  trend: +34, sparkline: [40, 55, 48, 62, 71, 80, 88] },
  { keyword: "automated candidate screening", volume: "3,600/mo", trend: +22, sparkline: [30, 35, 38, 42, 50, 55, 62] },
  { keyword: "ATS alternative",          volume: "5,400/mo",  trend: +8,  sparkline: [60, 58, 62, 65, 64, 66, 68] },
  { keyword: "HR analytics platform",    volume: "2,900/mo",  trend: -5,  sparkline: [72, 70, 68, 65, 62, 60, 58] },
]

const BENCHMARKS = [
  { label: "Recruiting software market CAGR",  value: "14.2%",  source: "Gartner 2025" },
  { label: "AI adoption in HR (enterprise)",   value: "61%",    source: "Deloitte 2025" },
  { label: "Avg deal size (mid-market ATS)",    value: "$24K",   source: "G2 Crowd" },
  { label: "Time-to-hire improvement with AI", value: "38%",    source: "McKinsey 2024" },
  { label: "Recruiting tech consolidation",    value: "32% M&A", source: "PitchBook Q1 2026" },
  { label: "PE investment in HR tech",         value: "$3.2B",   source: "Crunchbase 2025" },
]

const NEWS = [
  { headline: "Workday acquires AI recruiting startup for $440M to bolster HCM suite", source: "TechCrunch", days: 2, sentiment: "threat" },
  { headline: "Enterprise hiring intentions rise for Q3 2026 — demand signal for recruiting tools", source: "LinkedIn Economic Graph", days: 5, sentiment: "opportunity" },
  { headline: "EEOC issues new AI bias guidance for automated hiring systems", source: "Reuters", days: 8, sentiment: "regulatory" },
  { headline: "YC W26 batch includes 4 new AI recruiting companies", source: "Y Combinator", days: 14, sentiment: "threat" },
]

export default function MarketPage() {
  const total = TAM_DATA.tam
  const samPct = (TAM_DATA.sam / total) * 100
  const somPct = (TAM_DATA.som / total) * 100

  const sparklineStr = (pts: number[]) => {
    const w = 64, h = 24
    const min = Math.min(...pts), max = Math.max(...pts)
    const toX = (i: number) => (i / (pts.length - 1)) * w
    const toY = (v: number) => h - ((v - min) / (max - min)) * h
    return pts.map((v, i) => `${toX(i)},${toY(v)}`).join(" ")
  }

  return (
    <>
      <Topbar
        crumbs={[{ label: "Startup" }, { label: "Market Intelligence" }]}
        meta={[{ label: "Live data · FRED + Google Trends + Crunchbase" }]}
      />

      <div style={{ padding: "32px 40px", display: "flex", flexDirection: "column", gap: 24 }}>
        {/* TAM/SAM/SOM */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div className="card">
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <Globe size={16} style={{ color: "var(--mz-orange)" }} />
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--mz-ink)" }}>Market Sizing</h3>
            </div>
            {/* Nested circles visualization */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { label: "TAM — Total Addressable Market", value: `$${TAM_DATA.tam}B`, desc: "Global recruiting software market", pct: 100, color: "var(--mz-orange)" },
                { label: "SAM — Serviceable Addressable", value: `$${TAM_DATA.sam}B`, desc: "Mid-market + enterprise AI ATS buyers in NA/EU", pct: samPct, color: "#0A84FF" },
                { label: "SOM — Serviceable Obtainable",  value: `$${TAM_DATA.som}B`, desc: "Realistic 3-year capture at current GTM velocity", pct: somPct, color: "var(--mz-success)" },
              ].map(item => (
                <div key={item.label}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "var(--mz-ink-2)" }}>{item.label}</div>
                      <div style={{ fontSize: 11, color: "var(--mz-ink-4)" }}>{item.desc}</div>
                    </div>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--mz-ink)", letterSpacing: "-0.02em" }}>{item.value}</div>
                  </div>
                  <div style={{ height: 6, background: "var(--mz-cloud)", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${item.pct}%`, background: item.color, borderRadius: 99 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Benchmarks */}
          <div className="card">
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <BarChart2 size={16} style={{ color: "var(--mz-orange)" }} />
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--mz-ink)" }}>Industry Benchmarks</h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {BENCHMARKS.map(b => (
                <div key={b.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "var(--mz-cloud)", borderRadius: 8 }}>
                  <div>
                    <div style={{ fontSize: 12, color: "var(--mz-ink-2)", fontWeight: 500 }}>{b.label}</div>
                    <div style={{ fontSize: 10, color: "var(--mz-ink-4)", marginTop: 2 }}>{b.source}</div>
                  </div>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--mz-orange)", letterSpacing: "-0.01em", whiteSpace: "nowrap", marginLeft: 12 }}>{b.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Google Trends proxy */}
        <div className="card">
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--mz-ink)" }}>Keyword Demand Trends</h3>
            <p style={{ fontSize: 13, color: "var(--mz-ink-3)", marginTop: 4 }}>12-month search volume trend — Google Trends proxy via Mizhar intelligence</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {TREND_ITEMS.map(item => (
              <div key={item.keyword} style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 16px", background: "var(--mz-cloud)", borderRadius: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--mz-ink)" }}>{item.keyword}</div>
                  <div style={{ fontSize: 11, color: "var(--mz-ink-4)", marginTop: 2 }}>{item.volume} avg</div>
                </div>
                <svg width={64} height={24}>
                  <polyline
                    points={sparklineStr(item.sparkline)}
                    fill="none"
                    stroke={item.trend > 0 ? "var(--mz-success)" : "var(--mz-danger)"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div style={{ display: "flex", alignItems: "center", gap: 4, width: 60, justifyContent: "flex-end" }}>
                  {item.trend > 0 ? <TrendingUp size={14} style={{ color: "var(--mz-success)" }} /> : <TrendingDown size={14} style={{ color: "var(--mz-danger)" }} />}
                  <span style={{ fontSize: 13, fontWeight: 700, color: item.trend > 0 ? "var(--mz-success)" : "var(--mz-danger)" }}>
                    {item.trend > 0 ? "+" : ""}{item.trend}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Market news */}
        <div className="card">
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--mz-ink)", marginBottom: 16 }}>Market Intelligence Feed</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {NEWS.map((item, i) => {
              const bg = item.sentiment === "threat" ? "var(--mz-danger-50)" : item.sentiment === "opportunity" ? "var(--mz-success-50)" : "var(--mz-warning-50)"
              const color = item.sentiment === "threat" ? "var(--mz-danger)" : item.sentiment === "opportunity" ? "var(--mz-success)" : "var(--mz-warning)"
              return (
                <div key={i} style={{ display: "flex", gap: 12, padding: "14px 16px", background: "var(--mz-cloud)", borderRadius: 10, border: "1px solid var(--mz-border-2)" }}>
                  <span style={{ padding: "3px 8px", borderRadius: 99, background: bg, color, fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", whiteSpace: "nowrap", height: "fit-content", marginTop: 2 }}>
                    {item.sentiment}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--mz-ink)", lineHeight: 1.4 }}>{item.headline}</div>
                    <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                      <span style={{ fontSize: 11, color: "var(--mz-ink-4)" }}>{item.source}</span>
                      <span style={{ fontSize: 11, color: "var(--mz-ink-4)" }}>·</span>
                      <span style={{ fontSize: 11, color: "var(--mz-ink-4)" }}>{item.days}d ago</span>
                    </div>
                  </div>
                  <ExternalLink size={14} style={{ color: "var(--mz-ink-4)", flexShrink: 0, marginTop: 3 }} />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
