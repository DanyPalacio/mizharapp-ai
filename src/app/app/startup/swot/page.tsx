"use client"

import { useState } from "react"
import Topbar from "@/components/layout/topbar"
import { Plus, RefreshCw } from "lucide-react"

const INITIAL_SWOT = {
  strengths: [
    "Proprietary ML pipeline with 14M+ training data points",
    "91% candidate fit score accuracy vs. 78% human screeners",
    "Net Promoter Score of 62 — top quartile for B2B SaaS",
    "Low monthly churn (< 2%) indicating strong product-market fit",
    "First-mover position in SMB AI-native ATS category",
  ],
  weaknesses: [
    "No enterprise sales motion or enterprise AE hired yet",
    "Single-product revenue concentration — zero upsell revenue today",
    "Organic CAC increasing as content ROI decays (−34% YoY)",
    "Founder team lacks GTM/sales DNA — all technical",
    "18-month runway requires fundraise within 6 months",
  ],
  opportunities: [
    "Enterprise AI procurement budgets up 42% YoY (Gartner 2025)",
    "EEOC AI bias guidance creates compliance wedge for auditable AI",
    "Incumbent ATS platforms (Workday, Greenhouse) slow to ship AI",
    "Channel partnership with PEO/HR services companies (untapped)",
    "International expansion — EU GDPR-compliant recruiting AI scarce",
  ],
  threats: [
    "Workday acquired a direct competitor for $440M in Q1 2026",
    "YC W26 batch includes 4 new AI recruiting companies",
    "Google and LinkedIn expanding native hiring AI features",
    "CAC inflation as paid channels become more competitive",
    "Potential regulatory restrictions on AI in employment decisions",
  ],
}

const QUADRANT_META = {
  strengths:     { label: "Strengths",     color: "var(--mz-success)",  bg: "var(--mz-success-50)",  border: "rgba(52,199,89,.2)",   dot: "#34C759", abbr: "S" },
  weaknesses:    { label: "Weaknesses",    color: "var(--mz-danger)",   bg: "var(--mz-danger-50)",   border: "rgba(255,69,58,.2)",   dot: "#FF453A", abbr: "W" },
  opportunities: { label: "Opportunities", color: "#0A84FF",            bg: "rgba(10,132,255,.06)",  border: "rgba(10,132,255,.2)",  dot: "#0A84FF", abbr: "O" },
  threats:       { label: "Threats",       color: "var(--mz-warning)",  bg: "var(--mz-warning-50)",  border: "rgba(255,159,10,.2)",  dot: "#FF9F0A", abbr: "T" },
}

type Quadrant = keyof typeof INITIAL_SWOT

export default function SwotPage() {
  const [swot, setSwot] = useState(INITIAL_SWOT)
  const [editing, setEditing] = useState<{ q: Quadrant; i: number } | null>(null)
  const [editText, setEditText] = useState("")

  const startEdit = (q: Quadrant, i: number) => {
    setEditing({ q, i })
    setEditText(swot[q][i])
  }

  const saveEdit = () => {
    if (!editing || !editText.trim()) return
    setSwot(prev => ({
      ...prev,
      [editing.q]: prev[editing.q].map((item, i) => i === editing.i ? editText.trim() : item),
    }))
    setEditing(null)
  }

  const addItem = (q: Quadrant) => {
    setSwot(prev => ({ ...prev, [q]: [...prev[q], "New item — click to edit"] }))
    setTimeout(() => startEdit(q, swot[q].length), 50)
  }

  return (
    <>
      <Topbar
        crumbs={[{ label: "Startup" }, { label: "SWOT Analysis" }]}
        meta={[{ label: "AI-generated · Click any item to edit" }]}
        actions={
          <button className="btn btn--secondary btn--sm" style={{ gap: 6 }}>
            <RefreshCw size={13} /> Regenerate
          </button>
        }
      />

      <div style={{ padding: "32px 40px" }}>
        {/* SWOT legend */}
        <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
          {(Object.entries(QUADRANT_META) as [Quadrant, typeof QUADRANT_META[Quadrant]][]).map(([key, meta]) => (
            <div key={key} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 20, height: 20, borderRadius: 6, background: meta.bg, border: `1px solid ${meta.border}`, display: "grid", placeItems: "center" }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: meta.color }}>{meta.abbr}</span>
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--mz-ink-2)" }}>{meta.label}</span>
              <span style={{ fontSize: 12, color: "var(--mz-ink-4)" }}>({swot[key].length})</span>
            </div>
          ))}
        </div>

        {/* 2×2 grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, minHeight: "calc(100vh - 280px)" }}>
          {(Object.entries(INITIAL_SWOT) as [Quadrant, string[]][]).map(([quadrant]) => {
            const meta = QUADRANT_META[quadrant]
            const items = swot[quadrant]
            return (
              <div
                key={quadrant}
                style={{
                  background: meta.bg,
                  border: `1px solid ${meta.border}`,
                  borderRadius: 16,
                  padding: "20px 22px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: meta.color, display: "grid", placeItems: "center" }}>
                    <span style={{ fontSize: 12, fontWeight: 800, color: "white" }}>{meta.abbr}</span>
                  </div>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--mz-ink)" }}>{meta.label}</span>
                  <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--mz-ink-4)" }}>{items.length} items</span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                  {items.map((item, i) => {
                    const isEditing = editing?.q === quadrant && editing?.i === i
                    return (
                      <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: meta.dot, marginTop: 7, flexShrink: 0 }} />
                        {isEditing ? (
                          <input
                            autoFocus
                            value={editText}
                            onChange={e => setEditText(e.target.value)}
                            onBlur={saveEdit}
                            onKeyDown={e => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") setEditing(null) }}
                            style={{
                              flex: 1, fontSize: 13, color: "var(--mz-ink)", background: "var(--mz-white)",
                              border: `2px solid ${meta.color}`, borderRadius: 6, padding: "4px 8px",
                              outline: "none", lineHeight: 1.5,
                            }}
                          />
                        ) : (
                          <span
                            onClick={() => startEdit(quadrant, i)}
                            style={{ fontSize: 13, color: "var(--mz-ink-2)", lineHeight: 1.55, cursor: "text", flex: 1 }}
                          >
                            {item}
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>

                <button
                  onClick={() => addItem(quadrant)}
                  style={{
                    display: "flex", alignItems: "center", gap: 6, marginTop: 12,
                    padding: "7px 12px", borderRadius: 8, width: "fit-content",
                    background: "none", border: `1px dashed ${meta.color}55`,
                    color: meta.color, fontSize: 12, fontWeight: 600, cursor: "pointer",
                  }}
                >
                  <Plus size={12} /> Add item
                </button>
              </div>
            )
          })}
        </div>

        {/* Strategic implications */}
        <div className="card" style={{ marginTop: 24 }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--mz-ink)", marginBottom: 16 }}>Strategic Implications</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { label: "SO Strategy (Strength → Opportunity)", desc: "Deploy ML accuracy advantage into EEOC compliance wedge — position as 'auditable AI' to enterprise buyers navigating new hiring regulations.", color: "var(--mz-success)" },
              { label: "WO Strategy (Weakness → Opportunity)", desc: "Hire an enterprise AE with PEO relationships to unlock channel partnership motion, bypassing direct CAC headwind.", color: "#0A84FF" },
              { label: "ST Strategy (Strength → Threat)", desc: "Publish benchmark data from the 14M dataset to establish thought leadership before incumbents can commoditize the AI layer.", color: "var(--mz-orange)" },
              { label: "WT Strategy (Weakness → Threat)", desc: "Accelerate the seed close before competitive noise from YC W26 and Workday M&A tightens Series A terms.", color: "var(--mz-danger)" },
            ].map(strat => (
              <div key={strat.label} style={{ padding: "14px 16px", background: "var(--mz-cloud)", borderRadius: 10, border: "1px solid var(--mz-border-2)" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: strat.color, letterSpacing: "0.04em", marginBottom: 6 }}>{strat.label}</div>
                <div style={{ fontSize: 13, color: "var(--mz-ink-2)", lineHeight: 1.55 }}>{strat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
