"use client"

import Topbar from "@/components/layout/topbar"
import { Users, ExternalLink, TrendingUp } from "lucide-react"

const COMPETITORS = [
  {
    name: "Greenhouse",
    stage: "Public (via Thrive Capital)",
    arr: "$180M+",
    funding: "$500M+",
    positioning: "Enterprise ATS market leader",
    strengths: ["Brand recognition", "Deep ATS integrations", "Enterprise compliance"],
    weaknesses: ["Legacy UI", "No native AI", "High implementation cost"],
    threat: "high",
    moatGap: "They own the ATS workflow layer but have no AI-native intelligence layer — our wedge.",
  },
  {
    name: "Lever",
    stage: "Acquired by Employ Inc.",
    arr: "$60M est.",
    funding: "N/A (acquired)",
    positioning: "Mid-market collaborative hiring",
    strengths: ["Clean UX", "Strong DEI features", "Good API"],
    weaknesses: ["Post-acquisition drift", "No ML scoring", "Shrinking team"],
    threat: "medium",
    moatGap: "Integration opportunity: Lever customers want AI scoring without leaving their ATS.",
  },
  {
    name: "Ashby",
    stage: "Series B ($75M raised)",
    arr: "$25M est.",
    funding: "$75M",
    positioning: "Analytics-first modern ATS",
    strengths: ["Best-in-class analytics", "Strong PLG", "Fast-growing"],
    weaknesses: ["Narrow ICP (tech companies)", "No predictive AI", "Limited enterprise"],
    threat: "high",
    moatGap: "Overlapping ICP. They will likely build or buy AI scoring in 12–18 months.",
  },
  {
    name: "Paradox (Olivia)",
    stage: "Series C ($200M+ raised)",
    arr: "$50M est.",
    funding: "$200M+",
    positioning: "Conversational AI for high-volume hiring",
    strengths: ["AI-native", "High-volume niche", "Fortune 500 clients"],
    weaknesses: ["Narrow use case", "Not analytical", "Expensive"],
    threat: "low",
    moatGap: "Different buyer (ops vs. HR analytics). Potential partner for high-volume + intelligence.",
  },
]

const THREAT_META = {
  high:   { color: "var(--mz-danger)",  bg: "var(--mz-danger-50)",  label: "High Threat" },
  medium: { color: "var(--mz-warning)", bg: "var(--mz-warning-50)", label: "Medium" },
  low:    { color: "var(--mz-success)", bg: "var(--mz-success-50)", label: "Low Threat" },
}

const POSITIONING_AXES = [
  { x: 75, y: 20, label: "Greenhouse",  color: "#FF453A" },
  { x: 55, y: 40, label: "Lever",       color: "#FF9F0A" },
  { x: 65, y: 65, label: "Ashby",       color: "#BF5AF2" },
  { x: 30, y: 80, label: "Paradox",     color: "#64D2FF" },
  { x: 80, y: 75, label: "MIZHAR",      color: "var(--mz-orange)", size: 14, highlight: true },
]

export default function CompetitorsPage() {
  return (
    <>
      <Topbar
        crumbs={[{ label: "Startup" }, { label: "Competitors" }]}
        meta={[{ label: `${COMPETITORS.length} tracked · Updated 3 days ago` }]}
      />

      <div style={{ padding: "32px 40px", display: "flex", flexDirection: "column", gap: 24 }}>
        {/* Positioning map */}
        <div className="card">
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--mz-ink)", marginBottom: 4 }}>Competitive Positioning Map</h3>
          <p style={{ fontSize: 13, color: "var(--mz-ink-3)", marginBottom: 20 }}>AI Sophistication (X-axis) vs. Enterprise Readiness (Y-axis)</p>
          <div style={{ position: "relative", background: "var(--mz-cloud)", borderRadius: 12, overflow: "hidden", height: 320 }}>
            {/* Axis labels */}
            <div style={{ position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)", fontSize: 11, color: "var(--mz-ink-4)" }}>← Less AI native &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; AI-native →</div>
            <div style={{ position: "absolute", top: "50%", left: 8, transform: "rotate(-90deg) translateX(-50%)", fontSize: 11, color: "var(--mz-ink-4)", transformOrigin: "left center", whiteSpace: "nowrap" }}>← SMB &nbsp;&nbsp; Enterprise →</div>
            {/* Grid */}
            <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
              <line x1="50%" y1="0" x2="50%" y2="100%" stroke="var(--mz-border)" strokeWidth={1} strokeDasharray="4,4" />
              <line x1="0" y1="50%" x2="100%" y2="50%" stroke="var(--mz-border)" strokeWidth={1} strokeDasharray="4,4" />
              {/* Quadrant labels */}
              <text x="25%" y="25%" fontSize={10} fill="var(--mz-ink-4)" textAnchor="middle">SMB / Low AI</text>
              <text x="75%" y="25%" fontSize={10} fill="var(--mz-ink-4)" textAnchor="middle">SMB / High AI</text>
              <text x="25%" y="75%" fontSize={10} fill="var(--mz-ink-4)" textAnchor="middle">Enterprise / Low AI</text>
              <text x="75%" y="75%" fontSize={10} fill="var(--mz-orange)" textAnchor="middle" fontWeight="700">Enterprise / High AI ⭐</text>
            </svg>
            {/* Competitor dots */}
            {POSITIONING_AXES.map(comp => (
              <div
                key={comp.label}
                style={{
                  position: "absolute",
                  left: `${comp.x}%`,
                  top: `${100 - comp.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div style={{
                  width: comp.highlight ? 40 : 28, height: comp.highlight ? 40 : 28,
                  borderRadius: "50%",
                  background: comp.highlight ? "var(--mz-orange)" : comp.color + "33",
                  border: `3px solid ${comp.color}`,
                  display: "grid", placeItems: "center",
                  boxShadow: comp.highlight ? "0 0 24px rgba(255,106,0,.4)" : "none",
                }}>
                  {comp.highlight && <span style={{ fontSize: 10, fontWeight: 900, color: "white" }}>M</span>}
                </div>
                <div style={{
                  position: "absolute", top: comp.highlight ? 46 : 34, left: "50%", transform: "translateX(-50%)",
                  fontSize: comp.highlight ? 12 : 11, fontWeight: comp.highlight ? 700 : 500,
                  color: comp.color, whiteSpace: "nowrap",
                }}>{comp.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Competitor cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {COMPETITORS.map(comp => {
            const threat = THREAT_META[comp.threat as keyof typeof THREAT_META]
            return (
              <div key={comp.name} className="card" style={{ padding: "20px 24px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--mz-cloud)", display: "grid", placeItems: "center" }}>
                      <Users size={18} style={{ color: "var(--mz-ink-3)" }} />
                    </div>
                    <div>
                      <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--mz-ink)" }}>{comp.name}</div>
                      <div style={{ fontSize: 12, color: "var(--mz-ink-4)", marginTop: 2 }}>{comp.stage} · {comp.positioning}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 11, color: "var(--mz-ink-4)" }}>Est. ARR</div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: "var(--mz-ink)" }}>{comp.arr}</div>
                    </div>
                    <span style={{ padding: "4px 10px", borderRadius: 99, background: threat.bg, color: threat.color, fontSize: 11, fontWeight: 700 }}>{threat.label}</span>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--mz-success)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>Strengths</div>
                    {comp.strengths.map((s, i) => <div key={i} style={{ fontSize: 12, color: "var(--mz-ink-2)", marginBottom: 4, display: "flex", gap: 6 }}><span style={{ color: "var(--mz-success)" }}>+</span>{s}</div>)}
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--mz-danger)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>Weaknesses</div>
                    {comp.weaknesses.map((s, i) => <div key={i} style={{ fontSize: 12, color: "var(--mz-ink-2)", marginBottom: 4, display: "flex", gap: 6 }}><span style={{ color: "var(--mz-danger)" }}>−</span>{s}</div>)}
                  </div>
                  <div style={{ background: "var(--mz-orange-50)", borderRadius: 10, padding: "12px 14px", border: "1px solid var(--mz-orange-100)" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--mz-orange)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>Your Moat Gap</div>
                    <div style={{ fontSize: 12, color: "var(--mz-ink-2)", lineHeight: 1.5 }}>{comp.moatGap}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
